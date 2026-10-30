import { AppModule } from 'app/app.module';
import { componentTestProviders } from '../../../testing/component-test-providers';
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { SidebarComponent } from "./sidebar.component";
describe("SidebarComponent", () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [AppModule],
      providers: componentTestProviders(),
      }).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
