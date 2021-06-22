import { Injectable, OnDestroy } from '@angular/core';
import { TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { Samples } from '../_models/samples.model';

@Injectable({
  providedIn: 'root'
})
export class SamplesService extends TableService<Samples> implements OnDestroy {
  API_URL = `${environment.apiUrl}/samples`
  constructor() { }
}
