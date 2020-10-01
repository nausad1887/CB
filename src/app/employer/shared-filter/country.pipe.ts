import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'country'
})
export class CountryPipe implements PipeTransform {
  transform(countryLists: Array<any>, checked?: Array<any>): any {
    if (checked.length > 0){
      countryLists.forEach((country) => {if (country.checked){country.checked = false; }});
      checked.forEach((countryID) => {
      countryLists.forEach((country) => {if (country.countryID === countryID){country.checked = true; }}); });
      return countryLists.sort((a, b) => a.countryID - b.countryID);
    }
    countryLists.forEach((country) => {if (country.checked){country.checked = false; }});
    return countryLists.sort((a, b) => a.countryID - b.countryID);
  }
}
