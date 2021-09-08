import { FilterModalComponent } from './component/filter-modal/filter-modal.component';
import { Variant } from './../../../_models/variant.model';
import { Component, Input, OnDestroy, OnInit, ChangeDetectorRef, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VariantListService } from '../../../_services/variant-list.service';
import { environment } from '../../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { IgvModalComponent } from './component/igv-modal/igv-modal.component';
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
import { Datalist } from '../../../ultils/datalist';
import { VariantDetailModalComponent } from '../variant-detail-modal/variant-detail-modal.component';
import $ from 'jquery';

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
	loadingExport: boolean = false;
	filterGroup: FormGroup;
	searchGroup: FormGroup;
	variantList: any[];
	
	old_annotation: string[] = [];

	private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	@ViewChild('btnShowCol') toggleButton: ElementRef;
	@ViewChild('listColumn') menu: ElementRef;

	asideState: boolean = true
	public chromosomeList = Datalist.chromosome
	public annotationList: any
	public annotationOptions: any
	public classificationList = Datalist.classification

	public options = {
		width: '100%',
		multiple: true,
		tags: true
	};

	isListShowing = false;
	columnSelected = [];

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
		private renderer: Renderer2,
		private toastr: ToastrService
	) {

	}

	// angular lifecircle hooks
	ngOnInit(): void {
		this.url = `${environment.apiUrl}/variant/${this.id}`
		this.variantListService.API_URL = this.url;
		this.filterForm();
		this.applyFilter()

		this.setUpSelect2();
		// this.searchForm();
		// this.variantListService.sorting.column = 'classification';
		// this.variantListService.sorting.direction = 'asc';
		this.variantListService.fetch();
		this.sorting = this.variantListService.sorting;
		this.grouping = this.variantListService.grouping;
		this.paginator = this.variantListService.paginator;
		const sb = this.variantListService.isLoading$.subscribe(res => this.isLoading = res);
		this.variantListService.items$.subscribe((res) => {
			this.variantList = res;
		})
		this.subscriptions.push(sb);
		this.showColumnList()
	}

	setUpSelect2() {
		this.annotationOptions = {
			width: '100%',
			multiple: true,
			tags: true,
			templateResult: function (item) {
				if (!item.id) {
					return item.text
				}

				var $result
				if (item.dad) {
					$result = $('<span style="padding-left: 20px;">' + item.text + '</span>');
				} else {
					$result = $('<span style="font-weight: 700;">' + item.text + '</span>');
				}

				return $result;
			}
		};

		this.annotationList = [
			{ id: "exonic", text: "Exon", items: ["frameshift", "inframe indel", "start lost", "start retained", "nonframeshift", "nonsynonymous SNV", "synonymous SNV", "stopgain", "stoploss", "stop retained", "coding", "missense", "Protein altering variant"], show: true },
			{ id: "frameshift", text: "Frameshift", dad: "exonic", show: true },
			{ id: "inframe indel", text: "Inframe indel", dad: "exonic", show: true },
			{ id: "missense", text: "Missense", dad: "exonic", show: true },
			{ id: "start lost", text: "Start loss", dad: "exonic", show: true },
			{ id: "start retained", text: "Start retained", dad: "exonic", show: true },
			{ id: "stopgain", text: "Stop gained", dad: "exonic", show: true },
			{ id: "stoploss", text: "Stop loss", dad: "exonic", show: true },
			{ id: "stop retained", text: "Stop retained", dad: "exonic", show: true },
			{ id: "synonymous SNV", text: "Synonymous", dad: "exonic", show: true },
			{ id: "coding", text: "Coding", dad: "exonic", show: true },
			{ id: "Protein altering variant", text: "Protein altering variant", dad: "exonic", show: true },
			{ id: "intronic", text: "Intron", show: true },
			{ id: "splicing", text: "Splicing", items: ["splice_acceptor", "splice_donor", "splice_region"], show: true },
			{ id: "splice_acceptor", text: "Splice acceptor", dad: "splicing", show: true },
			{ id: "splice_donor", text: "Splice donor", dad: "splicing", show: true },
			{ id: "splice_region", text: "Splice region", dad: "splicing", show: true },
			{ id: "UTR", text: "UTR", items: ["3UTR", "5UTR"], show: true },
			{ id: "3UTR", text: "3` UTR", dad: "UTR", show: true },
			{ id: "5UTR", text: "5` UTR", dad: "UTR", show: true },
			{ id: "regulatory_region", text: "Regulatory Region", items: ["TF_site", "sub_requlatory_region"], show: true },
			{ id: "sub_requlatory_region", text: "Regulatory region", dad: "regulatory_region", show: true },
			{ id: "upstream", text: "Upstream", items: ["NMD", "sub_upstream"], show: true },
			{ id: "NMD", text: "NMD", dad: "upstream", show: true },
			{ id: "sub_upstream", text: "Upstream variant", dad: "upstream", show: true },
			{ id: "downstream", text: "Downstream", show: true },
			{ id: "noncoding", text: "Noncoding", items: ["noncoding_exon", "noncoding_intron"], show: true },
			{ id: "noncoding_exon", text: "Noncoding exon", dad: "noncoding", show: true },
			{ id: "noncoding_intron", text: "Noncoding intron", dad: "noncoding", show: true },
			{ id: "intergenic", text: "Intergenic", show: true },
			{ id: "other", text: "Other", show: true }
		]

		
	}

	ngAfterViewInit() {
		// This is required in order for Context Menu component to appear
		// The menu is added as a child of specified app component
		this.setColumnSelected(this.columnsName.filter(e => e.isSelected).map(e => e.columnVal))
	}

	ngOnDestroy() {
		this.variantListService.patchStateReset();
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}

	showColumnList() {
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

	// filtration
	filterForm() {
		this.filterGroup = this.fb.group({
			geneName: [''],
			chromosome: [],
			gnomADfrom: 0,
			gnomADto: [''],
			readDepthSign: 'greater',
			readDepth: 10,
			AFSign: 'greater',
			alleleFraction: 0.02,
			gnomAdSign: 'greater',
			gnomAd: 0,
			annotation: [''],
			classification: [''],
		});
	}

	applyFilter() {
		let filter = this.filter();
		this.variantListService.patchState({ filter });
	}

	reset() {
		this.filterGroup.reset()
		// this.filterGroup = this.fb.group({
		// 	geneName: [''],
		// 	chromosome: [],
		// 	gnomADfrom: 0,
		// 	gnomADto: [''],
		// 	readDepthSign: 'greater',
		// 	readDepth: 10,
		// 	AFSign: 'greater',
		// 	alleleFraction: 0.02,
		// 	gnomAdSign: 'greater',
		// 	gnomAd: 0,
		// 	annotation: [''],
		// 	classification: [''],
		// });
		let filter = this.filter();
		this.variantListService.patchState({ filter });
	}

	filter() {
		let filter = {};
		const chromosome = this.filterGroup.get('chromosome').value;
		if (chromosome) {
			let arrayInt = []
			chromosome.forEach(e => {
				let tmp = e.split(" ")
				arrayInt.push(parseInt(tmp[1]))
			})

			filter['chrom'] = arrayInt;
		}

		const readDepthSign = this.filterGroup.get('readDepthSign').value;
		if (readDepthSign) {
			filter['readDepthSign'] = readDepthSign;
		}

		const readDepth = this.filterGroup.get('readDepth').value;
		if (readDepth || readDepth == 0) {
			filter['readDepth'] = readDepth;
		}

		const AFSign = this.filterGroup.get('AFSign').value;
		if (AFSign) {
			filter['AFSign'] = AFSign;
		}

		const alleleFraction = this.filterGroup.get('alleleFraction').value;
		if (alleleFraction || alleleFraction == 0) {
			filter['alleleFraction'] = alleleFraction;
		}

		const gnomAdSign = this.filterGroup.get('gnomAdSign').value;
		if (gnomAdSign) {
			filter['gnomAdSign'] = gnomAdSign;
		}

		const gnomAd = this.filterGroup.get('gnomAd').value;
		if (gnomAd || gnomAd == 0) {
			filter['gnomAd'] = gnomAd;
		}

		// const sequencenceOntology = this.filterGroup.get('sequencenceOntology').value;
		// if (sequencenceOntology) {
		// 	filter['sequencence_ontology'] = sequencenceOntology;
		// }

		const geneName = this.filterGroup.get('geneName').value
		if (geneName) {
			filter['gene'] = geneName;
		}

		const annotation = this.filterGroup.get('annotation').value
		if (annotation) {
			filter['annotation'] = annotation;
		}

		const classification = this.filterGroup.get('classification').value
		if (classification) {
			filter['classification'] = classification;
		}

		return filter;
	}

	// searchForm() {
	// 	this.searchGroup = this.fb.group({
	// 		geneName: [''],
	// 	});
	// }

	search(searchTerm: string) {
		this.variantListService.patchState({ searchTerm });
	}

	formatLabel(value: number) {
		return value;
	}

	toggleAside() {
		if (this.asideState) {
			this.asideState = false
			// document.getElementById("aside").style.width = '0'
			// document.getElementById("aside").style.padding = '0'
			// document.getElementById("aside").style.border = 'none'
			document.getElementById("content-container").style.width = '100%'
			document.getElementById("aside").style.transform = 'translateX(-100%)'
			document.getElementById("kt_aside_toggle").style.right = '-40px'
			document.getElementById("aside").style.position = 'absolute'

		} else {
			this.asideState = true
			// document.getElementById("aside").style.width = '15%'
			// document.getElementById("aside").style.padding = '20px'
			// document.getElementById("aside").style.border = '1px solid #dee2e6'
			document.getElementById("content-container").style.width = '85%'
			document.getElementById("aside").style.transform = 'translateX(0)'
			document.getElementById("kt_aside_toggle").style.right = '-15px'
			document.getElementById("aside").style.position = 'initial'
		}


	}

	openIGVModal(chrom: any, position: any) {
		const modalRef = this.modalService.open(IgvModalComponent, { size: 'lg', windowClass: "igv-browser-modal" });
		modalRef.componentInstance.chrom = chrom;
		modalRef.componentInstance.position = position;
		modalRef.componentInstance.id = this.id;

		modalRef.result.then(() => {
			this.cd.detectChanges(),
				() => { }
		});
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

	checkColumnIsSelected(columnVal) {
		return !(this.columnSelected.indexOf(columnVal) != -1)
	}

	getVariantClass(classification) {
		return `${classification.split(" ").join("-")}`;
	}

	addReport() {
		let selectedIds = this.grouping.getSelectedRows();
		let selectedFilter = this.variantList.filter((el) => {
			return selectedIds.includes(el._id)
		})

		let data = selectedFilter.map((el) => {
			let obj = {
				chrom: "",
				pos: "",
				ref: "",
				alt: "",
				gene: "",
				end: ""
			};
			obj.chrom = el.chrom;
			obj.pos = el.position;
			obj.ref = el.REF;
			obj.alt = el.ALT;
			obj.gene = el.gene;

			return obj;
		})

		const sb = this.variantListService.selectVariantToReport({ data })
			.subscribe((res: any) => {
				if (res.body.status == 'success') {
					this.toastr.success(res.body.message);
				} else {
					this.toastr.error(res.body.message);
				}
			})
		this.subscriptions.push(sb);
	}

	exportVariants() {
		// loading
		this.loadingExport = true;
		
		let selectedIds = this.grouping.getSelectedRows();
		let selectedFilter = this.variantList.filter((el) => {
			return selectedIds.includes(el._id)
		})

		let data = selectedFilter.map((el) => {
			let obj = {
				gene: el.gene,
				transcript: el.transcript_id,
				hgvsc: el.cnomen,
				p_nomen: el.pnomen,
				coverage: el.coverage,
				func: el.function,
				location: el.location,
				clinvar: el.Clinvar_VARIANT_ID,
				classification: el.classification,
				gnomad_all: el.gnomad_ALL,
				gnomad_amr: el.gnomad_AMR,
				gnomad_afr: el.gnomad_AFR,
				rsId: el.rsid,
				ref: el.REF,
				alt: el.ALT,
				cosmic: el.cosmicID,
				position: el.position
			};

			return obj;
		})

		const sb = this.variantListService.exportVariants({ data })
			.subscribe((res: any) => {
				this.loadingExport = false;
				if (res.body.status == 'success') {
					this.toastr.success(res.body.message);
					this.cd.detectChanges();
					setTimeout(() => {
						var url = res.body.url;
						window.open(url);
					}, 1000);
				} else {
					this.toastr.error(res.body.message);
				}
			})
		this.subscriptions.push(sb);
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

	getVariantDetail(variant: Variant) {
		const modalRef = this.modalService.open(VariantDetailModalComponent, { size: 'xl' });
		modalRef.componentInstance.variant = variant;
		modalRef.result.then(() =>
			this.cd.detectChanges(),
			() => { }
		);
	}

	onTagChanged(value: string[] | null) {
		let current = value
		if (current.length != this.old_annotation.length) {
			if (current.length > this.old_annotation.length) {
				let diff = current.filter(e => !this.old_annotation.includes(e))
				diff.forEach(e => {
					let index = this.annotationList.findIndex(anno => anno.id == e)
					if (index > -1) {
						if (this.annotationList[index].items) {
							this.annotationList[index].items.forEach(child => {
								let index2 = current.indexOf(child)
								if (index2 == -1) {
									current.push(child)
								}
							})
						}
					}
				})
			} else {
				let diff = this.old_annotation.filter(e => !current.includes(e))
				diff.forEach((e: any) => {
					let index = this.annotationList.findIndex(anno => anno.id == e)
					if (index > -1) {
						if (this.annotationList[index].items) {
							this.annotationList[index].items.forEach(child => {
								let index2 = current.indexOf(child)
								if (index2 != -1) {
									current.splice(index2, 1)
								}
							})
						} else {
							let index2 = current.indexOf(e.dad)
							if (index2 != -1) {
								current.splice(index2, 1)
							}
						}
					}
				})
			}

			this.filterGroup.patchValue({
				annotation: current,
			})
			this.old_annotation = current
		}
	}

	saveFilter() {
		const modalRef = this.modalService.open(FilterModalComponent, { size: 'lg' });
		modalRef.componentInstance.title = "Save";
		modalRef.componentInstance.filter_string = JSON.stringify(this.filter())
		modalRef.result.then(() =>
			this.cd.detectChanges(),
			() => { }
		);
	}

	loadFilter() {
		const modalRef = this.modalService.open(FilterModalComponent, { size: 'lg' });
		modalRef.componentInstance.title = "Load";
		modalRef.result.then((filterLoaded) => {
			this.variantListService.patchState({filter: filterLoaded});

			// patch form group filter
			this.filterGroup.patchValue({
				geneName: filterLoaded.geneName ? filterLoaded.geneName : [''],
				chromosome: filterLoaded.chromosome ? filterLoaded.chromosome : [],
				gnomADfrom: filterLoaded.gnomADfrom ? filterLoaded.gnomADfrom : 0,
				gnomADto: filterLoaded.gnomADto ? filterLoaded.gnomADto : [''],
				readDepthSign: filterLoaded.readDepthSign ? filterLoaded.readDepthSign :  'greater',
				readDepth: filterLoaded.readDepth ? filterLoaded.readDepth : 10,
				AFSign: filterLoaded.AFSign ? filterLoaded.AFSign :  'greater',
				alleleFraction: filterLoaded.alleleFraction ? filterLoaded.alleleFraction : 0.02,
				gnomAdSign: filterLoaded.gnomAdSign ? filterLoaded.gnomAdSign : 'greater',
				gnomAd: filterLoaded.gnomAd ? filterLoaded.gnomAd : 0,
				annotation: filterLoaded.annotation ? filterLoaded.annotation : [''],
				classification: filterLoaded.classification ? filterLoaded.classification : [''],
			})
			
			this.cd.detectChanges()
		}); 
	}

}
