import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + '/admin/';

/** Appends a text field, skipping null/undefined so FormData does not send the word "null". */
function appendText(data: FormData, key: string, value: unknown): void {
  if (value !== null && value !== undefined) {
    data.append(key, String(value));
  }
}

export interface BlogFaq {
  _id?: string;
  question: string;
  answer: string;
}

export interface BlogFull {
  title: string;
  titleLink: string;
  category: string | null;
  description: string | null;
  author: string | null;
  date: string | null;
  isFeature: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  content: string;
  faqs: BlogFaq[];
  image: File | string | null;
  image_2: File | string | null;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  getData(
    page: number,
    limit: number,
    filter: string
  ): Observable<{ data: any[]; totalCount: number; page: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('filter', filter);

    return this.http.get<{
      data: any[];
      totalCount: number;
      page: number;
    }>(BACKEND_URL + 'blog_pagination', { params });
  }

  getReqByID(id: string) {
    return this.http.get<any>(BACKEND_URL + 'get_blog/' + id);
  }

  /**
   * Saves a whole blog post from the blog page: details, cover images (a new File or the existing
   * path), the post body and the FAQs. `id` null creates a new post.
   */
  saveFull(id: string | null, blog: BlogFull) {
    const data = new FormData();
    data.append('title', blog.title ?? '');
    data.append('titleLink', blog.titleLink ?? '');
    data.append('category', blog.category ?? '');
    data.append('description', blog.description ?? '');
    data.append('author', blog.author ?? '');
    data.append('date', blog.date ?? '');
    data.append('isFeature', String(!!blog.isFeature));
    data.append('seoTitle', blog.seoTitle ?? '');
    data.append('seoDescription', blog.seoDescription ?? '');
    data.append('content', blog.content ?? '');
    data.append('faqs', JSON.stringify(blog.faqs));
    if (blog.image) data.append('image', blog.image);
    if (blog.image_2) data.append('image_2', blog.image_2);

    const url = id ? `${BACKEND_URL}update_blog_full/${id}` : `${BACKEND_URL}create_blog_full`;
    return this.http.post<{ status: string; data: { blog: any } }>(url, data);
  }

  deleteRequest(id: string): Observable<any> {
    return this.http.post<any>(BACKEND_URL + 'delete_blog/' + id, {});
  }

  //News Room

  getNewsRoomData(
    page: number,
    limit: number,
    filter: string
  ): Observable<{ data: any[]; totalCount: number; page: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('filter', filter);

    return this.http.get<{
      data: any[];
      totalCount: number;
      page: number;
    }>(BACKEND_URL + 'news_pagination', { params });
  }

  AddNews(
    title: any,
    titleLink: any,
    description: any,
    author: any,
    date: any,
    content: any,
    feed: any,
    isFeature: any,
    isPreviousFeature: any,
    image: File | string,
    image_2: File | string
  ) {
    const Data = new FormData();
    Data.append('title', title);
    Data.append('titleLink', titleLink);
    Data.append('description', description);
    Data.append('author', author);
    Data.append('date', date);
    Data.append('content', content);
    Data.append('feed', feed);
    Data.append('isFeature', isFeature);
    Data.append('isPreviousFeature', isPreviousFeature);
    Data.append('image', image);
    Data.append('image_2', image_2);

    return this.http.post<{ message: string; data: any }>(
      `${BACKEND_URL}create_news`,
      Data
    );
  }

  UpdateNews(
    title: any,
    titleLink: any,
    description: any,
    author: any,
    date: any,
    content: any,
    feed: any,
    isFeature: any,
    isPreviousFeature: any,
    image: File | string,
    image_2: File | string,
    _id: string
  ) {
    const Data = new FormData();
    Data.append('title', title);
    Data.append('titleLink', titleLink);
    Data.append('description', description);
    Data.append('author', author);
    Data.append('date', date);
    Data.append('content', content);
    Data.append('feed', feed);
    Data.append('isFeature', isFeature);
    Data.append('isPreviousFeature', isPreviousFeature);
    Data.append('image', image);
    Data.append('image_2', image_2);

    return this.http.post<{ message: string; data: any }>(
      `${BACKEND_URL}update_news/${_id}`,
      Data
    );
  }

  deleteNewsRequest(id: string): Observable<any> {
    return this.http.post<any>(BACKEND_URL + 'delete_news/' + id, {});
  }

  // Contact Data
  getContactData(
    page: number,
    limit: number,
    filter: string
  ): Observable<{ data: any[]; totalCount: number; page: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('filter', filter);

    return this.http.get<{
      data: any[];
      totalCount: number;
      page: number;
    }>(BACKEND_URL + 'getAll_contact_details', { params });
  }

  deleteContactRequest(id: string): Observable<any> {
    return this.http.post<any>(BACKEND_URL + 'delete_contact_data/' + id, {});
  }

  //Project

