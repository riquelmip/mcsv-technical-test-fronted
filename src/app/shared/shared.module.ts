import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { ColumnValuePipe } from './pipes/column-value.pipe';
import { TableComponent } from './components/table/table.component';

@NgModule({
  declarations: [TableComponent, ColumnValuePipe],
  imports: [CommonModule, SharedRoutingModule, NgxSpinnerModule, RouterModule],
  exports: [NgxSpinnerModule, RouterModule, TableComponent],
})
export class SharedModule {}
