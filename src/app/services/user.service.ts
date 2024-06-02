import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

   user:any = {
     name:null,
     email:null,
     password:null,
     role:null
  }
}