  getProjectData(
    page: number,
    limit: number,
    filter: string,
    category = 'all'
  ): Observable<{ data: any[]; totalCount: number; page: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('filter', filter);
    if (category !== 'all') {
      params = params.set('category', category);
    }

    return this.http.get<{
      data: any[];
      totalCount: number;
      page: number;
    }>(BACKEND_URL + 'project_pagination', { params });
  }

  /** Saves the display order of one category; ids are in the new order. */
  reorderProjects(category: string, ids: string[]): Observable<unknown> {
    return this.http.post(BACKEND_URL + 'reorder_projects', { category, ids });
  }

  /** Shows (true) or hides (false) a project on the website. */
  setProjectStatus(id: string, isActive: boolean): Observable<unknown> {
    return this.http.post(BACKEND_URL + 'project_status/' + id, { isActive });
  }

  AddProject(
    title: any,
    titleLink: any,
    description: any,
    category: any,
    about_title: any,
    aboutDescription: any,
    content: any,
    solutionContent: any,
    industry: any,
    deliverables: any,
    clientReview: any,
    clientName: any,
    designation: any,
    title_1: any,
    desc_1: any,
    title_2: any,
    desc_2: any,
    title_3: any,
    desc_3: any,
    image: File | string,
    image_2: File | string,
    aboutBg: File | string,
    how_image: File | string,
    tech: string,
    projectLogo: File | string,
    headingIcon: File | string,
    overviewImage: File | string,
    resultImages: (File | string)[] = [],
    uiImages: (File | string)[] = [],
    techImages: (File | string)[] = [],
    development: any,
    workSteps: any,
    overviewPara: any,
    resultHeading_1: any,
    resultHeading_2: any,
    keyHeading: any,
    goalsHeading1: string,
    goalsHeading2: string,
    goalsHeading3: string,
    keyDescription: any,
    userFlowDescription: any
  ) {
    const Data = new FormData();
    appendText(Data, 'title', title);
    appendText(Data, 'titleLink', titleLink);
    appendText(Data, 'description', description);
    appendText(Data, 'category', category);
    appendText(Data, 'about_title', about_title);
    appendText(Data, 'aboutDescription', aboutDescription);
    appendText(Data, 'content', content);
    appendText(Data, 'solutionContent', solutionContent);
    appendText(Data, 'industry', industry);
    appendText(Data, 'deliverables', deliverables);
    appendText(Data, 'clientReview', clientReview);
    appendText(Data, 'clientName', clientName);
    appendText(Data, 'designation', designation);
    appendText(Data, 'title_1', title_1);
    appendText(Data, 'desc_1', desc_1);
    appendText(Data, 'title_2', title_2);
    appendText(Data, 'desc_2', desc_2);
    appendText(Data, 'title_3', title_3);
    appendText(Data, 'desc_3', desc_3);
    appendText(Data, 'overviewPara', overviewPara);
    appendText(Data, 'resultHeading_1', resultHeading_1);
    appendText(Data, 'resultHeading_2', resultHeading_2);
    appendText(Data, 'keyHeading', keyHeading);
    appendText(Data, 'goalsHeading1', goalsHeading1);
    appendText(Data, 'goalsHeading2', goalsHeading2);
    appendText(Data, 'goalsHeading3', goalsHeading3);
    appendText(Data, 'keyDescription', keyDescription);
    appendText(Data, 'userFlowDescription', userFlowDescription);

    // Append files to FormData if they exist
    if (image) Data.append('image', image);
    if (image_2) Data.append('image_2', image_2);
    if (aboutBg) Data.append('aboutBg', aboutBg);
    if (how_image) Data.append('how_image', how_image);
    if (tech) Data.append('tech', tech);
    if (projectLogo) Data.append('projectLogo', projectLogo);
    if (headingIcon) Data.append('headingIcon', headingIcon);
    if (overviewImage) Data.append('overviewImage', overviewImage);

    if (resultImages && resultImages.length > 0) {
      for (let i = 0; i < resultImages.length; i++) {
        Data.append('resultImages', resultImages[i]);
      }
    }
    if (uiImages && uiImages.length > 0) {
      for (let i = 0; i < uiImages.length; i++) {
        Data.append('uiImages', uiImages[i]);
      }
    }

    if (techImages && techImages.length > 0) {
      for (let i = 0; i < techImages.length; i++) {
        Data.append('techImages', techImages[i]);
      }
    }

    Data.append('developement', JSON.stringify(development));
    Data.append('workSteps', JSON.stringify(workSteps));

    return this.http.post<{ message: string; data: any }>(
      `${BACKEND_URL}create_project`,
      Data
    );
  }

