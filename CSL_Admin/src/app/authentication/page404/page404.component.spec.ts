import { AuthenticationModule } from 'app/authentication/authentication.module';
import { componentTestProviders } from '../../../testing/component-test-providers';
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Page404Component } from "./page404.component";
describe("Page404Component", () => {
  let component: Page404Component;
  let fixture: ComponentFixture<Page404Component>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [AuthenticationModule],
      providers: componentTestProviders(),
      }).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(Page404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
