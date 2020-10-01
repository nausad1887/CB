import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'skillpipe'
})
export class SkillpipePipe implements PipeTransform {
  transform(skillLists: Array<any>, checked?: Array<any>): any {
    if (checked.length > 0){
      skillLists.forEach((skill) => {if (skill.checked){skill.checked = false; }});
      checked.forEach((skillid) => {
      skillLists.forEach((skill) => {if (skill.skillID === skillid){skill.checked = true; }}); });
      return skillLists.sort((a, b) => a.skillID - b.skillID);
    }
    skillLists.forEach((skill) => {if (skill.checked){skill.checked = false; }});
    return skillLists.sort((a, b) => a.skillID - b.skillID);
  }
}
