import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-delete-uploads-modal',
  templateUrl: './delete-uploads-modal.component.html',
  styleUrls: ['./delete-uploads-modal.component.scss']
})
export class DeleteUploadsModalComponent implements OnInit, OnDestroy {
  @Input() ids;
  isLoading = false;
  subscriptions: Subscription[] = [];
  
  constructor(
    public modal: NgbActiveModal, 
    private uploadService: UploadService, 
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  deleteFiles() {
    this.isLoading = true;
    const sb = this.uploadService.deleteItemsFiles(this.ids).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap((res) => {
        for(let i=0;i < res.length; i++) {
          if( i == res.length-1) {
             this.toastr.success(res[i].message);
             this.modal.close();
          } else if(res[i].status == 'error') {
             this.toastr.error(res[i].message);
             break;
          }
        }
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
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
