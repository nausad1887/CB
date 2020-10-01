import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'degreepipe'
})
export class DegreepipePipe implements PipeTransform {
  transform(degreeLists: Array<any>, checked?: Array<any>): any {
    if (checked.length > 0){
      degreeLists.forEach((degree) => {if (degree.checked){degree.checked = false; }});
      checked.forEach((degreeID) => {
      degreeLists.forEach((degree) => {if (degree.degreeID === degreeID){degree.checked = true; }}); });
      return degreeLists.sort((a, b) => a.degreeID - b.degreeID);
  }
    degreeLists.forEach((degree) => {if (degree.checked){degree.checked = false; }});
    return degreeLists.sort((a, b) => a.degreeID - b.degreeID);
  }
}
