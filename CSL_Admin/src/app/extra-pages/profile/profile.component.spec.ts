import { ExtraPagesModule } from 'app/extra-pages/extra-pages.module';
import { componentTestProviders } from '../../../testing/component-test-providers';
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ProfileComponent } from "./profile.component";
describe("ProfileComponent", () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ExtraPagesModule],
      providers: componentTestProviders(),
      }).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
