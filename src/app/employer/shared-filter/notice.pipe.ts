import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notice'
})
export class NoticePipe implements PipeTransform {
  transform(noticeLists: Array<any>, checked?: Array<any>): any {
    if (checked.length > 0){
      noticeLists.forEach((notice) => {if (notice.checked){notice.checked = false; }});
      checked.forEach((noticeID) => {
      noticeLists.forEach((notice) => {if (notice.noticeID === noticeID){notice.checked = true; }}); });
      return noticeLists.sort((a, b) => a.noticeID - b.noticeID);
    }
    noticeLists.forEach((notice) => {if (notice.checked){notice.checked = false; }});
    return noticeLists.sort((a, b) => a.noticeID - b.noticeID);
  }
}
