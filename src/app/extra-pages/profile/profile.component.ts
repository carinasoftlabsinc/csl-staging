import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'app/authentication/authServices';
import { EmployeesService } from 'app/employee/employee.service';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub!: Subscription;
  form!: FormGroup;
  imageBaseUrl = environment.imageBaseUrl;
  profileData: any;
  userIsAuthenticated = false;
  existingImageFileName!: string;
  imagePreview!: string | ArrayBuffer | null;
  constructor(private authService: AuthService, private employeeService: EmployeesService) {
  }
  ngOnInit() {
    this.isLoading = true;
    this.form = new FormGroup({
      profile_image: new FormControl(null)
    });
    this.authService.onActive.subscribe({
      next: (result: any) => {
        this.getProfileData()
      },
      error: (err: any) => {
        console.error;
      },
    });
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.isLoading = false;
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onImagePicked(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const file = target.files[0];
      this.form.patchValue({ profile_image: file });
      this.form.get("profile_image")?.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        // this.onSave();
        // setTimeout(() => {
        //   this.onSave(); // Call onSave function here
        // },300)
       
      };
      reader.readAsDataURL(file);
    }
  }
  onClearImage() {
    this.imagePreview = null;
    this.form.get('profile_image')?.setValue(null);
  }

 
  onSave() {
    if (this.form.invalid) {
      return
    }
    this.authService.updateProfilePic(
      this.form.value.profile_image
    );

  }

  getProfileData() {
    this.isLoading = true;
    this.authService.getByID().subscribe(res => {
      this.isLoading = false;
      this.profileData = res.data.data;
      this.existingImageFileName = this.profileData.profile_image;
      this.form.controls['profile_image'].setValue(this.profileData.profile_image);
    });
  }
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
    this.profileData = [];
  }
}
