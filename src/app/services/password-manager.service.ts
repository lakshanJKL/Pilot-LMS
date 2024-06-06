import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class PasswordManagerService {
  key = "encrypt!135790";
  constructor() { }

  public encrypt(password: any): string {
    return CryptoJS.AES.encrypt(password, this.key).toString();
  }
  public decrypt(passwordToDecrypt: any) {
    return CryptoJS.AES.decrypt(passwordToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  }
}
