import {Routes} from '@angular/router';
import {DashboardRoutingModule} from "./modules/dashboard/dashboard-routing.module";
import {loginDashboardGuard} from "./guard/login-dashboard.guard";

export const routes: Routes = [
  {path: "", redirectTo: "/login", pathMatch: "full"},
  {
    path: "login", loadComponent: () => import("./components/login/login.component")
      .then(e => e.LoginComponent)
  },
  {
    path: "register", loadComponent: () => import("./components/register/register.component")
      .then(e => e.RegisterComponent)
  },
  {
    path: "dashboard", loadChildren: () => import("./modules/dashboard/dashboard-routing.module")
      .then(e => e.DashboardRoutingModule),canActivate:[loginDashboardGuard]
  }

];
