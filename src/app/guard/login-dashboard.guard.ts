import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {CookieManagementService} from "../services/cookie-management.service";

export const loginDashboardGuard: CanActivateFn =
  async (route, state) => {
    const router = inject(Router);
    const cookie = inject(CookieManagementService);
    try {
      const isToken = await cookie.isExistWithPromise("userData");
      if (isToken) {
        return true;
      } else {
        router.navigateByUrl("/login").then();
        return false;
      }
    } catch (err) {
      router.navigateByUrl("/login").then();
      return false;
    }

  };
