import { style } from '@angular/animations';
import { Component, Input, OnInit, ChangeDetectorRef, Inject, ElementRef, ViewChild } from '@angular/core';
import * as IGV from 'igv';
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
	constructor() { }

	ngOnInit(): void {
	}

	tabClick(event) {
		this.tabIndex = event.index;
	}

}
