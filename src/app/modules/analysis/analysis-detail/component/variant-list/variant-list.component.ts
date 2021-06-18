import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VariantListService } from '../../../_services/variant-list.service';
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

	constructor(
		private fb: FormBuilder,
		private modalService: NgbModal,
		public variantListService: VariantListService
	) { }

	// angular lifecircle hooks
	ngOnInit(): void {
		this.filterForm();
		this.searchForm();
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
		this.variantListService.patchState({ filter });
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
		this.variantListService.patchState({ searchTerm });
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
