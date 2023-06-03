import { Component,OnInit } from '@angular/core';
import { loginService } from "../Login/login.service";
import { CourseService } from "../Course.service";
import { GetUserComponent } from "../Trainers/trainers.component";
import { MyLearnersComponent } from "../MyLearners/myLearners.component";
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit{
  //title = 'project';
  constructor(private login_service :loginService,private course_service :CourseService,private _bottomSheetRef: MatBottomSheetRef){}
  // openBottomSheet(): void {
  //   this._bottomSheet.open(GetUserComponent);
  //   this._bottomSheet.open(MyCoursesComponent);
  // }
  form: FormGroup = new FormGroup({
    subject: new FormControl(null, {validators: [Validators.required, Validators.maxLength(40)],}),
    text: new FormControl(null, {validators: [Validators.required, Validators.maxLength(120)],}),
  });
  ngOnInit(): void {
  }

  sendEmail(){
   /* if (this.form.invalid) {
      this._bottomSheetRef.dismiss();
      return;
    }*/
    const email_destinataire = this.course_service.getEmail();
    this.course_service.sendEmail(this.form.value.subject,this.form.value.text,email_destinataire)
    // pour fermer la boite
    this._bottomSheetRef.dismiss();
  }
}
