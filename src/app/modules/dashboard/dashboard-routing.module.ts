import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: "", redirectTo: "/dashboard/home/courses", pathMatch: "full"},
  {
    path: "home", loadComponent: () => import("./components/dashboard-home/dashboard-home.component")
      .then(e => e.DashboardHomeComponent), children: [
      {path: "", redirectTo: "/dashboard/home/courses", pathMatch: "full"},
      {
        path: "courses",
        loadComponent: () => import("./components/dashboard-home/inner/courses/courses.component")
          .then(e => e.CoursesComponent), children: [
          {path: "", redirectTo: "/dashboard/home/courses/all", pathMatch: "full"},
          {
            path: "all",
            loadComponent: () => import("./components/dashboard-home/inner/courses/all-courses/all-courses.component")
              .then(e => e.AllCoursesComponent)
          }
        ]
      },
      {
        path: "assignments",
        loadComponent: () => import("./components/dashboard-home/inner/assignments/assignments.component")
          .then(e => e.AssignmentsComponent), children: [
          {path: "", redirectTo: "/dashboard/home/assignments/all", pathMatch: "full"},
          {
            path: "all",
            loadComponent:
              () => import("./components/dashboard-home/inner/assignments/all-assignments/all-assignments.component")
                .then(e => e.AllAssignmentsComponent)
          }
        ]
      },
      {
        path: "users",
        loadComponent:
          () => import("./components/dashboard-home/inner/management/user-management/user-management.component")
            .then(e => e.UserManagementComponent), children: [
          {path: "", redirectTo: "/dashboard/home/users/all", pathMatch: "full"},
          {
            path: "all",
            loadComponent:
              () => import("./components/dashboard-home/inner/management/user-management/all-users/all-users.component")
                .then(e => e.AllUsersComponent)
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
