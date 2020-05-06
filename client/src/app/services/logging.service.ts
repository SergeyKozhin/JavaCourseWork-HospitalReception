import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor() { }

  log(value: any, ...rest: any[]) {
    console.log(value, rest);
  }

  error(value: any, ...rest: any[]) {
    console.error(value, rest);
  }

  warn(value: any, ...rest: any[]) {
    console.warn(value, rest);
  }

}
