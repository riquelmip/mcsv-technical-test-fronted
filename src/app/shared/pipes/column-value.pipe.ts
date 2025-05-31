import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TableColumn } from '../interfaces';

@Pipe({
  name: 'columnValue',
})
export class ColumnValuePipe implements PipeTransform {
  transform(row: any, column: TableColumn): unknown {
    let displayValue = row[column.dataKey];
    //VERIFICAR EL TIPO DE DATO QUE SERÁ EL VALUE DE LA COLUMNA
    switch (column.dataType) {
      case 'date':
        if (column.formatt !== undefined) {
          displayValue = new DatePipe('en').transform(
            displayValue,
            column.formatt
          );
        }
        break;
      case 'object':
        const arrayKeys = column.dataKey.split('.');
        let currentValue: any;

        arrayKeys.forEach((key) => {
          if (currentValue === undefined) {
            currentValue = row[key];
            return;
          }
          currentValue = currentValue[key];
        });

        displayValue = currentValue;
        break;

      case 'status':
        if (column.formatt !== undefined) {
          if (column.formatt === 'Activo/Inactivo') {
            displayValue = displayValue ? 'Activo' : 'Inactivo';
          }
        }
        break;

      case 'order-status':
        if (displayValue === 0) {
          displayValue = 'Pendiente';
        }
        if (displayValue === 1) {
          displayValue = 'En proceso';
        }
        if (displayValue === 2) {
          displayValue = 'Finalizada';
        }

        break;

      case 'line-status':
        if (displayValue === 0) {
          displayValue = 'Pendiente';
        }
        if (displayValue === 1) {
          displayValue = 'En producción';
        }
        if (displayValue === 2) {
          displayValue = 'Finalizada';
        }

        break;

      default:
        break;
    }
    return displayValue;
  }
}
