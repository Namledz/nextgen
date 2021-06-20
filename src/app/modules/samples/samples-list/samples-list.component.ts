import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { 
	GroupingState,
	ICreateAction, 
	IDeleteAction, 
	IDeleteSelectedAction, 
	IEditAction, 
	IFetchSelectedAction, 
	IFilterView, 
	IGroupingView, 
	ISearchView, 
	ISortView, 
	IUpdateStatusForSelectedAction, 
	PaginatorState, 
	SortState } from 'src/app/_metronic/shared/crud-table';
import { AnalysisService } from '../../analysis/_services/analysis.service';

@Component({
  selector: 'app-samples-list',
  templateUrl: './samples-list.component.html',
  styleUrls: ['./samples-list.component.scss']
})
export class SamplesListComponent 
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
		public analysisService: AnalysisService
	) {}

	ngOnInit(): void {
		this.filterForm();
		this.searchForm();
		this.analysisService.fetch();
		this.grouping = this.analysisService.grouping;
		this.paginator = this.analysisService.paginator;
		this.sorting = this.analysisService.sorting;
		const sb = this.analysisService.isLoading$.subscribe(res => this.isLoading = res);
		this.subscriptions.push(sb);
	}
	
	ngOnDestroy(): void {
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}

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

	create(): void {
		throw new Error('Method not implemented.');
	}
	edit(id: number): void {
		throw new Error('Method not implemented.');
	}
	delete(id: number): void {
		throw new Error('Method not implemented.');
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
		this.analysisService.patchState({ sorting });
	}

	paginate(paginator: PaginatorState) {
		this.analysisService.patchState({ paginator });
	}

	deleteSelected(): void {
		throw new Error('Method not implemented.');
	}
	fetchSelected(): void {
		throw new Error('Method not implemented.');
	}
	updateStatusForSelected(): void {
		throw new Error('Method not implemented.');
	}

	filter(): void {
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
	search(searchTerm: string): void {
		this.analysisService.patchState({ searchTerm });
	}
}
