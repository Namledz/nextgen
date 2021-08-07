import { Component, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from 'ngx-toastr';
import { UploadService } from '../../../services/upload.service'
import { map, catchError, switchMap, finalize, mergeMap, delay, tap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styleUrls: ['./modal-upload.component.scss']
})
export class ModalUploadComponent implements OnInit {
	@ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
	files: any[] = [];
	isLoading: boolean = false;
	subscriptions: Subscription[] = [];

	constructor(
		public modal: NgbActiveModal,
		private toastr: ToastrService,
		private cdr: ChangeDetectorRef,
		private uploadService: UploadService
	) { }

	ngOnInit(): void {
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

	/**
	 * Convert Files list to normal array list
	 * @param files (Files List)
	 */
	prepareFilesList(files: Array<any>) {
		for (const item of files) {
			item.progress = 0;
			item.sampleName = item.name;
			item.project_id = 1;
			if (item.name.indexOf('.vcf') == -1 || item.name.indexOf('.fastq') == -1) {
				this.toastr.error('Your file is incorrect format')
				return false
			}
			this.files.push(item);
		}
		this.fileDropEl.nativeElement.value = "";
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

	save() {
		this.isLoading = true;
		this.files.forEach((e, index) => {
			let uploadName = `${this.uploadService.generateRandomString(32)}.${this.files[index].sampleName.substring(this.files[index].sampleName.lastIndexOf(".") + 1)}`;
			e.uploadName = uploadName;
			e.index = index;
		})
		return this.uploadService.getBatchFilesSignedAuth(this.files).pipe(
			map( signedUrl => {
				let data = signedUrl.map( el => {
				let obj = {
					signedUrl: el.preSignedUrl,
					file: this.files[el.index]
				}
				return obj;
				})
				return data;
			}),
			mergeMap( data => {
				return this.uploadService.fileUpload(data)
			})
			).subscribe(res => {
				const sb = this.uploadService.postFilesInfor(this.files).pipe(
					delay(1000),
					catchError((errorMessage) => {
						this.modal.dismiss(errorMessage);
						return of(undefined);
					}),
					finalize(() => {
						this.isLoading = false;
						this.files.forEach(el => {
							el.progress = 100;
						})
					})
				).subscribe(res => {
					setTimeout(() => {
						if(res.every((data) => data.status == 'success')) {
							this.toastr.success('Uploaded files successfully!')
							this.modal.dismiss();
						}
						else {
							this.toastr.error('Error!')
						}
					}, 1000);
				});
				this.subscriptions.push(sb);
			})
	}

	checkSave() {
		if (this.files.length == 0 || this.isLoading == true) {
			return true
		}
	}

	getSampleName($event, file) {
		this.cdr.detectChanges();
		file.sampleName = $event.target.value
	}

	getWorkSpace(value, file) {
		this.cdr.detectChanges();
		file.project_id = value
	}

}
