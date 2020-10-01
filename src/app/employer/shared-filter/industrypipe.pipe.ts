import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'industrypipe'
})
export class IndustrypipePipe implements PipeTransform {
  transform(industriesLists: Array<any>, checked?: Array<any>): any {
    if (checked.length > 0){
      industriesLists.forEach((industry) => {if (industry.checked){industry.checked = false; }});
      checked.forEach((industryID) => {
      industriesLists.forEach((industry) => {if (industry.industryID === industryID){industry.checked = true; }}); });
      industriesLists.filter(industry => industry.industryName !== '');
      return industriesLists.sort((a, b) => a.industryID - b.industryID);
     }
    industriesLists.forEach((industry) => {if (industry.checked){industry.checked = false; }});
    industriesLists.filter(industry => industry.industryName !== '');
    return industriesLists.sort((a, b) => a.industryID - b.industryID);
  }
}
