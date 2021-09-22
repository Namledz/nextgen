import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GroupingState, ICreateAction, IDeleteAction, IDeleteSelectedAction, IEditAction, IFetchSelectedAction, IFilterView, IGroupingView, ISearchView, ISortView, IUpdateStatusForSelectedAction, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { SharedAnalysisService } from '../services/shared-analysis.service';

@Component({
  selector: 'app-shared-analysis-list',
  templateUrl: './shared-analysis-list.component.html',
  styleUrls: ['./shared-analysis-list.component.scss']
})
export class SharedAnalysisListComponent implements
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
	analysis: any;
	type: any;
	private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/


  	constructor(public sharedAnalysisService: SharedAnalysisService) { }

	ngOnInit(): void {
		this.filterForm();
		this.searchForm();
		this.sharedAnalysisService.fetch()
		this.grouping = this.sharedAnalysisService.grouping;
		this.paginator = this.sharedAnalysisService.paginator;
		this.sorting = this.sharedAnalysisService.sorting;
		const sb = this.sharedAnalysisService.isLoading$.subscribe(res => this.isLoading = res);
		this.subscriptions.push(sb);
	}

	checkType() {
		this.analysis.subscribe((res) => {
			if(res.length > 0) {
				this.type = res[0].type
			}
		})
	}

  	formatBytes(bytes, decimals = 2) {
		if (bytes === 0) {
			return "0 Bytes";
		}
		const k = 1024;
		const dm = decimals <= 0 ? 0 : decimals;
		const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
	}

	paginate(paginator: PaginatorState) {
		this.sharedAnalysisService.patchState({ paginator });
	}

	create(): void {
		
	}
	edit(id: number): void {
		
	}
	delete(id: number): void {
		
	}
	deleteSelected(): void {
		
	}
	fetchSelected(): void {
		
	}
	updateStatusForSelected(): void {
		
	}
	sort(column: string): void {
		
	}
	filterForm(): void {
		
	}
	filter(): void {
		
	}
	searchForm(): void {
		
	}
	search(searchTerm: string): void {
		
	}

	ngOnDestroy() {
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}

}
