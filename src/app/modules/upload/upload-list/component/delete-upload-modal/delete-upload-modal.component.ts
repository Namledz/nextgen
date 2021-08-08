import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-delete-upload-modal',
  templateUrl: './delete-upload-modal.component.html',
  styleUrls: ['./delete-upload-modal.component.scss']
})
export class DeleteUploadModalComponent implements OnInit, OnDestroy {

  @Input() id;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private uploadService: UploadService, public modal: NgbActiveModal, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  deleteFile() {
    this.isLoading = true;
    const sb = this.uploadService.deleteFile(this.id).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap((res) => {
        if(res.status == 'success') {
            this.toastr.success(res.message);
            this.modal.close();
        } else {
            this.toastr.error(res.message);
        }
      }),
      catchError((err) => {
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
