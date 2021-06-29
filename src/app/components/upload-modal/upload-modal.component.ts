import { SamplesService } from './../../modules/samples/_services/samples.service';
import { Component, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss']
})

export class UploadModalComponent implements OnInit {
  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
  files: any[] = [];
  isLoading: boolean = false

  constructor(
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private sampleService: SamplesService
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
    if (this.files[index].progress < 100) {
      console.log("Upload in progress.");
      return;
    }
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
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
      item.fileSize = item.size;
      item.fileType = 'vcf'
      if(item.name.indexOf('.vcf') == -1) {
        this.toastr.error('Your file is incorrect format')
        return false
      }
      this.files.push(item);
    }
    this.fileDropEl.nativeElement.value = "";
    this.uploadFilesSimulator(0);
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
    let progressInvalid = this.files.findIndex(e => e.progress < 100)
    // let missingName = this.files.find
    if(progressInvalid > -1) {
      this.toastr.error('Your file are not ready!')
      return false
    }
    console.log("FILES", this.files)
    // this.modal.dismiss()
    this.toastr.success('Successfully uploaded your sample(s)!')
    this.sampleService.uploadSample(this.files).subscribe(res => {
      console.log(res)
    })
    return true
  }

  checkSave() {
    if(this.files.length == 0) {
      return true
    }

    if(this.files) {
      let index = this.files.findIndex(e => e.progress < 100)
      return index > -1 ? true : false
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
