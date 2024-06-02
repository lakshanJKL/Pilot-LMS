import {Component, OnInit, Renderer2} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {MatRadioButton, MatRadioGroup, MatRadioModule} from "@angular/material/radio";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatRadioModule,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSuffix,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    MatRadioGroup,
    MatRadioButton
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  hide = true;

  form = new FormGroup({
    fullName: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required]),
    password:new FormControl("", [Validators.required])
  })

  constructor(private router: Router,
              private dataBase: AngularFirestore,
              private userService: UserService,
              private renderer: Renderer2
  ) {
  }

  register() {
    if (this.form.valid) {
      this.userService.user = {
        name: this.form.value.fullName,
        email: this.form.value.email,
        password:this.form.value.password,
        role: "Student",
      }

      this.dataBase.collection("users").add(this.userService.user).then(() => {
        this.router.navigateByUrl("/login").then();
      });

    } else {
      alert('Form is invalid');
    }
  }

  ngOnInit(): void {
    this.renderer.setStyle(document.body,
      'background-image',
      'url("https://www.jimsblog.in/wp-content/uploads/2021/04/Educational-Technology-and-Mobile-Learning.jpg")'
    );
    this.renderer.setStyle(document.body, 'opacity', '0.8');
  }
}
