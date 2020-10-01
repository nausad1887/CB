import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'availableLists'
})
export class AvailableListsPipe implements PipeTransform {
  transform(availableList: Array<any>, checked?: Array<any>): any {
    if (checked.length > 0){
      availableList.forEach((available) => {if (available.checked){available.checked = false; }});
      checked.forEach((avialablefromID) => {
      availableList.forEach((available) => {if (available.avialablefromID === avialablefromID){available.checked = true; }}); });
      return availableList.sort((a, b) => a.avialablefromID - b.avialablefromID);
    }
    availableList.forEach((available) => {if (available.checked){available.checked = false; }});
    return availableList.sort((a, b) => a.avialablefromID - b.avialablefromID);
  }
}
