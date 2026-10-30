import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import type { RawEditorOptions } from 'tinymce';
import { firstValueFrom } from 'rxjs';
import { environment } from 'environments/environment';

export interface ContentImageUpload {
  imageUrl: string;
  width: number;
  height: number;
}

/** Add to a component's `providers` so its TinyMCE editors load the copy shipped with the admin (no Tiny Cloud). */
export const SELF_HOSTED_TINYMCE = { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' };

export type PostEditorKind = 'post' | 'faq' | 'job';

/**
 * TinyMCE setup for post text (blog body, FAQ answers, news, careers). Images added with the button,
 * pasted or dropped are uploaded as files, so the HTML holds a URL instead of a base64 copy.
 */
@Injectable({ providedIn: 'root' })
export class ContentImageService {
  private readonly uploadUrl = `${environment.apiUrl}/admin/upload_content_image`;

  constructor(private http: HttpClient) {}

  /** Uploads one image (our HttpClient, so the login token is added). */
  async upload(blob: Blob, fileName: string): Promise<ContentImageUpload> {
    const data = new FormData();
    data.append('file', blob, fileName || 'image.png');
    try {
      return await firstValueFrom(this.http.post<ContentImageUpload>(this.uploadUrl, data));
    } catch (error) {
      throw (error as HttpErrorResponse)?.error?.message || 'The image could not be uploaded.';
    }
  }

  tinyConfig(kind: PostEditorKind): RawEditorOptions {
    const withHeadings = kind !== 'faq';
    return {
      license_key: 'gpl',
      menubar: false,
      branding: false,
      promotion: false,
      height: kind === 'post' ? 600 : kind === 'faq' ? 220 : 420,
      plugins: 'lists link image autolink code table wordcount codesample searchreplace fullscreen preview visualblocks anchor',
      // One toolbar: its groups flow onto the next line only when the editor is too narrow.
      toolbar:
        'undo redo | ' +
        (withHeadings ? 'blocks | ' : '') +
        'bold italic underline strikethrough superscript subscript | alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | blockquote link anchor image' +
        (withHeadings ? ' table' : '') +
        ' codesample hr | searchreplace visualblocks preview fullscreen | removeformat code',
      toolbar_mode: 'wrap',
      // Keep menus beside the editor inside scrollable Material forms.
      ui_mode: 'split',
      // The toolbar stays visible while scrolling a long post, below the admin's fixed top bar.
      toolbar_sticky: true,
      toolbar_sticky_offset: 60,
      // Links: open in a new window, and nofollow for links we do not vouch for (SEO).
      link_title: true,
      link_target_list: [
        { title: 'Same window', value: '' },
        { title: 'New window', value: '_blank' },
      ],
      link_rel_list: [
        { title: 'None', value: '' },
        { title: 'nofollow', value: 'nofollow' },
        { title: 'sponsored', value: 'sponsored nofollow' },
      ],
      codesample_languages: [
        { text: 'HTML/XML', value: 'markup' },
        { text: 'JavaScript', value: 'javascript' },
        { text: 'TypeScript', value: 'typescript' },
        { text: 'CSS', value: 'css' },
        { text: 'JSON', value: 'json' },
        { text: 'Bash', value: 'bash' },
        { text: 'Python', value: 'python' },
        { text: 'Java', value: 'java' },
        { text: 'C#', value: 'csharp' },
        { text: 'SQL', value: 'sql' },
      ],
      // The post title is the page's H1, so the text starts at H2 (H2 headings build the table of contents).
      block_formats: 'Paragraph=p; Heading 2=h2; Heading 3=h3; Heading 4=h4',
      // Images keep the width of the column on the website, so no resizing in the editor.
      object_resizing: false,
      image_dimensions: false,
      image_description: true,
      // Pasted and dropped images are uploaded too.
      paste_data_images: true,
      automatic_uploads: true,
      images_reuse_filename: false,
      images_upload_handler: async (blobInfo) => (await this.upload(blobInfo.blob(), blobInfo.filename())).imageUrl,
      // Clean HTML: no fonts or scripts, keep the full image URLs.
      invalid_elements: 'font,script,style,iframe,object,embed',
      // Keep the size and lazy-loading attributes the backend adds to images.
      extended_valid_elements: 'img[src|alt|title|width|height|loading|decoding|class]',
      forced_root_block: 'p',
      convert_urls: false,
      entity_encoding: 'raw',
      // A heading is one line: Shift+Enter inside a heading starts a new paragraph like Enter, instead of a
      // line break that keeps the next line inside the heading (changing that line's format would then
      // change the heading too).
      setup: (editor) => {
        editor.on('keydown', (event: KeyboardEvent) => {
          if (event.key === 'Enter' && event.shiftKey && editor.dom.getParent(editor.selection.getNode(), 'h1,h2,h3,h4,h5,h6')) {
            event.preventDefault();
            editor.execCommand('mceInsertNewLine');
          }
        });
      },
      content_style:
        'body { font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; } img { max-width: 100%; height: auto; }' +
        // Posts saved before show alignment/indent as classes (the backend converts the styles on save).
        ' .post-align-center { text-align: center; } .post-align-right { text-align: right; } .post-align-justify { text-align: justify; }' +
        ' .post-indent-1 { padding-left: 40px; } .post-indent-2 { padding-left: 80px; } .post-indent-3 { padding-left: 120px; } .post-indent-4 { padding-left: 160px; }',
    };
  }
}
