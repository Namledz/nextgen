import { Attribute, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalysisListComponent } from '../.././analysis/analysis-list/analysis-list.component'

@Component({
  selector: 'app-workspaces-index',
  templateUrl: './workspaces-index.component.html',
  styleUrls: ['./workspaces-index.component.scss']
})
export class WorkspacesIndexComponent implements OnInit {

  constructor(
    @Attribute('type') public type: string,
    private route: ActivatedRoute,
  ) { }
  id: any
  tab: any
  data: any
  dashboard: any

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id,
    this.tab = 1
  }

  changeInfo($event) {
    if ($event.target.type == "dashboard") {
      this.tab = 1
    } else {
      this.tab = 2
    }
  }


}
