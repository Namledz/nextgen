import { truncateWithEllipsis } from '@amcharts/amcharts4/.internal/core/utils/Utils';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { WorkspacesService } from '../../../services/workspaces.service';

@Component({
  selector: 'app-share-workspace-modal',
  templateUrl: './share-workspace-modal.component.html',
  styleUrls: ['./share-workspace-modal.component.scss']
})
export class ShareWorkspaceModalComponent implements OnInit, OnDestroy {
	@Input() ids;
	isLoading: boolean = false;
	isLoading$;
	emailIDs: any;
	dropDownList: [];
	public options = {
		width: '100%',
		multiple: true,
		tags: true,
		tokenSeparators: [","]
	};
  	subscriptions: Subscription[] = [];
	
	constructor(private workSpacesService: WorkspacesService, public modal: NgbActiveModal, private toastr: ToastrService) { }

	ngOnInit(): void {
		//this.isLoading$ = this.workSpacesService.isLoading$;
		this.getListEmail()
	}

	share() {
		this.isLoading = true
		let data = {
			ids: this.ids,
			emailIDs : this.emailIDs
		}
		this.isLoading = true;
		const sb = this.workSpacesService.shareWorkspace(data).pipe(
			delay(1000),
			tap((res) => {
			  if(res.status == 'success') {
					this.isLoading = true
				  this.toastr.success(res.message);
				  this.modal.close();
			  } else {
				  this.isLoading = false
				  this.toastr.error(res.message);
			  }
			}),
			catchError((err) => {
			  this.modal.dismiss(err);
			  return of(undefined);
			}),
			finalize(() => {
			  //this.isLoading = false;
			})
		  ).subscribe();
		  this.subscriptions.push(sb);
	}

	checkInvalid() {
		if (this.emailIDs == undefined) {
			return true
		}
		return false
	}

	getListEmail() {
		const sb = this.workSpacesService.getListEmail().pipe()
			.subscribe(res => {
				this.dropDownList = res.data
			})
		this.subscriptions.push(sb);
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

}
