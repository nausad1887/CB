import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'citypipe'
})
export class CitypipePipe implements PipeTransform {
  transform(cityLists: Array<any>, checked?: Array<any>): any {
    if (checked.length > 0){
        cityLists.forEach((city) => {if (city.checked){city.checked = false; }});
        checked.forEach((cityID) => {
          cityLists.forEach((city) => {if (city.cityID === cityID){city.checked = true; }}); });
        return cityLists.sort((a, b) => a.cityID - b.cityID);
    }
    cityLists.forEach((city) => {if (city.checked){city.checked = false; }});
    return cityLists.sort((a, b) => a.cityID - b.cityID);
  }
}
