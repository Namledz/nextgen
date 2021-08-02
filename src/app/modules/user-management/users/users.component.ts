import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  GroupingState,
  PaginatorState,
  SortState,
  ICreateAction,
  IEditAction,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
} from '../../../_metronic/shared/crud-table';
import { WorkspacesService } from '../../workspaces/services/workspaces.service';
import { UsersService } from '../services/users.service';
import { DeleteUserModalComponent } from './components/delete-user-modal/delete-user-modal.component';
import { EditUserModalComponent } from './components/edit-user-modal/edit-user-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements
  OnInit,
  OnDestroy,
  ICreateAction,
  IEditAction,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
  IFilterView {

  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public usersService: UsersService,
  ) { }

  ngOnInit(): void {
    console.log(this.usersService.items$)
    this.filterForm();
    this.searchForm();
    this.usersService.fetchUsers();
    this.grouping = this.usersService.grouping;
    this.paginator = this.usersService.paginator;
    this.sorting = this.usersService.sorting;
    const sb = this.usersService.isLoading$.subscribe(res => this.isLoading = res);

  }

  filterForm() {
    this.filterGroup = this.fb.group({
      role: [''],
      searchTerm: [''],
    });
    this.subscriptions.push(
      this.filterGroup.controls.role.valueChanges.subscribe(() =>
        this.filter()
      )
    );
  }
  
  filter() {
    const filter = {};
    const role = this.filterGroup.get('role').value;
    if (role) {
      filter['role'] = role;
    }
    this.usersService.patchStateUsers({ filter });
  }

  search(searchTerm: string) {
    this.usersService.patchStateUsers({ searchTerm });
  }

  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });
    const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
      .pipe(
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe((val) => this.search(val));
    this.subscriptions.push(searchEvent);
  }

  sort(column: string) {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.usersService.patchStateUsers({ sorting });
  }


  paginate(paginator: PaginatorState) {
    this.usersService.patchStateUsers({ paginator });
  }

  create() {
    this.edit(undefined);
  }

  edit(id) {
    const modalRef = this.modalService.open(EditUserModalComponent, { size: 'xl' });
    modalRef.componentInstance.uuid = id;
    modalRef.result.then(() =>
      this.usersService.fetchUsers(),
      () => {}
    );
  }

  delete(id) {
    const modalRef = this.modalService.open(DeleteUserModalComponent, {size: 'md'});
    modalRef.componentInstance.uuid = id;
    modalRef.result.then(() => {
      this.usersService.fetchUsers(),
      () => {}
    })
  }

  deleteSelected(): void {
  }
  fetchSelected(): void {
  }
  updateStatusForSelected(): void {
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

}
