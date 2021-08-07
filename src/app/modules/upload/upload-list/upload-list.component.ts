import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalUploadComponent } from './component/modal-upload/modal-upload.component';

@Component({
  selector: 'app-upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['./upload-list.component.scss']
})
export class UploadListComponent implements OnInit {

  constructor(private modalService: NgbModal, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  openModalUpload() {
		const modalRef = this.modalService.open(ModalUploadComponent, { size: 'lg' });
		modalRef.result.then(() =>
			this.cd.detectChanges(),
			() => { }
		);
	}

}
