import { Component, ViewChild, ElementRef, OnInit, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from 'ngx-toastr';
import { UploadService } from '../../../services/upload.service'
import { map, mergeMap, takeUntil, delay, tap } from 'rxjs/operators';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { of, Subscription, forkJoin, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styleUrls: ['./modal-upload.component.scss']
})
export class ModalUploadComponent implements OnInit, OnDestroy {
	@ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
	files: any[] = [];
	isLoading: boolean = false;
	subscriptions: Subscription[] = [];
	readonly destroy$ = new Subject();

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
			item.isError = false;
			item.sampleName = item.name;
			item.project_id = 1;
			if (item.name.indexOf('.vcf') == -1 && item.name.indexOf('.fastq') == -1) {
				this.toastr.error('Your file is incorrect format')
				return false
			}
			else if(item.name.indexOf('.vcf') != -1) {
				item.fileType = 'vcf'
			}
			else {
				item.fileType = 'fastq'
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
		})
		let totalFile = 0;
		const uploadMultifile = setInterval(() => {
			if(totalFile++ < this.files.length) {
				this.uploadFile(this.files[totalFile-1], totalFile-1);
			}
			if(this.files.every((el) => el.progress == 100)) {
				this.isLoading = false;
				clearInterval(uploadMultifile);
				const delayObservable = of(true).pipe(
					delay(1000),
					tap((res) => {
						this.toastr.success('Uploaded files successfully!');
						this.modal.close();
					})
				);
				const sb = delayObservable.subscribe()
				this.subscriptions.push(sb);
			}
			else if(this.files.every((el) => el.isError == true)) {
				this.isLoading = false;
				clearInterval(uploadMultifile);
				const delayObservable = of(false).pipe(
					delay(1000),
					tap((res) => {
						this.toastr.success('Uploaded files unsuccessfully!');
					})
				);
				const sb = delayObservable.subscribe()
				this.subscriptions.push(sb);
			}
		}, 1500);
	}

	uploadFile(file, index) {
		let data = {
			uploadName: file.uploadName, 
			fileType: file.type
		}
		this.files[index].progress += 1;
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
							this.files[index].progress += percentage;
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
					sample_name: file.sampleName,
					file_size: file.size,
					file_type: file.fileType,
					upload_name: file.uploadName,
					workspace: parseInt(file.project_id)
				}
				const sb2 = this.uploadService.postFileInfor(data).subscribe(response => {
					if(response.status == "success") {
						this.files[index].progress = 100;
					}
					else {
						this.files[index].isError = true;
						this.files[index].progress = 100;
					}
				})
				this.subscriptions.push(sb2);
			}
			else {
				this.files[index].isError = true;
				this.files[index].progress = 100;
			}
		})

		this.subscriptions.push(sb1);
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

	ngOnDestroy() {
		if(this.isLoading == true) {
			this.toastr.error('Your upload has been terminated.');
		}
		this.destroy$.next();
		this.destroy$.complete();
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}
