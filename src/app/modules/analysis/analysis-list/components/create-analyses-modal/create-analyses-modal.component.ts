import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { AnalysisService } from '../../../_services/analysis.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-analyses-modal',
  templateUrl: './create-analyses-modal.component.html',
  styleUrls: ['./create-analyses-modal.component.scss']
})
export class CreateAnalysesModalComponent implements OnInit, OnDestroy {
    @Input() projectId: any;
    pipeLine: any[] = [];
    sampleList: any[] = [];
    formGroup: FormGroup;
    subscriptions: Subscription[] = [];
    isLoading: boolean = false;

    constructor(private AnalysisService: AnalysisService, private fb: FormBuilder, private ToastrService: ToastrService, private cd: ChangeDetectorRef, public modal: NgbActiveModal) { }

    ngOnInit(): void {
        this.loadSampleUpload();
    }

    loadSampleUpload() {
        const sb = this.AnalysisService.getSamplesByProjectId()
        .subscribe((res) => {
            if(res.status == 'success') {
                this.pipeLine = res.pipeline;
                this.sampleList = res.samples;
                this.loadForm();
                this.cd.detectChanges();
            }
            else {
                this.ToastrService.error(res.message);
            }
        });

        this.subscriptions.push(sb);
    }

    loadForm() {
        this.formGroup = this.fb.group({
            pipeLineList: ['', Validators.compose([Validators.required])],
            sampleList: ['', Validators.compose([Validators.required])],
            analysisName: ['', Validators.compose([Validators.required])],
            description: ['']
        })
        this.cd.detectChanges();
    }

    formatSampleValue(sampleId) {
        if(sampleId) {
            let pos = this.sampleList.map(el => {return el.id}).indexOf(+sampleId);
            return this.sampleList[pos].sample_name;
        }
        return ''
    }

    create() {
        this.isLoading = true;
        const formData = this.formGroup.value;
        const data = {
            name: formData.analysisName,
            project_id: this.projectId,
            pipeline_id:  formData.pipeLineList,
            upload_id: formData.sampleList,
            description: formData.description,
        }
        const sb = this.AnalysisService.createAnalysis(data).pipe(
            delay(1000),
            tap((res) => {
                if(res.status == 'success') {
                    this.isLoading = false;
                    this.ToastrService.success(res.message);
                    this.modal.close();
                }
                else {
                    this.isLoading = false;
                    this.ToastrService.error(res.message);
                }
            })
        ).subscribe();

        this.subscriptions.push(sb);
    }

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

    ngOnDestroy(): void {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}
