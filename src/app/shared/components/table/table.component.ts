import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableColumn } from '../../interfaces';

@Component({
  selector: 'shared-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  //---- PARA TABLA ---- //
  dataSource: any = []; // TODOS LOS REGISTROS QUE TENDRÁ LA TABLA
  tableDisplayColumns: string[] = []; // TODAS LAS COLUMNAS QUE SE MOSTRARÁN EN LA TABLA
  tableColumns: TableColumn[] = []; // TODAS LAS COLUMNAS
  isBtnUpdate: boolean = false;
  isBtnDelete: boolean = false;
  isThirdBtn: boolean = false;
  labelThirdBtn = 'third button';

  //---- PARA PAGINADOR ---- //
  pageSize = 5; //NUM REGISTROS A MOSTRAR EN LA TABLA
  pageSizeOptions: number[] = [5, 10, 25, 100]; //OPCIONES DE CUANTOS REGISTROS MOSTRAR
  currentPage = 0; //PAGINA ACTUAL
  pagedData: any[] = []; //DATOS A MOSTRAR POR PAGINA
  totalItems = 0; // TOTAL DE ELEMENTOS

  ngOnInit(): void {
    this.updatePagedData();
  }

  // onPageChange(page: number): void {
  //   this.currentPage = page;
  //   this.updatePagedData();
  // }

  updatePagedData(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedData = this.dataSource.slice(startIndex, endIndex);
    this.totalItems = this.dataSource.length;
  }

  //---- INPUTS PARA TABLA ---- //
  @Input() set data(data: any) {
    this.dataSource = data;
    this.updatePagedData(); // ACTUALIZA LOS DATOS AL CAMBIAR LA FUENTE DE DATOS QUE RECIBE
  }

  @Input() set columns(columns: TableColumn[]) {
    this.tableColumns = columns;
    this.tableDisplayColumns = this.tableColumns.map((col) => col.def); // CREANDO NUEVO ARRAY A PARTIR DE SOLO LAS DEFINICIONES DE COLUMNAS
  }

  @Input() set btnUpdate(btnUpdate: boolean) {
    this.isBtnUpdate = btnUpdate;
  }

  @Input() set btnDelete(btnDelete: boolean) {
    this.isBtnDelete = btnDelete;
  }

  @Input() set thirdBtn(thirdBtn: boolean) {
    this.isThirdBtn = thirdBtn;
  }

  @Input() set titleThirdBtn(thirdBtn: string) {
    this.labelThirdBtn = thirdBtn;
  }

  //VARIABLES DE SALIDA PARA EL COMPONENTE PADRE
  @Output() updateClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() thirdBtnClicked: EventEmitter<any> = new EventEmitter<any>();

  // METODO PARA MANEJAR LOS CLICS DE LOS BOTONES Y EXPORTARLOS AL COMPONENTE PADRE
  handleButtonClick(action: string, rowId: any): void {
    if (action === 'update') {
      this.updateClicked.emit(rowId);
    } else if (action === 'delete') {
      this.deleteClicked.emit(rowId);
    } else if (action === 'thirdBtn') {
      this.thirdBtnClicked.emit(rowId);
    }
  }

  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.getTotalPages()) {
      this.currentPage = newPage;
      this.updatePagedData();
    }
  }

  getPages(): number[] {
    const totalPages = this.getTotalPages();
    return Array(totalPages)
      .fill(0)
      .map((x, i) => i);
  }

  getTotalPages(): number {
    return Math.ceil(this.dataSource.length / this.pageSize);
  }
}
