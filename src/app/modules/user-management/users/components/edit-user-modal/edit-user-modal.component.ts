import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { ConfirmPasswordValidator } from 'src/app/modules/auth/registration/confirm-password.validator';
import { UserModel } from 'src/app/modules/auth/_models/user.model';
import { UsersService } from '../../../services/users.service';

const EMPTY_USER: UserModel = {
  id: undefined,
  uuid: '',
  username: '',
  first_name: '',
  last_name: '',
  password: '',
  email: '',
  role: 0,
  pic: '',
  status: 0,
  group: '',
  institution: '',
  // account information
  createdAt: '',
  updatedAt: '',
  setUser(user: any) {}

}

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss']
})
export class EditUserModalComponent implements OnInit, OnDestroy {

  @Input() uuid;
  isLoading$;
  user: UserModel;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = []
  
  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public http: HttpClient,
    private toastr: ToastrService,
    private cd : ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.usersService.isLoading$;
    this.loadUser();
  }

  loadUser() {
    if (!this.uuid) {
      this.user = EMPTY_USER;
      this.loadForm();
    } else {
      const sb = this.usersService.getItemUserById(this.uuid).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_USER);
        })
      ).subscribe((user: UserModel) => {
        this.user = user;
        console.log(this.user)
        this.loadFormEdit();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      first_name: [this.user.first_name, Validators.compose([Validators.required, Validators.maxLength(100)])],
      last_name: [this.user.last_name, Validators.compose([Validators.required, Validators.maxLength(100)])],
      email: [this.user.email, Validators.compose([Validators.required, Validators.email])],
      status: [this.user.status],
      institution: [this.user.institution],
      group: [this.user.group],
      role: [this.user.role, Validators.compose([Validators.required])],
      password: [this.user.password, Validators.compose([Validators.required, Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/)])],
      cPassword: [this.user.password, Validators.compose([Validators.required, Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/)])],
    },
      {
        validator: ConfirmPasswordValidator.MatchPassword
      }
    );
    if (!this.uuid) {
      this.formGroup.reset();
    }
  }

  loadFormEdit() {
    this.formGroup = this.fb.group({
      first_name: [this.user.first_name, Validators.compose([Validators.required, Validators.maxLength(100)])],
      last_name: [this.user.last_name, Validators.compose([Validators.required, Validators.maxLength(100)])],
      email: [this.user.email, Validators.compose([Validators.required, Validators.email])],
      status: [this.user.status],
      institution: [this.user.institution],
      group: [this.user.group],
      role: [this.user.role, Validators.compose([Validators.required])],
      password: ['',Validators.compose([Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/)])],
      cPassword: [''],
      },
      {
        validator: ConfirmPasswordValidator.MatchPasswordEdit
      }
    );
  }

  save() {
    this.prepareUser();
    if (this.uuid) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.usersService.updateUser(this.user).pipe(
      tap((res) => {
        if(res.status == 'success') {
            this.toastr.success(res.message);
            this.modal.close();
        } else {
            this.toastr.error(res.message);
        }
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.user);
      }),
    ).subscribe();
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.usersService.createUser(this.user).pipe(
      tap((res) => {
        if(res.status == 'success') {
            this.toastr.success(res.message);
            this.modal.close();
        } else {
            this.toastr.error(res.message);
        }
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.user);
      }),
    ).subscribe();
    this.subscriptions.push(sbCreate);
  }

  private prepareUser() {
    const formData = this.formGroup.value;
    this.user.email = formData.email;
    this.user.first_name = formData.first_name;
    this.user.last_name = formData.last_name;
    this.user.email = formData.email;
    this.user.institution = formData.institution;
    this.user.role = +formData.role;
    this.user.password = formData.password;
    this.user.status = formData.status;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
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
