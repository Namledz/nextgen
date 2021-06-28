import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AnalysisService } from '../_services/analysis.service';
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
import { DeleteAnalysisModalComponent } from './components/delete-analysis-modal/delete-analysis-modal.component';
import { DeleteAnalysesModalComponent } from './components/delete-analyses-modal/delete-analyses-modal.component';
import { UpdateAnalysisStatusModalComponent } from './components/update-analysis-status-modal/update-analysis-status-modal.component';
import { FetchAnalysisModalComponent } from './components/fetch-analysis-modal/fetch-analysis-modal.component';
import { EditAnalysisModalComponent } from './components/edit-analysis-modal/edit-analysis-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-analysis-list',
	templateUrl: './analysis-list.component.html',
	styleUrls: ['./analysis-list.component.scss'],
})
export class AnalysisListComponent
	implements
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
	id: any;
	url: any;
	projectName: any;
	searchGroup: FormGroup;
	private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	dropdownList = [];
	public options = {
		width: '100%',
		multiple: true,
		tags: true
	};

	constructor(
		private fb: FormBuilder,
		private modalService: NgbModal,
		public analysisService: AnalysisService, 
		private route: ActivatedRoute,
		private cd: ChangeDetectorRef
	) { }

	// angular lifecircle hooks
	ngOnInit(): void {
		this.id = this.route.snapshot.params.id;
		this.getProjectName();
		this.url = `${environment.apiUrl}/analysis/list/${this.id}`
		this.analysisService.API_URL = this.url;
		this.filterForm();
		this.searchForm();
		this.analysisService.fetch();
		this.grouping = this.analysisService.grouping;
		this.paginator = this.analysisService.paginator;
		this.sorting = this.analysisService.sorting;
		const sb = this.analysisService.isLoading$.subscribe(res => this.isLoading = res);
		this.subscriptions.push(sb);
	}

	ngOnDestroy() {
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}

	getProjectName() {
		let self = this;
		const sb = this.analysisService.getProjectName(self.id)
			.subscribe(function (res) {
				if (res.status == "success") {
					self.projectName = res.data;
					self.cd.detectChanges();
				}
			})
		this.subscriptions.push(sb);
	}

	// filtration
	filterForm() {
		this.filterGroup = this.fb.group({
			status: [''],
			type: [''],
			searchTerm: [''],
		});
		this.subscriptions.push(
			this.filterGroup.controls.status.valueChanges.subscribe(() =>
				this.filter()
			)
		);
		this.subscriptions.push(
			this.filterGroup.controls.type.valueChanges.subscribe(() => this.filter())
		);
	}

	filter() {
		const filter = {};
		const status = this.filterGroup.get('status').value;
		if (status) {
			filter['status'] = status;
		}

		const type = this.filterGroup.get('type').value;
		if (type) {
			filter['type'] = type;
		}
		this.analysisService.patchState({ filter });
	}

	// search
	searchForm() {
		this.searchGroup = this.fb.group({
			searchTerm: [''],
		});
		const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
			.pipe(
				/*
			  The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
			  we are limiting the amount of server requests emitted to a maximum of one every 150ms
			  */
				debounceTime(150),
				distinctUntilChanged()
			)
			.subscribe((val) => this.search(val));
		this.subscriptions.push(searchEvent);
	}

	search(searchTerm: string) {
		this.analysisService.patchState({ searchTerm });
	}

	// sorting
	sort(column: string) {
		const sorting = this.sorting;
		const isActiveColumn = sorting.column === column;
		if (!isActiveColumn) {
			sorting.column = column;
			sorting.direction = 'asc';
		} else {
			sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
		}
		this.analysisService.patchState({ sorting });
	}

	// pagination
	paginate(paginator: PaginatorState) {
		this.analysisService.patchState({ paginator });
	}

	// form actions
	create() {
		this.edit(undefined);
	}

	edit(id: number) {
		const modalRef = this.modalService.open(EditAnalysisModalComponent, { size: 'xl' });
		modalRef.componentInstance.id = id;
		modalRef.result.then(() =>
			this.analysisService.fetch(),
			() => { }
		);
	}

	delete(id: number) {
		const modalRef = this.modalService.open(DeleteAnalysisModalComponent);
		modalRef.componentInstance.id = id;
		modalRef.result.then(() => this.analysisService.fetch(), () => { });
	}

	deleteSelected() {
		const modalRef = this.modalService.open(DeleteAnalysesModalComponent);
		modalRef.componentInstance.ids = this.grouping.getSelectedRows();
		modalRef.result.then(() => this.analysisService.fetch(), () => { });
	}

	updateStatusForSelected() {
		const modalRef = this.modalService.open(UpdateAnalysisStatusModalComponent);
		modalRef.componentInstance.ids = this.grouping.getSelectedRows();
		modalRef.result.then(() => this.analysisService.fetch(), () => { });
	}

	fetchSelected() {
		const modalRef = this.modalService.open(FetchAnalysisModalComponent);
		modalRef.componentInstance.ids = this.grouping.getSelectedRows();
		modalRef.result.then(() => this.analysisService.fetch(), () => { });
	}

	formatUserRole(role) {
		switch (role) {
			case 0:
				return 'admin'
			default: 
				return role
		}
	}
}
