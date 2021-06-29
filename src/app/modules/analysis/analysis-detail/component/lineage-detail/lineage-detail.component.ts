import { Component, OnDestroy, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { LineageDetailService } from '../../../_services/lineage-detail.service'
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
  selector: 'app-lineage-detail',
  templateUrl: './lineage-detail.component.html',
  styleUrls: ['./lineage-detail.component.scss']
})
export class LineageDetailComponent implements 
  OnInit,
  OnDestroy,
  IEditAction,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IGroupingView,
  ISortView {

  grouping: GroupingState;
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  @Input() id;
  url: any;
  sorting: SortState;
  searchGroup: FormGroup;
  paginator: PaginatorState;

  constructor(private fb: FormBuilder, private modalService: NgbModal, private toastr: ToastrService, private cd: ChangeDetectorRef, public lineageDetailService: LineageDetailService) { }

  ngOnInit(): void {
    this.searchForm();
    this.lineageDetailService.fetch();
    this.grouping = this.lineageDetailService.grouping;
    this.paginator = this.lineageDetailService.paginator;
    this.sorting = this.lineageDetailService.sorting;
    this.lineageDetailService.items$.subscribe((res) => {
      console.log(res)
    })
    const sb = this.lineageDetailService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
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
    this.lineageDetailService.patchState({ sorting });
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

  search(searchTerm: string) {
    this.lineageDetailService.patchState({ searchTerm });
  }

  paginate(paginator: PaginatorState) {
    this.lineageDetailService.patchState({ paginator });
  }

  edit(id: number) {

	}

	delete() {


	}

  deleteSelected() {

	}

  fetchSelected() {

	}

  ngOnDestroy() {
    this.lineageDetailService.patchStateReset();
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

}
