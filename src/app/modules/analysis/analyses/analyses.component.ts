import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4plugins_venn from "@amcharts/amcharts4/plugins/venn";

@Component({
  selector: 'app-analyses',
  templateUrl: './analyses.component.html',
  styleUrls: ['./analyses.component.scss']
})
export class AnalysesComponent implements OnInit {
  isChecked = true;
  total = 4;
  @ViewChild("chart") private chartElement: ElementRef
  constructor(
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.venn()
  }

  onChange($event) {
    if ($event.target.checked == false) {
      this.total = this.total - 1
    } else {
      this.total = this.total + 1
    }
    this.cd.detectChanges();
  }

  venn() {
    am4core.useTheme(am4themes_animated);
    var chart = am4core.create("chartdiv",am4plugins_venn.VennDiagram)
    var series = chart.series.push(new am4plugins_venn.VennSeries())
    series.dataFields.category = "name";
    series.dataFields.value = "value";
    series.dataFields.intersections = "sets";
    series.slices.template.fillOpacity = 0.5;
    series.data = [
      { name: "A", value: 50 },
      { name: "B", value: 50 },
      { name: "C", value: 50 },
      { name: "D", value: 50 },
      
      { name: "AB", value: 30, sets: ["A", "B"] },
      { name: "BC", value: 30, sets: ["B", "C"] },
      { name: "CD", value: 30, sets: ["C", "D"] },
      { name: "DA", value: 30, sets: ["D", "A"] },
      
      { name: "ABD", value: 20, sets: ["A", "B", "D"] },
      { name: "ACD", value: 20, sets: ["A", "C", "D"] },
      { name: "BCD", value: 20, sets: ["B", "C", "D"] },
      { name: "ABC", value: 20, sets: ["A", "B", "C"] },
      
      { name: "ABCD", value: 10, sets: ["A", "B", "C", "D"] },
    ];
    
  }

}
