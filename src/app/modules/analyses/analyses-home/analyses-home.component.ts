import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnalysesService } from '../_services/analyses.service';
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
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
	selector: 'app-analyses-home',
	templateUrl: './analyses-home.component.html',
	styleUrls: ['./analyses-home.component.scss']
})
export class AnalysesHomeComponent implements
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

	constructor(public analysesService: AnalysesService) { 
		
	}

	ngOnInit(): void {
		this.filterForm();
		this.searchForm();
		this.analysesService.fetch();
		this.grouping = this.analysesService.grouping;
		this.paginator = this.analysesService.paginator;
		this.sorting = this.analysesService.sorting;
		const sb = this.analysesService.isLoading$.subscribe(res => this.isLoading = res);
		this.subscriptions.push(sb);
	}

	filterForm() {

	}

	filter() {

	}

	searchForm() {

	}

	search(searchTerm: string) {

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
		this.analysesService.patchState({ sorting });
	}

	// pagination
	paginate(paginator: PaginatorState) {
		this.analysesService.patchState({ paginator });
	}

	// form actions
	create() {
		this.edit(undefined);
	}

	edit(id: number) {

	}

	delete(id: number) {

	}

	deleteSelected() {

	}

	fetchSelected() {

	}

	updateStatusForSelected() {

	}

	ngOnDestroy() {
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}
}
