import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { loginService } from "../login.service";

@Component({
  selector: 'sign_up',
  templateUrl: './Sign_up.component.html',
  styleUrls: ['./Sign_up.component.css']
})
export class SignUpComponent {

  type_login: string = "student";
  constructor(private login_service:loginService){}
  form:FormGroup = new FormGroup({
    Lastname: new FormControl(null,{validators: [Validators.required,Validators.maxLength(30)]}),
    Firstname: new FormControl(null,{validators: [Validators.required,Validators.maxLength(30)]}),
    login: new FormControl(null,{validators: [Validators.required,Validators.maxLength(30)]}),
    email: new FormControl(null,{validators: [Validators.required,Validators.maxLength(30),Validators.email]}),
    password: new FormControl(null,{validators: [Validators.required,Validators.maxLength(30)]})
  })

  clickbutton(){
    if (this.form.invalid) {
      alert("remplissez tous les champs");
      return;
    }
    this.login_service.addNewLogin(this.form.value.login,this.form.value.email,this.form.value.password,this.form.value.Firstname,this.form.value.Lastname,this.type_login)
  }
}
