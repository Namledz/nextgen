import { Component, OnInit, ChangeDetectorRef, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  GroupingState,
  PaginatorState,
  SortState,
  ICreateAction,
  IEditAction,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
} from '../../../_metronic/shared/crud-table';
import { UploadService } from '../services/upload.service';
import { DeleteUploadModalComponent } from './component/delete-upload-modal/delete-upload-modal.component';
import { DeleteUploadsModalComponent } from './component/delete-uploads-modal/delete-uploads-modal.component';
import { ModalUploadComponent } from './component/modal-upload/modal-upload.component';
import { ModalUploadFastqComponent } from './component/modal-upload-fastq/modal-upload-fastq.component';
import { ComponentCanDeactivate } from '../services/component-can-deactivate';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['./upload-list.component.scss']
})
export class UploadListComponent extends ComponentCanDeactivate implements
	OnInit,
	OnDestroy,
	ICreateAction,
	IEditAction,
	IDeleteAction,
	IDeleteSelectedAction,
	IFetchSelectedAction,
	IUpdateStatusForSelectedAction,
	ISortView,
	IFilterView,
	IGroupingView,
	ISearchView,
	IFilterView {

	paginator: PaginatorState;
	sorting: SortState;
	grouping: GroupingState;
	isLoading: boolean;
	filterGroup: FormGroup;
	searchGroup: FormGroup;
	private subscriptions: Subscription[] = [];
	dropdownList =[];
	public options = {
		width: '100%',
		multiple: true,
		tags: true
	};

	constructor(
		private fb: FormBuilder,
		private modalService: NgbModal, 
		private cd: ChangeDetectorRef,
		public uploadService: UploadService
		
	) { super() }
	create(): void {
		throw new Error('Method not implemented.');
	}
	edit(id: number): void {
		throw new Error('Method not implemented.');
	}


  	ngOnInit(): void {
		this.filterForm();
		this.searchForm();
		this.uploadService.fetch();
		this.grouping = this.uploadService.grouping;
		this.paginator = this.uploadService.paginator;
		this.sorting = this.uploadService.sorting;
		const sb = this.uploadService.isLoading$.subscribe(res => this.isLoading = res);
	}

	/**
	* format bytes
	* @param bytes (File size in bytes)
	* @param decimals (Decimals point)
	*/
	formatBytes(bytes, decimals = 2) {
		if (bytes == 0) {
			return "0 Bytes";
		}
		const k = 1024;
		const dm = decimals <= 0 ? 0 : decimals;
		const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
	}

    getStatusCSS(file_type) {
        switch(file_type) {
          case 'vcf':
            return 'label-light-primary'
          case 'fastq':
            return 'label-light-warning'
          default:
            return 'label-light-default'
        }
    }

    getUploadStatusCSS(status) {
        switch(status) {
          case 'Completed':
            return 'label-light-primary'
          case 'Uploading':
            return 'label-light-warning'
          case 'Error':
            return 'label-light-danger'
          default:
            return 'label-light-warning'
        }
    }

	formatSelect2data(data) {
		for(let i in data) {
			data[i].id = data[i].id
			data[i].text = data[i].name
		}
		return data
	}

	filterForm() {
		this.filterGroup = this.fb.group({
		  type: [''],
		  searchTerm: [''],
		});
		this.subscriptions.push(
		  this.filterGroup.controls.type.valueChanges.subscribe(() =>
			this.filter()
		  )
		);
	}

	filter() {
		const filter = {};
		const type = this.filterGroup.get('type').value;
		if (type) {
		  filter['type'] = type;
		}

	
	
		this.uploadService.patchState({ filter });
	}

	search(searchTerm: string) {
		this.uploadService.patchState({ searchTerm });
	}
	
	searchForm() {
		this.searchGroup = this.fb.group({
			searchTerm: [''],
		});
		const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
			.pipe(
				debounceTime(150),
				distinctUntilChanged()
			)
			.subscribe((val) => this.search(val));
		this.subscriptions.push(searchEvent);
	}

	sort(column: string) {
		const sorting = this.sorting;
		const isActiveColumn = sorting.column === column;
		if (!isActiveColumn) {
		  sorting.column = column;
		  sorting.direction = 'asc';
		} else {
		  sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
		}
		this.uploadService.patchState({ sorting });
	}

	paginate(paginator: PaginatorState) {
		this.uploadService.patchState({ paginator });
	}
	
	openModalUploadVcf() {
		const modalRef = this.modalService.open(ModalUploadComponent, { size: 'xl' });
		modalRef.result.then(() => 
			this.uploadService.fetch(),
			() => { }
		);
	}

    openModalUploadFastq() {
		const modalRef = this.modalService.open(ModalUploadFastqComponent, { size: 'xl', scrollable: true });
		modalRef.result.then(() => 
			this.uploadService.fetch(),
			() => { }
		);
	}

    canDeactivate(): boolean {
        const uploadStatus = this.uploadService.isUploadAll;
        if(uploadStatus.every(el => el==true)) {
            return true;
        }
        return false;
    }

	delete(id) {
		const modalRef = this.modalService.open(DeleteUploadModalComponent, { size: 'md' });
		modalRef.componentInstance.id = id;
		modalRef.result.then(() =>
			this.uploadService.fetch(),
			() => { }
		);
	}

	deleteSelected() {
		const modalRef = this.modalService.open(DeleteUploadsModalComponent, {size: 'md'});
		modalRef.componentInstance.ids = this.grouping.getSelectedRows();
		modalRef.result.then(() => 
			this.uploadService.fetch(),
			() => {}
		)
	}

	fetchSelected(): void {
	}

	updateStatusForSelected(): void {
	}
  
	ngOnDestroy() {
	  this.subscriptions.forEach((sb) => sb.unsubscribe());
	}

}
