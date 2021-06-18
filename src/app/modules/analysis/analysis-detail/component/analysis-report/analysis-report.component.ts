import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TestService } from '../../../_services/test.service'
@Component({
  selector: 'app-analysis-report',
  templateUrl: './analysis-report.component.html',
  styleUrls: ['./analysis-report.component.scss']
})
export class AnalysisReportComponent implements OnInit {
  @Input() id: string;
  htmlString: string;
	htmlData: any;

  constructor(private sanitizer: DomSanitizer, private cd: ChangeDetectorRef, private testService: TestService) { }

	ngOnInit(): void {
		var self = this;
		const sb = this.testService.getQCVCF(123)
			.subscribe(function (res) {
				if (res.status == "success") {
					self.htmlString = res.html;
					self.htmlData = self.sanitizer.bypassSecurityTrustHtml(self.htmlString);
					self.cd.detectChanges();
				}
			})
	}

}
