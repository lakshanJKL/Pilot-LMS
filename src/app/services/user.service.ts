import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() {
  }

  // user
  user: any = {
    name: null,
    email: null,
    password: null,
    role: null
  }

// username & password

  globalUserEmail: any;
  globalUserRole: any;
}
