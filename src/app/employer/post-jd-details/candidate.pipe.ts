import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'candidate'
})
export class CandidatePipe implements PipeTransform {
  transform(interviewLists: Array<any>): any {
    if (interviewLists !== undefined || interviewLists !== null){
      interviewLists.map((data) => {
        data.employeeName = data.employee[0].employeeName;
      });
      return interviewLists;
    }
  }

}
