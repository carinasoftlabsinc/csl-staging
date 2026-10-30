import { DashboardModule } from 'app/admin/dashboard/dashboard.module';
import { componentTestProviders } from '../../../../testing/component-test-providers';
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MainComponent } from "./main.component";
describe("MainComponent", () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [DashboardModule],
      providers: componentTestProviders(),
      }).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
