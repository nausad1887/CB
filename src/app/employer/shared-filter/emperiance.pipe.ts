import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emperiance'
})
export class EmperiancePipe implements PipeTransform {
  transform(experianceLists: Array<any>, checked?: Array<any>): any {
    if (checked.length > 0){
        experianceLists.forEach((emperiance) => {if (emperiance.checked){emperiance.checked = false; }});
        checked.forEach((id) => {
        experianceLists.forEach((emperiance) => {if (emperiance.id === id){emperiance.checked = true; }}); });
        return experianceLists.sort((a, b) => a.id - b.id);
    }
    experianceLists.forEach((emperiance) => {if (emperiance.checked){emperiance.checked = false; }});
    return experianceLists.sort((a, b) => a.id - b.id);
  }
}
