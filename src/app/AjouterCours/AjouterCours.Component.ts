import { Component, OnInit,OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../Course.service';
import { Router } from '@angular/router';
import { Course,Question,Domain,Module } from "../Course.module";
import { Subscription } from "rxjs";


@Component({
  selector: 'Add-Course',
  templateUrl: './AjouterCours.component.html',
  styleUrls: ['./AjouterCours.component.css'],
})
export class AddCourseComponent implements OnInit,OnDestroy {
  constructor(public course_service: CourseService, private route: Router) {}
  list_domians:Domain[]=[];
  domain:Domain;
  domain_selected:string;
  list_domain_sub:Subscription = new Subscription();
  list_modules:Module[]=[];
  tab_question : Question[] = [];
  question : Question;
  imagepreview: string | ArrayBuffer | null;
  typeCourses = ['video', 'pdf'];

  displayChapter = '';
  numberChap = [];
  cmp = 1;
  button = "next";
  form: FormGroup = new FormGroup({
    title: new FormControl(null, {validators: [Validators.required, Validators.maxLength(30)],}),
    description: new FormControl(null, {validators: [Validators.required, Validators.maxLength(120)],}),
    price: new FormControl(null, {validators: [Validators.required, Validators.maxLength(200)],}),
    domain: new FormControl(null, { validators: [Validators.required] }),
    module: new FormControl(null, { validators: [Validators.required] }),
    course: new FormControl(null, { validators: [Validators.required] }),
    tp: new FormControl(null, { validators: [Validators.required] }),
    image : new FormControl(null,{validators:[Validators.required]}),
    question : new FormControl(null,{validators:[Validators.maxLength(180),Validators.required]}),
    answer : new FormControl(null,{validators:[Validators.required,Validators.maxLength(180)]}),
    option : new FormArray([
      new FormControl('',[Validators.maxLength(180),Validators.required]),
      new FormControl('',[Validators.maxLength(180),Validators.required]),
      new FormControl('',[Validators.maxLength(180),Validators.required]),
      new FormControl('',[Validators.maxLength(180),Validators.required])
    ])
  });

  ngOnInit(): void {
  this.course_service.getModuleAssignToFormer().subscribe(data=>{
    console.log(data);
    this.domain = data.my_domain;
    this.list_modules = data.my_modules;
  })
  }

  onCheckSelectNumber(domain: string) {
    const number = domain;
    this.displayChapter = domain;
    console.log(this.displayChapter);
  }

  onCourseChange(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ course: file});
  }
  onTpChange(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ tp:file});
  }

  onImageChange(event: Event) {;
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image:file});
    const read = new FileReader();
    read.readAsDataURL(file);
    read.onload = ()=>{
      this.imagepreview = read.result;
    }
  }

  public get option(){
    return this.form.get("option") as FormArray;
  }



  onOptionChange($event:Event){
    const val = $event.target as HTMLInputElement;
    const value = val.value;

    this.form.value.answer = this.form.value.option[value];
    console.log(this.form.value.option[value] +"  "+this.form.value.answer);
  }

  clickfunction(){

    this.form.value.domain = this.domain.name_domain;
   // this.forma.value.option="option";
   /* if (this.forma.invalid) {
      console.log("invalid",this.forma.value.question,this.forma.value.option,this.forma.value.answer,"----",this.forma.invalid.valueOf());
      return;
    }*/

   /*  if (this.cmp==2) {
      this.button = "save";
    }*/


    if (this.cmp < 10) {
      this.question = {id_question:null,_question:this.form.value.question,_options:this.form.value.option,
        _response:this.form.value.answer,_score:null,id_course:null}
        this.tab_question.push(this.question);
        console.log(this.question);
        this.form.patchValue({question:null});
        this.form.patchValue({option:[null,null,null,null]});

    }else{
      console.log(this.tab_question);

      this.course_service.AddCourse(this.form.value.title,this.form.value.description,this.form.value.price,
        this.form.value.domain,this.form.value.module,this.form.value.course,this.form.value.tp,this.form.value.image).subscribe(data =>{
          for (let i = 0; i < this.tab_question.length; i++) {
            this.course_service.addQuetionQCM(this.tab_question[i]._question,this.tab_question[i]._options,
              this.tab_question[i]._response,data.id);
          }
        });
        //alert("pop");
      this.route.navigate(['/Course_create']);
    }
    this.cmp += 1;
  }
  ngOnDestroy(): void {

  }
}
