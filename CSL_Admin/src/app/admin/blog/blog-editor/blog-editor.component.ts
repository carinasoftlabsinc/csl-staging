import { Component, HostListener, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, CanDeactivateFn, Router } from '@angular/router';
import type { RawEditorOptions } from 'tinymce';
import { BlogFaq, BlogService } from 'app/admin/blog.service';
import { ContentImageService, SELF_HOSTED_TINYMCE } from 'app/admin/content-editor/content-image.service';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

type FaqGroup = FormGroup<{
  _id: FormControl<string | null>;
  question: FormControl<string>;
  answer: FormControl<string>;
}>;

/** "My Blog Title!" -> "my-blog-title" (same rule as the backend). */
export const slugify = (value: string): string =>
  (value || '')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Old posts store one entry per heading; the page edits them as one document (same rule as the merge script). */
const sectionsToHtml = (sections: { heading?: string; content?: string }[] = []): string =>
  sections
    .map((s) => {
      const heading = (s.heading || '').trim();
      const body = (s.content || '').trim();
      return (heading ? `<h2>${escapeHtml(heading)}</h2>` : '') + body;
    })
    .filter(Boolean)
    .join('\n');

const hasText = (html: string | null | undefined): boolean =>
  !!html && (/<img\b/i.test(html) || !!html.replace(/<[^>]*>/g, '').replace(/&nbsp;|\s/g, ''));

const SEO_TITLE_LIMIT = 60;
const SEO_DESCRIPTION_LIMIT = 160;

