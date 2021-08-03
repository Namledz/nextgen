import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ConfirmPasswordValidator } from '../registration/confirm-password.validator';
import { AuthService } from '../_services/auth.service';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {
  id:any;
  setPasswordForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.isLoading$ = this.authService.isLoading$; 
  }

  ngOnInit(): void {
    this.id  = this.route.snapshot.params.id;
    this.initForm();
  }

    // convenience getter for easy access to form fields
    get f() {
      return this.setPasswordForm.controls;
    }

  initForm() {
    this.setPasswordForm = this.fb.group({
      password: ['',Validators.compose([Validators.required, Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/), Validators.maxLength(100),])],
      cPassword: ['',Validators.compose([Validators.required, Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/), Validators.maxLength(100),])],
    },
    {
      validator: ConfirmPasswordValidator.MatchPassword
    }
    );
  }

  submit() {
    let data = {
      id: this.id,
      password: this.f.password.value
    }
    this.authService.setPassword(data).pipe(first())
      .subscribe(res => {
        if (res.body.status == 'success') {
          this.toastr.success(res.body.message)
          this.router.navigate(['/auth/login']);
        } else {
          this.toastr.error(res.body.message)
        }
      })
  }

}
