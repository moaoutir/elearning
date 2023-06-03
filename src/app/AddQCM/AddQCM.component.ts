import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { CourseService } from '../Course.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-root',
  templateUrl: './AddQCM.component.html',
  styleUrls: ['./AddQCM.component.css']
})
export class AddQCMComponent {
  cmp = 0;
  button = "next";
  constructor(public courseService: CourseService, private route: Router){}

  form : FormGroup = new FormGroup({
    question : new FormControl(null,{validators:[Validators.maxLength(30),Validators.required]}),
    answer : new FormControl(null,{validators:[Validators.required,Validators.maxLength(30)]}),
    option : new FormArray([
      new FormControl('',[Validators.maxLength(30),Validators.required]),
      new FormControl('',[Validators.maxLength(30),Validators.required]),
      new FormControl('',[Validators.maxLength(30),Validators.required]),
      new FormControl('',[Validators.maxLength(30),Validators.required])
    ])
  })
  public get option(){
    return this.form.get("option") as FormArray;
  }



  onOptionChange($event:Event){
    const val = $event.target as HTMLInputElement;
    const value = val.value;
    //console.log(this.form.value.option[value]);
    this.form.value.answer = this.form.value.option[value];
  }

  clickfunction(){
   // this.forma.value.option="option";
   /* if (this.forma.invalid) {
      console.log("invalid",this.forma.value.question,this.forma.value.option,this.forma.value.answer,"----",this.forma.invalid.valueOf());
      return;
    }*/
    this.cmp += 1;
    if (this.cmp==4) {
      this.button = "save";
    }
    if (this.cmp < 5) {
      //this.courseService.addQuetionQCM(this.form.value.question,this.form.value.option,this.form.value.answer);
      this.form.reset();
    }else{
      this.route.navigate(['/trainer']);
    }
  }
}
