import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'language'
})
export class LanguagePipe implements PipeTransform {
  transform(languageLists: Array<any>, checked?: Array<any>): any {
    if (checked.length > 0){
        languageLists.forEach((language) => {if (language.checked){language.checked = false; }});
        checked.forEach((value) => {
        languageLists.forEach((language) => {if (language.value === value){language.checked = true; }}); });
        return languageLists.sort((a, b) => a.id - b.id);
    }
    languageLists.forEach((language) => {if (language.checked){language.checked = false; }});
    return languageLists.sort((a, b) => a.id - b.id);
  }
}
