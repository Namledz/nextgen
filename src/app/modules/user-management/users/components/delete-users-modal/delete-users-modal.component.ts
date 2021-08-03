import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-delete-users-modal',
  templateUrl: './delete-users-modal.component.html',
  styleUrls: ['./delete-users-modal.component.scss']
})
export class DeleteUsersModalComponent implements OnInit, OnDestroy {
  
  @Input() uuids;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
    public modal: NgbActiveModal, 
    private usersService: UsersService, 
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  deleteCustomers() {
    this.isLoading = true;
    const sb = this.usersService.deleteItemsUsers(this.uuids).pipe(
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
