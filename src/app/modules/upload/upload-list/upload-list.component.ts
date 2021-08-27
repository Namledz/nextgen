import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'app-upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['./upload-list.component.scss']
})
export class UploadListComponent implements
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
		public uploadService: UploadService,
		
	) { }
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
		this.getListWorkspace()
		this.grouping = this.uploadService.grouping;
		this.paginator = this.uploadService.paginator;
		this.sorting = this.uploadService.sorting;
		const sb = this.uploadService.isLoading$.subscribe(res => this.isLoading = res);
	}

	getListWorkspace() {
		const sb = this.uploadService.getListWorkspace().pipe(
			).subscribe((res) => {
				this.dropdownList = this.formatSelect2data(res)
				this.cd.detectChanges()
			});
			this.subscriptions.push(sb);
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
		  workspace: [''],
		  searchTerm: [''],
		});
		this.subscriptions.push(
		  this.filterGroup.controls.type.valueChanges.subscribe(() =>
			this.filter()
		  )
		);
		this.subscriptions.push(
		  this.filterGroup.controls.workspace.valueChanges.subscribe(() =>
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

		const workspace = this.filterGroup.get('workspace').value;
		if(workspace && workspace.length > 0) {
			filter['workspace'] = workspace
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
	
	openModalUpload() {
		const modalRef = this.modalService.open(ModalUploadComponent, { size: 'lg' });
		modalRef.result.then(
			() => { }
		);
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