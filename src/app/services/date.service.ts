import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class DateService {
  constructor() { }
  get today(): string{
    const today = new Date();
    let dd: any = today.getDate();

    let mm: any = today.getMonth() + 1;
    const yyyy = '' + today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }
    return `${dd}-${mm}-${yyyy}`;
  }
  get now(){
    const today = new Date();
    const hh = today.getHours();
    const min = today.getMinutes();
    const sec = today.getSeconds();
    return `${hh}:${min}:${sec}`;
  }
}
