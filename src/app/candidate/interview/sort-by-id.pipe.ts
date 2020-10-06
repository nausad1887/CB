import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortById'
})
export class SortByIdPipe implements PipeTransform {
  transform(interview: Array<any>): any {
    if (interview !== undefined || interview !== null) {
      interview.sort((a, b) => a.interviewID - b.interviewID);
      return interview.reverse();
    }
    return interview;
  }
}
