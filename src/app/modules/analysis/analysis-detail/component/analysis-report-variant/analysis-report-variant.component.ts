import { Component, OnDestroy, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VariantSelectedListService } from '../../../_services/variant-selected-list.service'
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
  loadingExport = false;
  private subscriptions: Subscription[] = [];
  variantSelected: any[];
  @Input() id;
  url: any;
  htmlString: string;
  htmlData: any;
  sorting: SortState;

  constructor(public varianSelectedtListService: VariantSelectedListService, private fb: FormBuilder, private modalService: NgbModal, private toastr: ToastrService, private sanitizer: DomSanitizer, private cd: ChangeDetectorRef) { }

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

  exportReport() {
		const header = document.getElementsByClassName('report_header')[0].innerHTML;
		const contentBody = document.getElementsByClassName('result_content')[0].innerHTML;
		const footer = document.getElementsByClassName('report-footer')[0].innerHTML;
		const htmlStartHeader = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>';
		const htmlStartFooter = '<!DOCTYPE html><html><head><meta charset="UTF-8">';
		const htmlEnd = "</body></html>";
		const pageNumberJS = "<script>\
		   function subst() {\
			   var vars={};\
			   document.getElementById('page-number').style.display = 'block';\
			   document.getElementById('page-number').style.marginRight = '0';\
			   document.getElementById('page-number').style.marginLeft = 'auto';\
			   var x=document.location.search.substring(1).split('&');\
			   for (var i in x) {var z=x[i].split('=',2);vars[z[0]] = unescape(z[1]);};\
			   var x=['frompage','topage','page','webpage','section','subsection','subsubsection'];\
			   for (var i in x) {\
				   var y = document.getElementsByClassName(x[i]);\
				   for (var j=0; j<y.length; ++j) y[j].textContent = vars[x[i]];\
			   }\
			 }\
		 </script></head><body onload=\"subst()\">";

		const data = {
			header : header != undefined ? htmlStartHeader + header + htmlEnd : null,
			contentBody : contentBody,
			footer : footer != undefined ? htmlStartFooter + pageNumberJS + footer + htmlEnd : null
		}
    console.log(data)
    this.loadingExport = true;

    const sb = this.varianSelectedtListService.exportReport(data)
    .subscribe((res : any) => {
      console.log(res)
        if(res.body.status == 'success') {
            this.toastr.success(res.body.message);
            this.loadingExport = false;
            this.cd.detectChanges();
            setTimeout(() => {
              var url = res.body.url;
              window.open(url);
            }, 1000);
        } else {
          this.loadingExport = false;
          this.toastr.error(res.body.message);
        }
    })
    this.subscriptions.push(sb); 
	}

  ngOnDestroy() {
    this.varianSelectedtListService.patchStateReset();
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }



}