@Component({
  selector: 'app-blog-editor',
  templateUrl: './blog-editor.component.html',
  styleUrls: ['./blog-editor.component.scss'],
  providers: [SELF_HOSTED_TINYMCE],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BlogEditorComponent implements OnInit, OnDestroy {
  mode: 'add' | 'edit' = 'add';
  blogId: string | null = null;
  isLoading = false;
  isSaving = false;
  loadError = '';
  /** True after a save attempt, so empty required fields show their error. */
  submitted = false;
  readonly imageBaseUrl = environment.imageBaseUrl;
  readonly categories = [
    { value: 'game', label: 'Game Development' },
    { value: 'web', label: 'Web Development' },
    { value: 'app', label: 'App Development' },
    { value: 'digital-marketing', label: 'Digital Marketing' },
  ];

  readonly contentConfig: RawEditorOptions;
  readonly faqConfig: RawEditorOptions;

  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    titleLink: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    category: new FormControl<string | null>(null),
    author: new FormControl<string | null>(null),
    date: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
    isFeature: new FormControl(false, { nonNullable: true }),
    seoTitle: new FormControl('', { nonNullable: true }),
    seoDescription: new FormControl('', { nonNullable: true }),
    image: new FormControl<File | string | null>(null, Validators.required),
    image_2: new FormControl<File | string | null>(null, Validators.required),
    content: new FormControl('', { nonNullable: true }),
    faqs: new FormArray<FaqGroup>([]),
  });

  private linkEdited = false;
  private saved = false;
  private subs = new Subscription();

  constructor(
    private service: BlogService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    contentImages: ContentImageService
  ) {
    this.contentConfig = contentImages.tinyConfig('post');
    this.faqConfig = contentImages.tinyConfig('faq');
  }

  get faqs(): FormArray<FaqGroup> {
    return this.form.controls.faqs;
  }

  ngOnInit(): void {
    // New posts: the link follows the title until someone edits the link.
    this.subs.add(
      this.form.controls.title.valueChanges.subscribe((title) => {
        if (this.mode === 'add' && !this.linkEdited) {
          this.form.controls.titleLink.setValue(slugify(title), { emitEvent: false });
        }
      })
    );

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mode = 'edit';
      this.blogId = id;
      this.load(id);
    }
  }

  private load(id: string) {
    this.isLoading = true;
    this.service.getReqByID(id).subscribe({
      next: (res) => {
        const blog = res?.data?.data;
        if (!blog) {
          this.loadError = 'This blog post was not found.';
          this.isLoading = false;
          return;
        }
        this.form.patchValue({
          title: blog.title || '',
          titleLink: blog.titleLink || '',
          category: blog.category || null,
          author: blog.author || null,
          date: blog.date || null,
          description: blog.description || null,
          isFeature: !!blog.isFeature,
          seoTitle: blog.seoTitle || '',
          seoDescription: blog.seoDescription || '',
          image: blog.image || null,
          image_2: blog.image_2 || null,
          content: blog.content || sectionsToHtml(blog.sections),
        });
        (blog.faqs || []).forEach((faq: BlogFaq) => this.faqs.push(this.faqGroup(faq)));
        this.linkEdited = true;
        this.form.markAsPristine();
        this.isLoading = false;
      },
      error: () => {
        this.loadError = 'The blog post could not be loaded.';
        this.isLoading = false;
      },
    });
  }

  // ---- SEO (search result title and description) ----

  readonly seoTitleLimit = SEO_TITLE_LIMIT;
  readonly seoDescriptionLimit = SEO_DESCRIPTION_LIMIT;

  counterState(length: number, limit: number): 'ok' | 'empty' | 'over' {
    if (!length) return 'empty';
    return length > limit ? 'over' : 'ok';
  }

  onLinkInput() {
    this.linkEdited = true;
  }

  onLinkBlur() {
    const control = this.form.controls.titleLink;
    control.setValue(slugify(control.value));
  }

  // ---- FAQs ----

  private faqGroup(faq?: Partial<BlogFaq>): FaqGroup {
    return new FormGroup({
      _id: new FormControl<string | null>(faq?._id || null),
      question: new FormControl(faq?.question || '', { nonNullable: true }),
      answer: new FormControl(faq?.answer || '', { nonNullable: true }),
    });
  }

  addFaq() {
    this.faqs.push(this.faqGroup());
    this.faqs.markAsDirty();
  }

  moveFaq(index: number, step: -1 | 1) {
    const target = index + step;
    if (target < 0 || target >= this.faqs.length) return;
    // Swap the values instead of the rows: moving a TinyMCE editor in the page would reload it.
    const a = this.faqs.at(index).getRawValue();
    const b = this.faqs.at(target).getRawValue();
    this.faqs.at(index).setValue(b);
    this.faqs.at(target).setValue(a);
    this.faqs.markAsDirty();
  }

  removeFaq(index: number) {
    const faq = this.faqs.at(index).value;
    if (!faq.question && !hasText(faq.answer)) {
      this.faqs.removeAt(index);
      return;
    }
    Swal.fire({
      title: 'Remove this FAQ?',
      text: faq.question || '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Remove',
    }).then((result) => {
      if (result.value) {
        this.faqs.removeAt(index);
        this.faqs.markAsDirty();
      }
    });
  }

  // ---- save ----

  private validationError(): string | null {
    const c = this.form.controls;
    if (c.title.invalid) return 'Title is required.';
    if (!slugify(c.titleLink.value)) return 'Title link is required.';
    if (c.image.invalid) return 'Header image is required.';
    if (c.image_2.invalid) return 'Preview image is required.';
    if (!hasText(c.content.value)) return 'The post is empty. Write the post text.';
    const incomplete = this.faqs.controls.findIndex((g) => {
      const q = g.controls.question.value.trim();
      const a = hasText(g.controls.answer.value);
      return (q && !a) || (!q && a);
    });
    if (incomplete >= 0) return `FAQ ${incomplete + 1} needs both a question and an answer.`;
    return null;
  }

  save() {
    if (this.isSaving) return;
    this.form.markAllAsTouched();
    this.submitted = true;
    const error = this.validationError();
    if (error) {
      this.notify(error, 'snackbar-danger');
      return;
    }

    const v = this.form.getRawValue();
    const faqs: BlogFaq[] = v.faqs
      .filter((f) => f.question.trim() || hasText(f.answer))
      .map((f) => ({ ...(f._id ? { _id: f._id } : {}), question: f.question.trim(), answer: f.answer }));

    this.isSaving = true;
    this.service
      .saveFull(this.blogId, {
        title: v.title.trim(),
        titleLink: slugify(v.titleLink),
        category: v.category,
        description: v.description,
        author: v.author,
        date: v.date,
        isFeature: v.isFeature,
        seoTitle: v.seoTitle.trim() || null,
        seoDescription: v.seoDescription.trim() || null,
        content: v.content,
        faqs,
        image: v.image,
        image_2: v.image_2,
      })
      .subscribe({
        next: () => {
          this.saved = true;
          this.isSaving = false;
          this.notify(this.mode === 'add' ? 'Blog post created' : 'Blog post saved', 'snackbar-success');
          this.router.navigate(['/admin/blogs']);
        },
        error: (err) => {
          this.isSaving = false;
          this.notify(err?.error?.message || err?.message || 'The blog post could not be saved.', 'snackbar-danger');
        },
      });
  }

  cancel() {
    this.router.navigate(['/admin/blogs']);
  }

  // ---- unsaved changes ----

  canLeave(): boolean {
    return this.saved || !this.form.dirty;
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (!this.canLeave()) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  private notify(message: string, panelClass: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass,
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

export const blogEditorLeaveGuard: CanDeactivateFn<BlogEditorComponent> = (component) =>
  component.canLeave() || confirm('You have unsaved changes. Leave this page without saving?');
