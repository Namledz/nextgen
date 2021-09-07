import { Filter } from './../../../../../../auth/_models/filter.model';
import { AuthService } from './../../../../../../auth/_services/auth.service';
import { FilterService } from './../../../../../_services/filter.service';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { UserModel } from 'src/app/modules/auth/_models/user.model';
import { first, catchError, filter } from 'rxjs/operators';

interface CustomResponse {
  status: string,
  filter?: Filter,
  filters?: Filter[],
  message?: string
}


@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent implements OnInit {
  @Input() title: string;
  @Input() filter_string: string;
  

  isLoading: boolean = false;
  subscriptions: Subscription[] = [];
  user: UserModel
  filter: Filter
  filters: Filter[]

  // Selected filter
  selectedSaveFilter: string = ""
  inputNewFilter: string = ""

  constructor(
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private filterService: FilterService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser()
    this.getFilters()
  }

  save() {
    let data = !this.selectedSaveFilter ?
    {
      name: this.inputNewFilter,
      filter_string: this.filter_string
    } : {
      name: this.selectedSaveFilter,
      filter_string: this.filter_string
    }

    const sb = this.filterService.saveFilter(data).pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(null);
      })
    ).subscribe((res: CustomResponse) => {
      if (res.status === 'success') {
        this.toastr.success(res.message)
        this.modal.dismiss()
      }
    });
    this.subscriptions.push(sb);
  }

  load() {
    const sb = this.filterService.loadFilter(this.selectedSaveFilter).pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(null);
      })
    ).subscribe((res: CustomResponse) => {
      if (res.status === 'success') {
        this.filter = res.filter
        this.modal.close(JSON.parse(this.filter.filter_string))
      }
    });
    this.subscriptions.push(sb);
  }

  getFilters() {
    const sb = this.filterService.getFilters(this.user).pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of([]);
      })
    ).subscribe((res: CustomResponse) => {
      if (res.status === 'success') {
        this.filters = res.filters
      }
    });
    this.subscriptions.push(sb);
  }

  checkSave() {
    if(this.selectedSaveFilter == '' && this.inputNewFilter == '') {
      return true
    }
	}

  checkLoad() {
    if(this.selectedSaveFilter == '') {
      return true
    }
	}

}
