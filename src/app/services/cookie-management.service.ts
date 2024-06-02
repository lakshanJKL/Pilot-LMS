import {Injectable} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {promises} from "dns";

@Injectable({
    providedIn: 'root'
})
export class CookieManagementService {

    constructor(private cookies: CookieService) {
    }

    createCookie(name: any, value: any) {
        this.cookies.set(name, value, 1, "/");
    }

    isExistCookie(name: any): boolean {
        return this.cookies.check(name);
    }

    isExistWithPromise(name: any): Promise<boolean> {
        return new Promise((resolve, reject) => {

            try {
                const exist = this.isExistCookie(name);
                resolve(exist);

            } catch (err) {
                reject(err);
            }
        })
    }
deleteCookie(name:any){
      this.cookies.delete(name,"/");
}

}
