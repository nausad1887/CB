import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByDateTime'
})
export class SortByDateTimePipe implements PipeTransform {
  transform(interview: Array<any>): any {
    if (interview !== undefined || interview !== null){
      interview.sort((a, b) => {
        a.statusDate = new Date(a.interviewStatusDateTime);
        b.statusDate = new Date(b.interviewStatusDateTime);
        if (a.statusDate.getTime() < b.statusDate.getTime()) { return -1; }
        if (a.statusDate.getTime() > b.statusDate.getTime()) { return 1; }
        return 0;
      });
      return interview.reverse();
    }
    return interview;
  }
}
