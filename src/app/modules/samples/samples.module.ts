import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {SamplesComponent } from './samples.component';
import { SamplesRoutingModule } from './samples-routing.module';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { SamplesListComponent } from './samples-list/samples-list.component';

@NgModule({
    declarations: [
        SamplesComponent,
        SamplesListComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        SamplesRoutingModule,
        InlineSVGModule,
        CRUDTableModule,
        NgbDatepickerModule,
        NgbModalModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatTabsModule,
    ],
    entryComponents: [
        SamplesListComponent
    ]
})
export class SamplesModule {}