import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService, UserModel } from '../../auth';
import { AuthHTTPService } from '../../auth/_services/auth-http/auth-http.service';


@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  user: UserModel;
  firstUserState: UserModel;
  subscriptions: Subscription[] = [];
  avatarPic = 'none';
  isLoading$: Observable<boolean>;

  constructor(private userService: AuthService, private fb: FormBuilder, private httpService: AuthHTTPService, private toastr: ToastrService) {
    this.isLoading$ = this.userService.isLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    const sb = this.userService.currentUserSubject.asObservable().pipe(
      first(user => !!user)
    ).subscribe(user => {
      this.user = Object.assign({}, user);
      this.firstUserState = Object.assign({}, user);
      this.loadForm();
    });
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  loadForm() {
    this.formGroup = this.fb.group({
      pic: [this.user.pic],
      firstname: [this.user.first_name, Validators.required],
      lastname: [this.user.last_name, Validators.required],
      group: [this.user.group, Validators.required],
      institution: [this.user.institution, Validators.required],
      phone_number: [this.user.phone_number, Validators.required],
      email: [this.user.email, Validators.compose([Validators.required, Validators.email])],
      // website: [this.user.website, Validators.required]
    });
  }

  save() {
    var self = this
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    const formValues = this.formGroup.value;
    this.user = Object.assign(this.user, formValues);

    // Do request to your server for user update, we just imitate user update there
    this.userService.isLoadingSubject.next(true);

    this.httpService.saveUpdateProfile(this.user)
      .subscribe(response => {
        if (response.status == 'success') {
          self.toastr.success(response.message)
        } else {
          self.toastr.error(response.message)
        }
      })
    setTimeout(() => {
      this.userService.currentUserSubject.next(Object.assign({}, this.user));
      this.userService.isLoadingSubject.next(false);
    }, 2000);
  }

  cancel() {
    this.user = Object.assign({}, this.firstUserState);
    this.loadForm();
  }

  getPic() {
    // if (!this.user.pic) {
    //   return 'none';
    // }

    // return `url('${this.user.pic}')`;
  }

  deletePic() {
    //this.user.pic = '';
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
}
