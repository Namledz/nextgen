import { Component, Input, OnDestroy, OnInit, ChangeDetectorRef, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
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
	AfterViewInit,
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
	filterGroup: FormGroup;
	searchGroup: FormGroup;

	private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	@ViewChild('btnShowCol') toggleButton: ElementRef;
	@ViewChild('listColumn') menu: ElementRef;

	dropdownList = [];
	isListShowing = false;
	columnSelected = [];

	public options = {
		width: '100%',
		multiple: true,
		tags: true
	};

	columnsName: any[] = [
		{ name: 'GnomAD_AMR', isSelected: false, columnVal: 'gnomad_AMR' },
		{ name: 'GnomAD_AFR', isSelected: false, columnVal: 'gnomad_AFR' },
		{ name: 'rsID', isSelected: false, columnVal: 'rsid' },
		{ name: 'P.Nomen', isSelected: false, columnVal: 'pnomen' },
		{ name: 'REF-ALT', isSelected: false, columnVal: 'REF-ALT' },
		{ name: 'Cosmic', isSelected: false, columnVal: 'cosmicID' },
		{ name: 'Position', isSelected: false, columnVal: 'position' }
	];

	constructor(
		private fb: FormBuilder,
		private modalService: NgbModal,
		public variantListService: VariantListService,
		private cd: ChangeDetectorRef,
		private renderer: Renderer2
	) {
		
	}

	// angular lifecircle hooks
	ngOnInit(): void {
		this.url = `${environment.apiUrl}/variant/${this.id}`
		this.variantListService.API_URL = this.url;
		// this.filterForm();
		// this.searchForm();
		this.sorting = this.variantListService.sorting;
		this.variantListService.fetch();
		this.grouping = this.variantListService.grouping;
		this.paginator = this.variantListService.paginator;
		const sb = this.variantListService.isLoading$.subscribe(res => this.isLoading = res);
		this.subscriptions.push(sb);
		this.showColumnList()
	}

	ngAfterViewInit() {
		// This is required in order for Context Menu component to appear
		// The menu is added as a child of specified app component
		this.setColumnSelected(this.columnsName.filter(e => e.isSelected).map(e => e.columnVal))
	}

	ngOnDestroy() {
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}

	// filtration
	filterForm() {
		this.filterGroup = this.fb.group({
			chromosome: [''],
			gnomAdCompare: [''],
			gnomAdText: [''],
			qualityGreater: [''],
			qualityLower: [''],
			sequencenceOntology: [''],
			depthGreater: [''],
			depthLower: ['']
		});
	}

	applyFilter() {
		let filter = this.filter();
		console.log(this.filter());
		this.variantListService.patchState({ filter });
	}

	showColumnList () {
		this.renderer.listen('window', 'click', (e: Event) => {
			/**
			 * Only run when toggleButton is not clicked
			 * If we don't check this, all clicks (even on the toggle button) gets into this
			 * section which in the result we might never see the menu open!
			 * And the menu itself is checked here, and it's where we check just outside of
			 * the menu and button the condition abbove must close the menu
			 */
			const target = e.target as Element;
			let t = (target.classList.contains('mat-list-text') || target.classList.contains('mat-list-item-content') || target.classList.contains('mat-pseudo-checkbox') || target.id == 'dropdownMenu');
			
			if (!t) {
				this.isListShowing = false;
				this.cd.detectChanges();
			}
		});
	}

	filter() {
		let filter = {};
		const chromosome = this.filterGroup.get('chromosome').value;
		if (chromosome) {
			filter['chrom'] = chromosome;
		}

		const depthGreater = this.filterGroup.get('depthGreater').value;
		if (depthGreater) {
			filter['depth_greater'] = depthGreater;
		}

		const depthLower = this.filterGroup.get('depthLower').value;
		if (depthLower) {
			filter['depth_lower'] = depthLower;
		}

		const qualityGreater = this.filterGroup.get('qualityGreater').value;
		if (qualityGreater) {
			filter['quality_greater'] = qualityGreater;
		}

		const qualityLower = this.filterGroup.get('qualityLower').value;
		if (qualityLower) {
			filter['quality_lower'] = qualityLower;
		}

		const gnomAdCompare = this.filterGroup.get('gnomAdCompare').value;
		const filterGnomAdText = this.filterGroup.get('gnomAdText').value;
		if (gnomAdCompare && filterGnomAdText) {
			filter['gnomad'] = {
				type: gnomAdCompare,
				value: filterGnomAdText
			}
		}

		const sequencenceOntology = this.filterGroup.get('sequencenceOntology').value;
		if (sequencenceOntology) {
			filter['sequencence_ontology'] = sequencenceOntology;
		}

		const geneName = this.searchGroup.get('geneName').value
		if (geneName) {
			filter['gene'] = geneName;
		}

		return filter;
	}

	// search
	searchForm() {
		this.searchGroup = this.fb.group({
			geneName: [''],
		});
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


	onColumnListControlChanged(list) {
		let t = list.selectedOptions.selected.map(item => item.value);
		this.setColumnSelected(t);
	}

	setColumnSelected(t) {
		this.columnSelected = t;
		this.cd.detectChanges();
	}

	checkColumnIsSelected (columnVal) {
		return !(this.columnSelected.indexOf(columnVal) != -1)
	}

	getVariantClass (classification) {
		return `${classification.split(" ").join("-")}`;
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
