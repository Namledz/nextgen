import { Component, OnDestroy, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VariantSelectedListService } from '../../../_services/variant-selected-list.service'
import { VariantListService } from '../../../_services/variant-list.service';
import { environment } from '../../../../../../environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
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
  selector: 'app-analysis-report-variant',
  templateUrl: './analysis-report-variant.component.html',
  styleUrls: ['./analysis-report-variant.component.scss']
})
export class AnalysisReportVariantComponent implements 
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
  variantSelected: any[];
  @Input() id;
  url: any;
  htmlString: string;
  htmlData: any;
  sorting: SortState;

  constructor(public varianSelectedtListService: VariantSelectedListService, private fb: FormBuilder, private modalService: NgbModal, private toastr: ToastrService, private sanitizer: DomSanitizer, 
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
		this.url = `${environment.apiUrl}/getSeletedVariants/${this.id}`
		this.varianSelectedtListService.API_URL = this.url;
    this.varianSelectedtListService.fetch();
    this.sorting = this.varianSelectedtListService.sorting;
    this.grouping = this.varianSelectedtListService.grouping;
    this.varianSelectedtListService.items$.subscribe((res) => {
        this.variantSelected = res;
    })
    const sb = this.varianSelectedtListService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
  }

  sort(column: string) {
    console.log(this.grouping.getSelectedRows())
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.varianSelectedtListService.patchState({ sorting });
  }

  getVariantClass (classification) {
		return `${classification.split(" ").join("-")}`;
	}

  edit(id: number) {

	}

	delete(variant: any) {
    console.log(variant)

	}

  deleteSelected() {

	}

  fetchSelected() {

	}

  createReport() {
    let selectedIds = this.grouping.getSelectedRows();
    let selectedFilter = this.variantSelected.filter((el) => {
        return selectedIds.includes(el.id)
    })
    const sb = this.varianSelectedtListService.createReport({selectedFilter})
    .subscribe((res : any) => {
        if(res.body.status == 'success') {
            this.toastr.success(res.body.message);
            this.htmlString = res.body.html;
            this.htmlData = this.sanitizer.bypassSecurityTrustHtml(this.htmlString);
            this.cd.detectChanges();
        } else {
            this.toastr.error(res.body.message);
        }
    })
    this.subscriptions.push(sb);    
    
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }



}
