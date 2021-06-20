import { Component, OnInit } from '@angular/core';

import { AnalysisService } from '../../../_services/analysis.service';

@Component({
  selector: 'app-analysis-info',
  templateUrl: './analysis-info.component.html',
  styleUrls: ['./analysis-info.component.scss']
})
export class AnalysisInfoComponent implements OnInit {
  


  constructor(private analysisService: AnalysisService) { }

  ngOnInit(): void {
    
  }


  
}