  UpdateProject(
    title: any,
    titleLink: any,
    description: any,
    category: any,
    about_title: any,
    aboutDescription: any,
    content: any,
    solutionContent: any,
    industry: any,
    deliverables: any,
    clientReview: any,
    clientName: any,
    designation: any,
    title_1: any,
    desc_1: any,
    title_2: any,
    desc_2: any,
    title_3: any,
    desc_3: any,
    image: File | string,
    image_2: File | string,
    aboutBg: File | string,
    how_image: File | string,
    tech: string,
    projectLogo: File | string,
    headingIcon: File | string,
    overviewImage: File | string,
    resultImages: (File | string)[] = [],
    uiImages: (File | string)[] = [],
    techImages: (File | string)[] = [],
    development: any,
    workSteps: any,
    overviewPara: any,
    resultHeading_1: any,
    resultHeading_2: any,
    keyHeading: any,
    goalsHeading1: string,
    goalsHeading2: string,
    goalsHeading3: string,
    keyDescription: any,
    userFlowDescription: any,
    _id: string
  ) {
    const Data = new FormData();
    appendText(Data, 'title', title);
    appendText(Data, 'titleLink', titleLink);
    appendText(Data, 'description', description);
    appendText(Data, 'category', category);
    appendText(Data, 'about_title', about_title);
    appendText(Data, 'aboutDescription', aboutDescription);
    appendText(Data, 'content', content);
    appendText(Data, 'solutionContent', solutionContent);
    appendText(Data, 'industry', industry);
    appendText(Data, 'deliverables', deliverables);
    appendText(Data, 'clientReview', clientReview);
    appendText(Data, 'clientName', clientName);
    appendText(Data, 'designation', designation);
    appendText(Data, 'title_1', title_1);
    appendText(Data, 'desc_1', desc_1);
    appendText(Data, 'title_2', title_2);
    appendText(Data, 'desc_2', desc_2);
    appendText(Data, 'title_3', title_3);
    appendText(Data, 'desc_3', desc_3);
    appendText(Data, 'overviewPara', overviewPara);
    appendText(Data, 'resultHeading_1', resultHeading_1);
    appendText(Data, 'resultHeading_2', resultHeading_2);
    appendText(Data, 'keyHeading', keyHeading);
    appendText(Data, 'goalsHeading1', goalsHeading1);
    appendText(Data, 'goalsHeading2', goalsHeading2);
    appendText(Data, 'goalsHeading3', goalsHeading3);
    appendText(Data, 'keyDescription', keyDescription);
    appendText(Data, 'userFlowDescription', userFlowDescription);

    // Append files to FormData if they exist
    if (image) Data.append('image', image);
    if (image_2) Data.append('image_2', image_2);
    if (aboutBg) Data.append('aboutBg', aboutBg);
    if (how_image) Data.append('how_image', how_image);
    if (tech) Data.append('tech', tech);
    if (projectLogo) Data.append('projectLogo', projectLogo);
    if (headingIcon) Data.append('headingIcon', headingIcon);
    if (overviewImage) Data.append('overviewImage', overviewImage);

    if (resultImages && resultImages.length > 0) {
      for (let i = 0; i < resultImages.length; i++) {
        Data.append('resultImages', resultImages[i]);
      }
    }

    if (uiImages && uiImages.length > 0) {
      for (let i = 0; i < uiImages.length; i++) {
        Data.append('uiImages', uiImages[i]);
      }
    }

    if (techImages && techImages.length > 0) {
      for (let i = 0; i < techImages.length; i++) {
        Data.append('techImages', techImages[i]);
      }
    }

    Data.append('developement', JSON.stringify(development));
    Data.append('workSteps', JSON.stringify(workSteps));

    return this.http.post<{ message: string; data: any }>(
      `${BACKEND_URL}update_project/${_id}`,
      Data
    );
  }

  deleteProjectRequest(id: string): Observable<any> {
    return this.http.post<any>(BACKEND_URL + 'delete_project/' + id, {});
  }

  // Games

  getGameData(
    page: number,
    limit: number,
    filter: string
  ): Observable<{ data: any[]; totalCount: number; page: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('filter', filter);

    return this.http.get<{
      data: any[];
      totalCount: number;
      page: number;
    }>(BACKEND_URL + 'paginatedgames', { params });
  }

