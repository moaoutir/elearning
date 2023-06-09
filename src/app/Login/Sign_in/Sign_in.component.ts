import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { loginService } from "../login.service";
import { Login } from "../login.module";
import { Router } from '@angular/router';

@Component({
  selector: 'sign_in',
  templateUrl: './Sign_in.component.html',
  styleUrls: ['./Sign_in.component.css']
})
export class SignInComponent {

  constructor(private login_service: loginService,private route: Router){}
  form:FormGroup = new FormGroup({
    login: new FormControl(null,{validators: [Validators.required,Validators.maxLength(30)]}),
    password: new FormControl(null,{validators: [Validators.required,Validators.maxLength(30)]})
  })

  clickbutton(){
    if (this.form.invalid) {
      alert("remplissez tous les champs");
      return;
    }
    this.login_service.LOGIN(this.form.value.login,this.form.value.password);

  }

}
