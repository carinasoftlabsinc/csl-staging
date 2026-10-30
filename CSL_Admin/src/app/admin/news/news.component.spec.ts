import { AdminModule } from 'app/admin/admin.module';
import { componentTestProviders } from '../../../testing/component-test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';

import { NewsComponent } from './news.component';

describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminModule],
      providers: componentTestProviders(),
    });
    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens a centered add form with its submit action', async () => {
    component.openAddDialog();
    const dialog = TestBed.inject(MatDialog).openDialogs[0];
    dialog.componentRef!.changeDetectorRef.detectChanges();
    await fixture.whenStable();
    const pane = document.querySelector('.cdk-overlay-pane') as HTMLElement;
    const wrapper = pane.parentElement!;
    // TinyMCE's body-level dialogs must share the normal stacking context.
    expect(pane.closest('[popover]')).toBeNull();
    expect(wrapper.style.justifyContent).toBe('center');
    expect(wrapper.style.alignItems).toBe('center');
    expect(pane.querySelector('button[type="submit"]')?.textContent).toContain('Submit');
    dialog.close();
    await fixture.whenStable();
  });

  it('renders news returned after the initial view is created', async () => {
    fixture.autoDetectChanges();
    const http = TestBed.inject(HttpTestingController);
    const request = http.expectOne(req => req.method === 'GET');
    request.flush({
      data: [{ _id: 'migration-news', title: 'Migration verified', author: 'Test author', date: '2026-10-23' }],
      totalCount: 1,
    });
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Migration Verified');
    expect(component.totalCount).toBe(1);
    expect(component.isLoading).toBeFalse();
    http.verify();
  });
});
