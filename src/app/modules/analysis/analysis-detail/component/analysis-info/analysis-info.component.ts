import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AnalysisService } from '../../../_services/analysis.service';

@Component({
  selector: 'app-analysis-info',
  templateUrl: './analysis-info.component.html',
  styleUrls: ['./analysis-info.component.scss']
})
export class AnalysisInfoComponent implements OnInit {
  html: SafeHtml


  constructor(private analysisService: AnalysisService,
    private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getFastqQC();
  }


  getFastqQC() {
    this.analysisService.getFastqQC().subscribe(response => {
      this.html = this.domSanitizer.bypassSecurityTrustHtml(response);
    })
  }
}
