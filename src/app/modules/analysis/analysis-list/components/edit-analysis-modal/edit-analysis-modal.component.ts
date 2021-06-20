import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Analysis } from '../../../_models/analysis.model';
import { AnalysisService } from '../../../_services/analysis.service';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_ANALYSIS: Analysis = {
	id: undefined,
	name: '',
	owner: '',
	permission: '',
	created: '',
	update: '',
	type: '',
	sample: ''
};

@Component({
	selector: 'app-edit-analysis-modal',
	templateUrl: './edit-analysis-modal.component.html',
	styleUrls: ['./edit-analysis-modal.component.scss'],
	// NOTE: For this example we are only providing current component, but probably
	// NOTE: you will w  ant to provide your main App Module
	providers: [
		{ provide: NgbDateAdapter, useClass: CustomAdapter },
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
	]
})
export class EditAnalysisModalComponent implements OnInit, OnDestroy {
	@Input() id: number;
	isLoading$;
	analysis: Analysis;
	formGroup: FormGroup;
	private subscriptions: Subscription[] = [];
	constructor(
		private analysisService: AnalysisService,
		private fb: FormBuilder, public modal: NgbActiveModal
	) { }

	ngOnInit(): void {
		this.isLoading$ = this.analysisService.isLoading$;
		this.loadAnalysis();
	}

	loadAnalysis() {
		if (!this.id) {
			this.analysis = EMPTY_ANALYSIS;
			this.loadForm();
		} else {
			const sb = this.analysisService.getItemById(this.id).pipe(
				first(),
				catchError((errorMessage) => {
					this.modal.dismiss(errorMessage);
					return of(EMPTY_ANALYSIS);
				})
			).subscribe((analysis: Analysis) => {
				this.analysis = analysis;
				this.loadForm();
			});
			this.subscriptions.push(sb);
		}
	}

	loadForm() {
		this.formGroup = this.fb.group({
			// firstName: [this.analysis.firstName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			// lastName: [this.analysis.lastName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
			// email: [this.analysis.email, Validators.compose([Validators.required, Validators.email])],
			// dob: [this.analysis.dateOfBbirth, Validators.compose([Validators.nullValidator])],
			// userName: [this.analysis.userName, Validators.compose([Validators.required])],
			// gender: [this.analysis.gender, Validators.compose([Validators.required])],
			// ipAddress: [this.analysis.ipAddress],
			// type: [this.analysis.type, Validators.compose([Validators.required])]
		});
	}

	save() {
		this.prepareAnalysis();
		if (this.analysis.id) {
			this.edit();
		} else {
			this.create();
		}
	}

	edit() {
		const sbUpdate = this.analysisService.update(this.analysis).pipe(
			tap(() => {
				this.modal.close();
			}),
			catchError((errorMessage) => {
				this.modal.dismiss(errorMessage);
				return of(this.analysis);
			}),
		).subscribe(res => this.analysis = res);
		this.subscriptions.push(sbUpdate);
	}

	create() {
		const sbCreate = this.analysisService.create(this.analysis).pipe(
			tap(() => {
				this.modal.close();
			}),
			catchError((errorMessage) => {
				this.modal.dismiss(errorMessage);
				return of(this.analysis);
			}),
		).subscribe((res: Analysis) => this.analysis = res);
		this.subscriptions.push(sbCreate);
	}

	private prepareAnalysis() {
		// const formData = this.formGroup.value;
		// this.analysis.dob = new Date(formData.dob);
		// this.analysis.email = formData.email;
		// this.analysis.firstName = formData.firstName;
		// this.analysis.dateOfBbirth = formData.dob;
		// this.analysis.ipAddress = formData.ipAddress;
		// this.analysis.lastName = formData.lastName;
		// this.analysis.type = +formData.type;
		// this.analysis.userName = formData.userName;
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
