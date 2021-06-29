import { style } from '@angular/animations';
import { Component, Input, OnInit, ChangeDetectorRef, Inject, ElementRef, ViewChild } from '@angular/core';
import * as IGV from 'igv';
import { Location } from '@angular/common';
import { MatTab } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
	selector: 'app-analyses-detail',
	templateUrl: './analyses-detail.component.html',
	styleUrls: ['./analyses-detail.component.scss']
})
export class AnalysesDetailComponent implements OnInit {

	tabIndex = 0;
	analyses_id: any;
	constructor(private _location: Location, private route: ActivatedRoute) { }
	backUrl: any;

	ngOnInit(): void {
		this.analyses_id = this.route.snapshot.params.analyses_id;
		this.backUrl =  `/analyses/detail-list/${this.analyses_id}`
	}

	

	tabClick(event) {
		this.tabIndex = event.index;
	}

	

}
