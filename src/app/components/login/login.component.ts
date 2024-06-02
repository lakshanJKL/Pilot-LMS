import {Component, OnInit, Renderer2} from '@angular/core';
import {FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import {merge} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {emit} from "@angular-devkit/build-angular/src/tools/esbuild/angular/compilation/parallel-worker";
import {Router, RouterLink} from "@angular/router";
import {CookieManagementService} from "../../services/cookie-management.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password: any = new FormControl("", Validators.required);
  errorMessage = 'Please enter correct email';


  constructor(private render: Renderer2,
              private router: Router,
              private cookie: CookieManagementService
  ) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage = 'You must enter a value';
    } else if (this.email.hasError('email')) {
      this.errorMessage = 'Not a valid email';
    } else {
      this.errorMessage = '';
    }
  }

  login() {
    const userData = {
      userEmail: this.email.value,
      userPassword: this.password.value
    }
    this.cookie.createCookie("userData", JSON.stringify(userData));
    this.router.navigateByUrl("/dashboard").then();
  }

  ngOnInit(): void {
    if (this.cookie.isExistCookie("userData")) {
      this.router.navigateByUrl("/dashboard/home").then();
    }

    this.render.setStyle(document.body,
      'background-image',
      'url("https://www.jimsblog.in/wp-content/uploads/2021/04/Educational-Technology-and-Mobile-Learning.jpg")'
    );
    this.render.setStyle(document.body, 'opacity', '0.8');


  }


}
