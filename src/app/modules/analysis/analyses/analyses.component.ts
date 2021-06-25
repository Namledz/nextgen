import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4plugins_venn from "@amcharts/amcharts4/plugins/venn";
import { AnalysisService } from '../_services/analysis.service';

@Component({
	selector: 'app-analyses',
	templateUrl: './analyses.component.html',
	styleUrls: ['./analyses.component.scss']
})
export class AnalysesComponent implements OnInit {
	isChecked = true;
	total = 4;
	data: any
	sampleIds = [];
	keys = [];
	@ViewChild("chartdiv") private chartElement: ElementRef
	constructor(
		private cd: ChangeDetectorRef,
		private analysisService: AnalysisService
	) {

	}

	data2 = [
		{ name: "A", value: 10 },
		{ name: "B", value: 10 },
		{ name: "C", value: 3, sets: ["A", "B"] }
	];

	data3 = [
		{ name: "A", value: 10 },
		{ name: "B", value: 10 },
		{ name: "C", value: 10 },

		{ name: "X", value: 3, sets: ["A", "B"] },
		{ name: "Y", value: 3, sets: ["A", "C"] },
		{ name: "Z", value: 3, sets: ["B", "C"] },
		{ name: "Q", value: 2, sets: ["A", "B", "C"] }
	]

	ngOnInit(): void {
		this.sampleIds = ['6427', '6428', '6429', '6430']
		this.fetchVennData();
	}

	onChange($event) {
		if ($event.target.checked == false) {
			this.total = this.total - 1
			this.sampleIds = this.sampleIds.filter(e => e != $event.target.value);
		} else {
			this.total = this.total + 1
			this.sampleIds.push($event.target.value);
		}
		this.fetchVennData();

	}

	fetchVennData() {
		let self = this;
		this.analysisService.getVennDiagramData({
			sampleIds: this.sampleIds
		}).subscribe((response: any) => {
			if (response.status == 'success') {
				let data = response.data;
				if (self.sampleIds.length < 4) {
					self.data = data;
					self.data.forEach(e => {
						e.color = am4core.color("#1BC5BD")
					})
					self.chartElement.nativeElement.innerHTML = '';
					self.venn();
					console.log(self.data);
				} else {

				}
			}
			self.cd.detectChanges();
		})
	}

	getClass() {
		if (this.total == 3) {
			return 'w1';
		}
		else if (this.total == 2) {
			return 'w2';
		}
		else if (this.total == 1) {
			return 'w3';
		}
	}

	venn() {
		am4core.useTheme(am4themes_animated);
		var chart = am4core.create("chartdiv", am4plugins_venn.VennDiagram)
		var series = chart.series.push(new am4plugins_venn.VennSeries())
		series.dataFields.category = "name";
		series.dataFields.value = "value";
		series.dataFields.intersections = "sets";
		series.slices.template.fillOpacity = 0.5;
		series.slices.template.propertyFields.fill = "color";
		series.data = this.data;
		console.log(this.data);
	}

}
