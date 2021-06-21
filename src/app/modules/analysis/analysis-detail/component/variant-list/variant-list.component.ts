import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VariantListService } from '../../../_services/variant-list.service';
import { environment } from '../../../../../../environments/environment';
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
} from '../../../../../_metronic/shared/crud-table';

@Component({
	selector: 'app-variant-list',
	templateUrl: './variant-list.component.html',
	styleUrls: ['./variant-list.component.scss']
})
export class VariantListComponent implements
	OnInit,
	OnDestroy,
	ICreateAction,
	IEditAction,
	IDeleteAction,
	IDeleteSelectedAction,
	IFetchSelectedAction,
	IUpdateStatusForSelectedAction,
	ISortView,
	IGroupingView {
	@Input() id;
	url: any
	paginator: PaginatorState;
	sorting: SortState;
	grouping: GroupingState;
	isLoading: boolean;


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
		public variantListService: VariantListService
	) { }

	// angular lifecircle hooks
	ngOnInit(): void {
		this.url = `${environment.apiUrl}/variant/${this.id}`
		this.variantListService.API_URL = this.url;
		// this.filterForm();
		// this.searchForm();
		this.variantListService.fetch();
		this.grouping = this.variantListService.grouping;
		this.paginator = this.variantListService.paginator;
		this.sorting = this.variantListService.sorting;
		const sb = this.variantListService.isLoading$.subscribe(res => this.isLoading = res);
		this.subscriptions.push(sb);
	}

	ngOnDestroy() {
		this.subscriptions.forEach((sb) => sb.unsubscribe());
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
		this.variantListService.patchState({ sorting });
	}

	// pagination
	paginate(paginator: PaginatorState) {
		this.variantListService.patchState({ paginator });
	}

	create() {

	}

	edit(id: number) {
	}

	delete(id: number) {
	}

	deleteSelected() {
	}

	updateStatusForSelected() {
	}

	fetchSelected() {
	}
}