  AddGame(
    name: any,
    iconImage: File | string,
    cardBackgroundImage: File | string,
    ratings: any,
    downloads: any,
    heroImage: File | string,
    online: any,
    playingNow: any,
    heading: any,
    content: any,
    trailerHeading: any,
    trailerImage: File | string,
    trailerLink: any,
    galleryImages: File[] | string[],
    ctaImage: File | string,
    keywords: any,
    platforms: any,
    socialLinks: any,
    ctaHeading: any,
    ctaDescription: any,
    isFeature: any,
    featuredImage: File | string,
    techImages: File[] | string[],
    resultImages: File[] | string[],
    workSteps: any,
    goals: any,
    overviewImage: File | string,
    overviewPara: any,
    industry: any,
    keytasks: any
  ) {
    const Data = new FormData();
    Data.append('name', name);
    Data.append('ratings', ratings);
    Data.append('downloads', downloads);
    Data.append('online', online);
    Data.append('playingNow', playingNow);
    Data.append('heading', heading);
    Data.append('content', content);
    Data.append('trailer.heading', trailerHeading);
    Data.append('trailer.link', trailerLink);
    Data.append('keywords', JSON.stringify(keywords));
    Data.append('platforms', JSON.stringify(platforms));
    Data.append('socialLinks', JSON.stringify(socialLinks));
    Data.append('cta.heading', ctaHeading);
    Data.append('cta.description', ctaDescription);
    Data.append('isFeature', isFeature);

    Data.append('workSteps', JSON.stringify(workSteps));
    Data.append('goals', JSON.stringify(goals));
    Data.append('overviewPara', overviewPara);
    Data.append('industry', industry);
        Data.append('keytasks', JSON.stringify(keytasks));


    // Append files if they exist
    if (iconImage) Data.append('iconImage', iconImage);
    if (cardBackgroundImage)
      Data.append('cardBackgroundImage', cardBackgroundImage);
    if (heroImage) Data.append('heroImage', heroImage);
    if (trailerImage) Data.append('trailerImage', trailerImage);
    if (ctaImage) Data.append('ctaImage', ctaImage);
    if (featuredImage) Data.append('featuredImage', featuredImage);
    if (overviewImage) Data.append('overviewImage', overviewImage);

    // Append gallery images as an array
    if (galleryImages && galleryImages.length) {
      galleryImages.forEach((image) => {
        Data.append(`galleryImages`, image);
      });
    }
    if (techImages && techImages.length) {
      techImages.forEach((image) => {
        Data.append(`techImages`, image);
      });
    }
    if (resultImages && resultImages.length) {
      resultImages.forEach((image) => {
        Data.append(`resultImages`, image);
      });
    }

    return this.http.post<{ message: string; data: any }>(
      `${BACKEND_URL}games`,
      Data
    );
  }

  UpdateGame(
    name: any,
    iconImage: File | string,
    cardBackgroundImage: File | string,
    ratings: any,
    downloads: any,
    heroImage: File | string,
    online: any,
    playingNow: any,
    heading: any,
    content: any,
    trailerHeading: any,
    trailerImage: File | string,
    trailerLink: any,
    galleryImages: File[] | string[],
    ctaImage: File | string,
    keywords: any,
    platforms: any,
    socialLinks: any,
    ctaHeading: any,
    ctaDescription: any,
    isFeature: any,
    featuredImage: File | string,

    techImages: File[] | string[],
    resultImages: File[] | string[],
    workSteps: any,
    goals: any,
    overviewImage: File | string,
    overviewPara: any,
    industry: any,
    keytasks: any,
    _id: string
  ) {
    const Data = new FormData();
    Data.append('name', name);
    Data.append('ratings', ratings);
    Data.append('downloads', downloads);
    Data.append('online', online);
    Data.append('playingNow', playingNow);
    Data.append('heading', heading);
    Data.append('content', content);
    Data.append('trailer.heading', trailerHeading);
    Data.append('trailer.link', trailerLink);
    Data.append('keywords', JSON.stringify(keywords));
    Data.append('platforms', JSON.stringify(platforms));
    Data.append('socialLinks', JSON.stringify(socialLinks));
    Data.append('cta.heading', ctaHeading);
    Data.append('cta.description', ctaDescription);
    Data.append('isFeature', isFeature);

    Data.append('workSteps', JSON.stringify(workSteps));
    Data.append('goals', JSON.stringify(goals));
    Data.append('overviewPara', overviewPara);
    Data.append('industry', industry);
     Data.append('keytasks', JSON.stringify(keytasks));
    // Append files if they exist
    if (iconImage) Data.append('iconImage', iconImage);
    if (cardBackgroundImage)
      Data.append('cardBackgroundImage', cardBackgroundImage);
    if (heroImage) Data.append('heroImage', heroImage);
    if (trailerImage) Data.append('trailerImage', trailerImage);
    if (ctaImage) Data.append('ctaImage', ctaImage);
    if (featuredImage) Data.append('featuredImage', featuredImage);
    if (overviewImage) Data.append('overviewImage', overviewImage);

    // Append gallery images as an array
    if (galleryImages && galleryImages.length) {
      galleryImages.forEach((image) => {
        Data.append(`galleryImages`, image);
      });
    }

    if (techImages && techImages.length) {
      techImages.forEach((image) => {
        Data.append(`techImages`, image);
      });
    }
    if (resultImages && resultImages.length) {
      resultImages.forEach((image) => {
        Data.append(`resultImages`, image);
      });
    }

    return this.http.put<{ message: string; data: any }>(
      `${BACKEND_URL}games/${_id}`,
      Data
    );
  }

  // delete game
  deleteGame(id: string): Observable<any> {
    return this.http.delete<any>(`${BACKEND_URL}games/${id}`);
  }

  // platforms
  getplatformsData(
    page: number,
    limit: number,
    filter: string
  ): Observable<{
    status: string;
    results: number;
    data: { platforms: any[] };
  }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('filter', filter);

