import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseStudiesComponent } from './case-studies.component';

describe('CaseStudiesComponent', () => {
  let component: CaseStudiesComponent;
  let fixture: ComponentFixture<CaseStudiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    imports: [CaseStudiesComponent]
    });
    fixture = TestBed.createComponent(CaseStudiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // The project list arrives (loading ends) before the project's own details, so the page renders
  // once with no cardData yet.
  it('renders while the project details are still loading', () => {
    component.loading = false;
    component.isNotFound = false;
    component.cardData = undefined;

    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('keeps loading until the project details arrive', () => {
    const http = TestBed.inject(HttpTestingController);
    component.getFilterData('macadons');

    http.expectOne((req) => req.url.includes('/admin/getAll_project')).flush({
      data: { data: [{ _id: 'p1', title: 'Macadons', titleLink: 'macadons', category: 'web' }] },
    });
    expect(component.loading).toBeTrue();
    expect(() => fixture.detectChanges()).not.toThrow();

    http.expectOne((req) => req.url.includes('/admin/get_/p1')).flush({
      data: { data: { _id: 'p1', title: 'Macadons', titleLink: 'macadons', workSteps: [] } },
    });
    expect(component.loading).toBeFalse();
    expect(component.cardData.title).toBe('Macadons');
    http.verify();
  });

  it('shows the fallback overview image when the project has none', () => {
    component.loading = false;
    component.isNotFound = false;
    component.cardData = { title: 'Macadons', overviewImage: null, workSteps: [] };
    fixture.detectChanges();

    const overview: HTMLImageElement = fixture.nativeElement.querySelector('img[alt="Project Overview"]');
    expect(overview.getAttribute('src')).toBe('../../../assets/job-fallback.png');
  });
});
