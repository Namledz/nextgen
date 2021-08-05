import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService, UserModel, ConfirmPasswordValidator } from '../../auth';
import { AuthHTTPService } from '../../auth/_services/auth-http/auth-http.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  user: UserModel;
  firstUserState: UserModel;
  subscriptions: Subscription[] = [];
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
      currentPassword: [this.user.password, [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      cPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, {
      validator: ConfirmPasswordValidator.MatchPassword
    });
  }

  save() {
    var self = this
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    this.user.password = this.formGroup.value.password;
    this.userService.isLoadingSubject.next(true);

    let data = {
      id: this.user.id,
      password: this.formGroup.value.currentPassword,
      newPassword: this.user.password
    }

    this.httpService.chnagePasswordProfile(data)
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

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
