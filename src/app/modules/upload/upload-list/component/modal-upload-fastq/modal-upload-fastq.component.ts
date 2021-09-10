import { Component, ViewChild, ElementRef, OnInit, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';
import { ToastrService } from 'ngx-toastr';
import { UploadService } from '../../../services/upload.service'
import { map, mergeMap, takeUntil, delay, tap } from 'rxjs/operators';
import { of, Subscription, forkJoin, Observable, Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CDK_DRAG_CONFIG } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';

const DragConfig = {
    dragStartThreshold: 0,
    pointerDirectionChangeThreshold: 5,
    zIndex: 10000
};

@Component({
  selector: 'app-modal-upload-fastq',
  templateUrl: './modal-upload-fastq.component.html',
  styleUrls: ['./modal-upload-fastq.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    { provide: CDK_DRAG_CONFIG, useValue: DragConfig }]
})
export class ModalUploadFastqComponent implements OnInit, OnDestroy {
	@ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
	files: any[] = [];
    filesUploading: any[] = [];
	isLoading: boolean = false;
	subscriptions: Subscription[] = [];
	readonly destroy$ = new Subject();
    testId = 'reverse'

    formGroup: FormGroup = this.fb.group({
        filesArr: this.fb.array([])
    })

    dragForm: any[] = [];

	constructor(
		public modal: NgbActiveModal,
		private toastr: ToastrService,
		private cdr: ChangeDetectorRef,
		private uploadService: UploadService,
        private fb: FormBuilder,
        private datePipe: DatePipe
	) { }

    ngOnInit(): void {
    }

    get FilesArray() {
        return this.formGroup.controls["filesArr"] as FormArray;
    }

    	/**
	 * on file drop handler
	 */
	onFileDropped($event) {
		this.prepareFilesList($event);
	}

	/**
	 * handle file from browsing
	 */
	fileBrowseHandler(files) {
		this.prepareFilesList(files);
	}

	/**
	 * Delete file from files list
	 * @param index (File index)
	 */
	deleteFile(index: number) {
		this.files.splice(index, 1);
	}

    deleteForm(index: number) {
        // document.querySelectorAll<HTMLElement>('.formFadeOut')[index].style.opacity = '0'
        this.FilesArray.removeAt(index);
        this.dragForm.splice(index, 1);
    }

	/**
	 * Convert Files list to normal array list
	 * @param files (Files List)
	 */
	prepareFilesList(files: Array<any>) {
		for (const item of files) {
            if (item.name.indexOf('.fastq') == -1) {
				this.toastr.error(`File '${item.name}' is incorrect format`)
				continue;
			}
			else if(!this.checkFastqFileName(item.name)) {
                this.toastr.error(`Filename '${item.name}' is not in the correct format`)
				continue;
			}
            else {
                item.fileType = 'fastq'
            }
			item.progress = 0;
            item.isUploaded = false;
			item.isError = false;
			this.files.push(item);
		}
		this.fileDropEl.nativeElement.value = "";
        this.save();
	}

    addForm() {
        const fileForm = this.fb.group({
            sampleName: ['', Validators.compose([Validators.required])],
            firstName: ['', Validators.compose([Validators.required])],
            lastName: ['', Validators.compose([Validators.required])],
            dob: ['', Validators.compose([Validators.required])],
            phenotype: ['']
        })
        this.FilesArray.push(fileForm);
        this.dragForm.push({forward: [], reverse: []});
    }

        /**
     * format bytes
     * @param bytes (File size in bytes)
     * @param decimals (Decimals point)
     */
	formatBytes(bytes, decimals = 2) {
		if (bytes === 0) {
			return "0 Bytes";
		}
		const k = 1024;
		const dm = decimals <= 0 ? 0 : decimals;
		const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
	}

    checkFastqFileName(name: string) {
        if((name.indexOf('_R1_')!=-1 && name.split('_R1_').length == 2) || (name.indexOf('_R2_')!=-1 && name.split('_R2_').length == 2)) {
            return true;
        }
        return false;
    }

    save() {
        this.files.forEach((e) => {
			let uploadName = `${this.datePipe.transform(new Date(), "yyyyMMddHHmmss")}${this.uploadService.generateRandomString(6)}${e.name.substring(e.name.indexOf('.fastq'))}`;
            if(!e.isUploaded) {
                e.isUploaded = true;
                e.uploadName = uploadName;
                this.filesUploading.push(e.uploadName);
            }
		})
        const uploadFastqFiles = setInterval(() => {
            if(this.filesUploading.length!=0) {
                let fileUploadName = this.filesUploading.shift();
                let pos = this.files.map(el => {return el.uploadName}).indexOf(fileUploadName);
                this.toastr.success(`Start uploading file ${this.files[pos].name}...`);
                this.uploadFile(this.files[pos]);
            }
            else {
                clearInterval(uploadFastqFiles);
            } 
        }, 5000);
    }

	uploadFile(file) {
		let data = {
			uploadName: file.uploadName, 
			fileType: file.type
		}
		file.progress += 1;
		const sb1 = this.uploadService.createMultipartUpload(data).pipe(
			map( result => {
				return result.uploadId;
			}),
			mergeMap( data => {
				file.uploadId = data;
				const CHUNK_SIZE = 10000000;
				const fileSize = file.size;
				const CHUNKS_COUNT = Math.floor(fileSize / CHUNK_SIZE) + 1;
				let start, end, blob;
				let filesData = []
				for (let i = 1; i < CHUNKS_COUNT + 1; i++) {
					start = (i - 1) * CHUNK_SIZE;
					end = (i) * CHUNK_SIZE;
					blob = (i < CHUNKS_COUNT) ? file.slice(start, end) : file.slice(start);

					filesData.push({uploadName: file.uploadName, partNumber: i, uploadId: data, file: blob});
				}

				return this.uploadService.getBatchFilesSignedAuth(filesData);
			})
		).pipe(
			map(result => {
				return result;
			}),
			mergeMap( data => {
				const tasks$ = [];
				data.forEach(el => {
					tasks$.push(this.uploadService.fileUpload(el).pipe(
						map(result => {
							let percentage = file.size == 0 ? 90 : Math.round(el.file.size/file.size * 90);
							file.progress += percentage;
							return result;
						})
					));
				})
				return forkJoin(tasks$);
			})
		).pipe(
			map(result => {
				let data = {
					uploadName: file.uploadName,
					parts: result,
					uploadId: file.uploadId
				}

				return data;
			}),
			mergeMap( data => {
				return this.uploadService.completeMultipartUpload(data)
			}),
			takeUntil(this.destroy$)
		).subscribe(res => {
			if(res.status == "success") {
				let data = {
					original_name: file.name,
					file_size: file.size,
					file_type: file.fileType,
					upload_name: file.uploadName
				}
				const sb2 = this.uploadService.createUploadFastQ(data).subscribe(response => {
					if(response.status == "success") {
                        file.uploadId = response.uploadId;
						file.progress = 100;
                        this.toastr.success(`Uploaded file ${file.name} successfully!`);
					}
					else {
						file.isError = true;
						file.progress = 100;
                        this.toastr.error(`${file.name} uploaded failed`)
					}
				})
				this.subscriptions.push(sb2);
			}
			else {
				file.isError = true;
				file.progress = 100;
			}
		})

		this.subscriptions.push(sb1);
	}

    checkSave() {
		if (this.formGroup.invalid || this.FilesArray.length == 0 || this.isLoading) {
			return true
		}
	}

    drop(event: CdkDragDrop<any[]>) {
        if (event.previousContainer === event.container) {
          moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
          transferArrayItem(event.previousContainer.data,
                            event.container.data,
                            event.previousIndex,
                            event.currentIndex);
        }
    }

    fowardPredicate(item: CdkDrag<any>) {
        if(item.data.name.indexOf('_R1_')==-1) {
            return false;
        }
        return true;
    }

    reversePredicate(item: CdkDrag<any>) {
        if(item.data.name.indexOf('_R2_')==-1) {
            return false;
        }
        return true;
    }

    createSample() {
        this.isLoading = true;
        if(!this.checkFastqPairValid()) {
            this.toastr.error('Create sample failed since invalid format!');
            this.isLoading = false;
            return false;
        }
        const tasks$ = [];
        for(let index in this.FilesArray.controls) {
            const fromValue = this.FilesArray.controls[index].value;
            let data = {
                sample_name: fromValue.sampleName,
                first_name: fromValue.firstName,
                last_name: fromValue.lastName,
                dob: fromValue.dob,
                phenotype: fromValue.phenotype,
                file_type: 'fastq',
                file_size: this.getSampleSize(index),
                forward: this.dragForm[index]['forward'].map(el => el.uploadId),
                reverse: this.dragForm[index]['reverse'].map(el => el.uploadId)
            }
            tasks$.push(this.uploadService.createSampleFastQ(data).pipe(
                delay(1000),
                map(res => {
                    if(res.status == 'success') {
                        this.toastr.success(`Created sample ${fromValue.sampleName} successfully!`);
                        this.FilesArray.removeAt(+index);
                        this.dragForm.splice(+index, 1);
                        return true;
                    }
                    else {
                        this.toastr.error(`Created sample ${fromValue.sampleName} failed!`);
                        return false
                    }
                })
            ))
        }

        const sb = forkJoin(tasks$).pipe(
            tap(res => {

                this.isLoading = false;
                return res;
            }),
            delay(2000),
            tap(res => {
                if(res.every(el => el == true)) {
                    this.modal.close();
                }
            })
        ).subscribe();

        this.subscriptions.push(sb);
    }

    checkFastqPairValid() {
        let check: boolean = false;
        this.dragForm.forEach(e => {
            if(e.forward.length == 0 || e.reverse.length == 0) {
                check = true;
                e.message = 'Number of files in \'Forward\' and \'Reverse\' must be greater than 0.';
            }
            else if(e.forward.length != e.reverse.length) {
                check = true;
                e.message = 'The number of files in \'Forward\' must be the same length as the number of files in \'Reverse\'.';
            }
            else {
                e.message = '';
            }
        })
        if(check) {
            return false;
        }
        return true;
    }

    getSampleSize(index: any) {
        let totalSizeForward = this.dragForm[index]['forward'].reduce((sum, el) => {
            return sum + el.size
        }, 0);
        let totalSizeReverse = this.dragForm[index]['reverse'].reduce((sum, el) => {
            return sum + el.size
        }, 0);

        return totalSizeForward + totalSizeReverse
    }

    isControlValid(controlName: string, index: any): boolean {
		const control = this.FilesArray.controls[index].get(controlName);
		return control.valid && (control.dirty || control.touched);
	}
	
	isControlInvalid(controlName: string, index: any): boolean {
		const control = this.FilesArray.controls[index].get(controlName);
		return control.invalid && (control.dirty || control.touched);
	}

	controlHasError(validation, controlName, index: any): boolean {
		const control = this.FilesArray.controls[index].get(controlName);
		return control.hasError(validation) && (control.dirty || control.touched);
	}

    isControlTouched(controlName: string, index: any): boolean {
		const control = this.FilesArray.controls[index].get(controlName);
		return control.dirty || control.touched;
	}

    ngOnDestroy(): void {
        this.destroy$.next();
		this.destroy$.complete();
		this.subscriptions.forEach(sb => sb.unsubscribe());
    }

}