    return this.http.get<{
      status: string;
      results: number;
      data: { platforms: any[] };
    }>(BACKEND_URL + 'platforms', { params });
  }

  // TMGS HOME PAGE DATA
  getHomeData(
    page: number,
    limit: number,
    filter: string
  ): Observable<{ data: any[]; totalCount: number; page: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('filter', filter);

    return this.http.get<{
      data: any[];
      totalCount: number;
      page: number;
    }>(BACKEND_URL + 'home', { params });
  }

  AddHome(
    heroSection: {
      heading: string;
      subHeading: string;
      mainTopics: string;
      description: string;
    },
    about: {
      heading: string;
      subHeading: string;
      description: string;
      experience: string;
      points: { pointHeading: string; pointDescription: string }[];
    },
    aboutCardBackgroundImage: File | string,
    games: {
      heading: string;
      subHeading: string;
      description: string;
    },
    ourTeam: {
      heading: string;
      subHeading: string;
      description: string;
      statistics: {
        uniqueDailyUsers: any;
        downloads: any;
        gamesLaunched: any;
        upcomingGames: any;
      };
    },
    visitedEvents: {
      heading: string;
      subHeading: string;
      description: string;
      joinHeading: string;
      joinDescription: string;
    },
    eventImages: File[] | string[],
    career: {
      heading: string;
      subHeading: string;
      description: string;
    },
    cta: {
      heading: string;
      subHeading: string;
      description: string;
    },
    ctaImage: File | string
  ) {
    const Data = new FormData();

    // Hero Section
    Data.append('heroSection.heading', heroSection.heading);
    Data.append('heroSection.subHeading', heroSection.subHeading);
    Data.append('heroSection.mainTopics', heroSection.mainTopics);
    Data.append('heroSection.description', heroSection.description);

    // About Section
    Data.append('about.heading', about.heading);
    Data.append('about.subHeading', about.subHeading);
    Data.append('about.description', about.description);
    Data.append('about.experience', about.experience);
    Data.append('about.points', JSON.stringify(about.points));
    if (aboutCardBackgroundImage)
      Data.append('aboutCardBackgroundImage', aboutCardBackgroundImage);

    // Games Section
    Data.append('games.heading', games.heading);
    Data.append('games.subHeading', games.subHeading);
    Data.append('games.description', games.description);

    // Our Team Section
    Data.append('ourTeam.heading', ourTeam.heading);
    Data.append('ourTeam.subHeading', ourTeam.subHeading);
    Data.append('ourTeam.description', ourTeam.description);
    Data.append(
      'ourTeam.statistics.uniqueDailyUsers',
      ourTeam.statistics.uniqueDailyUsers
    );
    Data.append('ourTeam.statistics.downloads', ourTeam.statistics.downloads);
    Data.append(
      'ourTeam.statistics.gamesLaunched',
      ourTeam.statistics.gamesLaunched
    );
    Data.append(
      'ourTeam.statistics.upcomingGames',
      ourTeam.statistics.upcomingGames
    );

    // Visited Events
    Data.append('visitedEvents.heading', visitedEvents.heading);
    Data.append('visitedEvents.subHeading', visitedEvents.subHeading);
    Data.append('visitedEvents.description', visitedEvents.description);
    Data.append('visitedEvents.joinHeading', visitedEvents.joinHeading);
    Data.append('visitedEvents.joinDescription', visitedEvents.joinDescription);

    // Event Images
    if (eventImages?.length) {
      eventImages.forEach((img) => {
        Data.append('eventImages', img);
      });
    }

    // Career Section
    Data.append('career.heading', career.heading);
    Data.append('career.subHeading', career.subHeading);
    Data.append('career.description', career.description);

    // CTA Section
    Data.append('cta.heading', cta.heading);
    Data.append('cta.subHeading', cta.subHeading);
    Data.append('cta.description', cta.description);
    if (ctaImage) Data.append('ctaImage', ctaImage);

    return this.http.post<{ message: string; data: any }>(
      `${BACKEND_URL}home`,
      Data
    );
  }

  UpdateHome(
    heroSection: {
      heading: string;
      subHeading: string;
      mainTopics: string;
      description: string;
    },
    about: {
      heading: string;
      subHeading: string;
      description: string;
      experience: string;
      points: { pointHeading: string; pointDescription: string }[];
    },
    aboutCardBackgroundImage: File | string,
    games: {
      heading: string;
      subHeading: string;
      description: string;
    },
    ourTeam: {
      heading: string;
      subHeading: string;
      description: string;
      statistics: {
        uniqueDailyUsers: any;
        downloads: any;
        gamesLaunched: any;
        upcomingGames: any;
      };
    },
    visitedEvents: {
      heading: string;
      subHeading: string;
      description: string;
      joinHeading: string;
      joinDescription: string;
    },
    eventImages: File[] | string[],
    career: {
      heading: string;
      subHeading: string;
      description: string;
    },
    cta: {
      heading: string;
      subHeading: string;
      description: string;
    },
    ctaImage: File | string
  ) {
    const Data = new FormData();

    // Hero Section
    Data.append('heroSection.heading', heroSection.heading);
    Data.append('heroSection.subHeading', heroSection.subHeading);
    Data.append('heroSection.mainTopics', heroSection.mainTopics);
    Data.append('heroSection.description', heroSection.description);

    // About Section
    Data.append('about.heading', about.heading);
    Data.append('about.subHeading', about.subHeading);
    Data.append('about.description', about.description);
    Data.append('about.experience', about.experience);
    Data.append('about.points', JSON.stringify(about.points));
    if (aboutCardBackgroundImage)
      Data.append('aboutCardBackgroundImage', aboutCardBackgroundImage);

    // Games Section
    Data.append('games.heading', games.heading);
    Data.append('games.subHeading', games.subHeading);
    Data.append('games.description', games.description);

    // Our Team Section
    Data.append('ourTeam.heading', ourTeam.heading);
    Data.append('ourTeam.subHeading', ourTeam.subHeading);
    Data.append('ourTeam.description', ourTeam.description);
    Data.append(
      'ourTeam.statistics.uniqueDailyUsers',
      ourTeam.statistics.uniqueDailyUsers
    );
    Data.append('ourTeam.statistics.downloads', ourTeam.statistics.downloads);
    Data.append(
      'ourTeam.statistics.gamesLaunched',
      ourTeam.statistics.gamesLaunched
    );
    Data.append(
      'ourTeam.statistics.upcomingGames',
      ourTeam.statistics.upcomingGames
    );

    // Visited Events
    Data.append('visitedEvents.heading', visitedEvents.heading);
    Data.append('visitedEvents.subHeading', visitedEvents.subHeading);
    Data.append('visitedEvents.description', visitedEvents.description);
    Data.append('visitedEvents.joinHeading', visitedEvents.joinHeading);
    Data.append('visitedEvents.joinDescription', visitedEvents.joinDescription);

    // Event Images
    if (eventImages?.length) {
      eventImages.forEach((img) => {
        Data.append('eventImages', img);
      });
    }

    // Career Section
    Data.append('career.heading', career.heading);
    Data.append('career.subHeading', career.subHeading);
    Data.append('career.description', career.description);

    // CTA Section
    Data.append('cta.heading', cta.heading);
    Data.append('cta.subHeading', cta.subHeading);
    Data.append('cta.description', cta.description);
    if (ctaImage) Data.append('ctaImage', ctaImage);

    return this.http.put<{ message: string; data: any }>(
      `${BACKEND_URL}home`,
      Data
    );
  }

  // delete home
  deleteHome(): Observable<any> {
    return this.http.delete<any>(`${BACKEND_URL}home`);
  }

  // TMGS Blogs DATA
  getTmgsBlogsData(
    page: number,
    limit: number,
    filter: string
  ): Observable<{ data: any[]; totalCount: number; page: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('filter', filter);

    return this.http.get<{
      data: any[];
      totalCount: number;
      page: number;
    }>(BACKEND_URL + 'getAllTmgsBlogs', { params });
  }

  // category
  getAllCategoriesData(
    page: number,
    limit: number,
    filter: string
  ): Observable<{
    status: string;
    results?: number;
    data: any[];
  }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('filter', filter);

    return this.http.get<{
      status: string;
      results?: number;
      data: any[];
    }>(BACKEND_URL + 'getAllCategories', { params });
  }

  AddBlog(data: FormData) {
    return this.http.post<{ message: string; data: any }>(
      `${BACKEND_URL}createTmgsBlog`,
      data
    );
  }

  UpdateBlog(id: string, data: FormData) {
    return this.http.put<{ message: string; data: any }>(
      `${BACKEND_URL}updateTmgsBlog/${id}`,
      data
    );
  }

  DeleteBlog(id: string): Observable<any> {
    return this.http.delete<any>(`${BACKEND_URL}deleteTmgsBlog/${id}`);
  }

  // careers
  getTmgsJobPostPagination(
    page: number,
    limit: number,
    filter: string
  ): Observable<{
    data: any[];
    page: number;
    limit: number;
    totalCount: number;
  }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('filter', filter);

    return this.http.get<{
      data: any[];
      page: number;
      limit: number;
      totalCount: number;
    }>(BACKEND_URL + 'getTmgsJobPostPagination', { params });
  }

  AddCareerPost(data: FormData) {
    return this.http.post<{ message: string; data: any }>(
      `${BACKEND_URL}createTmgsJobPost`,
      data
    );
  }

  UpdateCareerPost(id: string, data: FormData) {
    return this.http.put<{ message: string; data: any }>(
      `${BACKEND_URL}updateTmgsJobPost/${id}`,
      data
    );
  }

  DeleteCareerPost(id: string): Observable<any> {
    return this.http.delete<any>(`${BACKEND_URL}deleteTmgsJobPost/${id}`);
  }

  getCareerJobPostPagination(
    page: number,
    limit: number,
    filter: string
  ): Observable<{
    data: any[];
    page: number;
    limit: number;
    totalCount: number;
  }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('filter', filter);

    return this.http.get<{
      data: any[];
      page: number;
      limit: number;
      totalCount: number;
    }>(BACKEND_URL + 'getCareerJobPostPagination', { params });
  }

  createCareerJobPost(data: FormData) {
    return this.http.post<{ message: string; data: any }>(
      `${BACKEND_URL}createCareerJobPost`,
      data
    );
  }

  updateCareerJobPost(id: string, data: FormData) {
    return this.http.put<{ message: string; data: any }>(
      `${BACKEND_URL}updateCareerJobPost/${id}`,
      data
    );
  }

  deleteCareerJobPost(id: string): Observable<any> {
    return this.http.delete<any>(`${BACKEND_URL}deleteCareerJobPost/${id}`);
  }

  // TMGS CONTACT DETAILS
  getTmgsContacts(
    page: number,
    limit: number,
    filter: string
  ): Observable<{
    data: any[];
    page: number;
    limit: number;
    totalCount: number;
  }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('filter', filter);

    return this.http.get<{
      data: any[];
      page: number;
      limit: number;
      totalCount: number;
    }>(BACKEND_URL + 'getAllTmgsContactUsPagination', { params });
  }

  DeleteTmgsContact(id: string): Observable<any> {
    return this.http.delete<any>(`${BACKEND_URL}deleteTmgsContactUs/${id}`);
  }

  // get ads
  getPaginatedAds(
    page: number,
    limit: number,
    filter: string
  ): Observable<{
    data: any[];
    page: number;
    limit: number;
    totalCount: number;
  }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('filter', filter);

    return this.http.get<{
      data: any[];
      page: number;
      limit: number;
      totalCount: number;
    }>(BACKEND_URL + 'getPaginatedAds', { params });
  }

  // Method to add a new ad
  addAd(adData: FormData): Observable<any> {
    return this.http.post<any>(`${BACKEND_URL}createAd`, adData);
  }

  // Method to update an existing ad
  updateAd(adId: string, adData: FormData): Observable<any> {
    return this.http.patch<any>(`${BACKEND_URL}updateAd/${adId}`, adData);
  }
  updateAdStatus(adId: string, data: { active: boolean }): Observable<any> {
    return this.http.patch<any>(`${BACKEND_URL}updateAdStatus/${adId}`, data);
  }

  DeleteAd(id: string): Observable<any> {
    return this.http.delete<any>(`${BACKEND_URL}deleteAd/${id}`);
  }

  DeleteTmgsJobApplication(id: string): Observable<any> {
    return this.http.delete<any>(
      `${BACKEND_URL}deleteTmgsJobApplication/${id}`
    );
  }

  // Job Applications
  getTmgsJobApplications(
    page: number,
    limit: number,
    filter: string
  ): Observable<{
    data: any[];
    page: number;
    limit: number;
    totalCount: number;
  }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('filter', filter);

    return this.http.get<{
      data: any[];
      page: number;
      limit: number;
      totalCount: number;
    }>(BACKEND_URL + 'getTmgsJobApplicationsPagination', { params });
  }

  updateApplicationStatus(id: string, status: string) {
    return this.http.put(
      `${BACKEND_URL}/updateTmgsJobApplicationStatus/${id}`,
      {
        status,
      }
    );
  }

  // csl job applications
  getJobApplicationsPagination(
    page: number,
    limit: number,
    filter: string
  ): Observable<{
    data: any[];
    page: number;
    limit: number;
    totalCount: number;
  }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('filter', filter);

    return this.http.get<{
      data: any[];
      page: number;
      limit: number;
      totalCount: number;
    }>(BACKEND_URL + 'getJobApplicationsPagination', { params });
  }

  updateJobApplicationStatus(id: string, status: string) {
    return this.http.put(`${BACKEND_URL}/updateJobApplicationStatus/${id}`, {
      status,
    });
  }

  deleteJobApplication(id: string): Observable<any> {
    return this.http.delete<any>(`${BACKEND_URL}deleteJobApplication/${id}`);
  }

  // get ads data
  getAdsData(
    range: string
  ): Observable<{ status: string; results: number; data: any[] }> {
    const params = range
      ? { params: new HttpParams().set('range', range) }
      : {};

    return this.http.get<{
      status: string;
      results: number;
      data: any[];
    }>(BACKEND_URL + 'adsAnalytics', params);
  }

  // team
  getTmgsTeam(
    page: number,
    limit: number,
    filter: string
  ): Observable<{
    data: any[];
    page: number;
    limit: number;
    totalCount: number;
  }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('filter', filter);

    return this.http.get<{
      data: any[];
      page: number;
      limit: number;
      totalCount: number;
    }>(BACKEND_URL + 'team', { params });
  }

  DeleteTeamMember(id: string): Observable<any> {
    return this.http.delete<any>(`${BACKEND_URL}team/${id}`);
  }

  AddTeamMember(data: FormData) {
    return this.http.post<{ message: string; data: any }>(
      `${BACKEND_URL}team`,
      data
    );
  }

  UpdateTeamMember(id: string, data: FormData) {
    return this.http.put<{ message: string; data: any }>(
      `${BACKEND_URL}team/${id}`,
      data
    );
  }

  // partners

  getTmgsPartners(
    page: number,
    limit: number,
    filter: string
  ): Observable<{
    data: any[];
    page: number;
    limit: number;
    totalCount: number;
  }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('filter', filter);

    return this.http.get<{
      data: any[];
      page: number;
      limit: number;
      totalCount: number;
    }>(BACKEND_URL + 'partners', { params });
  }

  DeletePartner(id: string): Observable<any> {
    return this.http.delete<any>(`${BACKEND_URL}partners/${id}`);
  }

  AddPartners(data: FormData) {
    return this.http.post<{ message: string; data: any }>(
      `${BACKEND_URL}partners`,
      data
    );
  }

  UpdatePartners(id: string, data: FormData) {
    return this.http.put<{ message: string; data: any }>(
      `${BACKEND_URL}partners/${id}`,
      data
    );
  }

  // privacy policy
  getTmgsTermsPolicy(type: string) {
    return this.http.get(`${BACKEND_URL}getTmgsTermsPolicy?type=${type}`);
  }

  updateTmgsTermsPolicy(data: any) {
    return this.http.post(`${BACKEND_URL}createOrUpdateTmgsTermPolicy`, data);
  }

  // category
  getTmgsCategory(
    page: number,
    limit: number,
    filter: string
  ): Observable<{
    data: any[];
    page: number;
    limit: number;
    totalCount: number;
  }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('filter', filter);

    return this.http.get<{
      data: any[];
      page: number;
      limit: number;
      totalCount: number;
    }>(BACKEND_URL + 'getAllCategories', { params });
  }

  AddCategory(data: any) {
    return this.http.post<{ message: string; data: any }>(
      `${BACKEND_URL}addCategory`,
      data
    );
  }

  UpdateCategory(id: string, data: any) {
    return this.http.put<{ message: string; data: any }>(
      `${BACKEND_URL}updateCategory/${id}`,
      data
    );
  }

  updateCategoryStatus(id: string, isActive: boolean) {
    return this.http.patch(`${BACKEND_URL}updateCategoryStatus/${id}`, {
      isActive,
    });
  }

  // image upload
  getUploadedImages(
    page: number,
    limit: number,
    filter: string,
    folder = ''
  ): Observable<{
    data: any[];
    page: number;
    limit: number;
    totalCount: number;
  }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('filter', filter);

    // If folder is provided, include it in the URL path
    const endpoint = folder
      ? `${BACKEND_URL}getImages/${folder}`
      : `${BACKEND_URL}getImages`;

    return this.http.get<{
      data: any[];
      page: number;
      limit: number;
      totalCount: number;
    }>(endpoint, { params });
  }

  getImageFolders() {
    return this.http.get(`${BACKEND_URL}available-folders`);
  }

  uploadImagesForPath(data: FormData, folderName: string) {
    return this.http.post<{ message: string; data: any }>(
      `${BACKEND_URL}uploadImage/${folderName}`,
      data
    );
  }

  updateBlogOrderIndex(data: { id: string; orderIndex: number }) {
    return this.http.post(`${BACKEND_URL}reorder-blogs`, data);
  }

  updateTmgsBlogOrderIndex(data: { id: string; orderIndex: number }) {
    return this.http.post(`${BACKEND_URL}reorderTmgsblogs`, data);
  }
