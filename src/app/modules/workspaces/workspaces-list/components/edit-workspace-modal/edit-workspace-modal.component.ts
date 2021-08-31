import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/auth';
import { WorkspaceModel } from 'src/app/modules/auth/_models/workspace.model';
import { WorkspacesService } from '../../../services/workspaces.service';

const EMPTY_WORKSPACE: WorkspaceModel =  {
	id: undefined,
	name: '',
	pipeline: 0,
	dashboard: ''
}

@Component({
  selector: 'app-edit-workspace-modal',
  templateUrl: './edit-workspace-modal.component.html',
  styleUrls: ['./edit-workspace-modal.component.scss']
})
export class EditWorkspaceModalComponent implements OnInit, OnDestroy {

	@Input() id;
	isLoad: boolean = false
	isLoading$;
	workspace: WorkspaceModel;
	formGroup: FormGroup;
	dropdownList: []
	public options = {
		width: '100%',
		multiple: true,
		tags: true,
	};
	currentUser
	private subscriptions: Subscription[] = []

  
	constructor(
		private workSpacesService: WorkspacesService,
		private fb: FormBuilder,
		public modal: NgbActiveModal,
		public http: HttpClient,
		private toastr: ToastrService,
		private cd : ChangeDetectorRef,
		private authService: AuthService
	) { }
	
	ngOnInit(): void {
		this.isLoading$ = this.workSpacesService.isLoading$;
		this.currentUser = this.authService.currentUser
		this.loadWorkspace()
		this.loadPipeline()
	}

	loadWorkspace() {
		if (!this.id) {
			this.workspace = EMPTY_WORKSPACE;
			this.loadForm();
		}
	}

	loadForm() {
		this.formGroup = this.fb.group({
			name: [this.workspace.name, Validators.compose([Validators.required, Validators.maxLength(100)])],
			pipeline: [this.workspace.pipeline, Validators.compose([Validators.required])],
			dashboard: [this.workspace.dashboard,]
		});
		if (!this.id) {
		  this.formGroup.reset();
		}
	  }

	save() {
		this.prepareWorkspace();
		if (this.id) {
			this.edit()
		} else {
			this.create()
		}
	}

	edit() {

	}

	create() {
		let self = this
		self.isLoad = true
		const sbCreate = this.workSpacesService.createWorkspace(this.workspace).pipe(
		tap((res) => {
			self.isLoad = false
			if(res.status == 'success') {
				this.toastr.success(res.message);
				this.modal.close();
			} else {
				this.toastr.error(res.message);
			}
		}),
		catchError((errorMessage) => {
			this.modal.dismiss(errorMessage);
			return of(this.workspace);
		}),
		).subscribe();
		this.subscriptions.push(sbCreate);
	}

	loadPipeline() {
		let self = this
		const sb = self.workSpacesService.getListPipeline().pipe()
			.subscribe((res) => {
				this.dropdownList = this.formatSelect2data(res.data)
				this.cd.detectChanges
		});
		this.subscriptions.push(sb)
	}

	formatSelect2data(data) {
		for(let i in data) {
			data[i].id = data[i].id
			data[i].text = data[i].pipeline
		}
		return data
	}

	private prepareWorkspace() {
		const formData = this.formGroup.value;
		this.workspace.name = formData.name;
		this.workspace.pipeline = formData.pipeline
		this.workspace.dashboard = formData.dashboard
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
