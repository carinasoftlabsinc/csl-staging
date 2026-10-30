import { AppModule } from 'app/app.module';
import { componentTestProviders } from '../../../testing/component-test-providers';
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RightSidebarComponent } from "./right-sidebar.component";
describe("RightSidebarComponent", () => {
  let component: RightSidebarComponent;
  let fixture: ComponentFixture<RightSidebarComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [AppModule],
      providers: componentTestProviders(),
      }).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(RightSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