// Analytics
  getAnalytics(): Observable<{
  success: boolean;
  data: {
    totalBlogs: number;
    totalCareers: number;
    totalNews: number;
    totalCaseStudies: number;
  };
}> {
  return this.http.get<{
    success: boolean;
    data: {
      totalBlogs: number;
      totalCareers: number;
      totalNews: number;
      totalCaseStudies: number;
    };
  }>(BACKEND_URL + 'analytics');
  }

  getTmgsAnalyticsCounts(): Observable<{
  success: boolean;
  data: {
    totalGames: number;
    totalBlogs: number;
    totalCareers: number;
    totalAds: number;
  };
}> {
  return this.http.get<{
    success: boolean;
    data: {
      totalGames: number;
      totalBlogs: number;
      totalCareers: number;
      totalAds: number;
    };
  }>(BACKEND_URL + 'tmgsAnalytics');
}

  

  getLatestBlogs(): Observable<{
  success: boolean;
    data: {
    _id: string;
    title: string;
    image: string;
    author: string;
    createdAt: string;
  }[];
}> {
  return this.http.get<{
    success: boolean;
    data: {
      _id: string;
      title: string;
      image: string;
      author: string;
      createdAt: string;
    }[];
  }>(BACKEND_URL + 'getLatestBlogs');
}


}
