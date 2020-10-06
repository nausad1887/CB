import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'name'
})
export class NamePipe implements PipeTransform {
  transform(lists: Array<any>): any {
    if (lists !== null || lists !== undefined){
      lists.forEach((element: any) => {element.employeeName = element.employee[0].employeeName; });
      return lists;
    }
    return lists;
  }
}
