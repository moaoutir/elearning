import { Component, OnInit,OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../Course.service';
import { Router } from '@angular/router';
import { Course,Question,Domain,Module } from "../Course.module";
import { Subscription } from "rxjs";


@Component({
  selector: 'Add-Course',
  templateUrl: './AddCours.component.html',
  styleUrls: ['./AddCours.component.css'],
})
export class AddCoursComponent implements OnInit,OnDestroy {
  constructor(public course_service: CourseService, private route: Router) {}
  list_domians:Domain[]=[];
  domaine:Domain;
  domain_selected:string;
  list_domain_sub:Subscription = new Subscription();
  list_modules:Module[]=[];
  tab_question : Question[] = [];
  question : Question;
  imagepreview: string | ArrayBuffer | null;
  typeCourses = ['video', 'pdf'];
  tab_options:string[]=[];
  displayChapter = '';
  numberChap = [];
  cmp = 0;
  button = "suivant";
  form: FormGroup = new FormGroup({
    titre: new FormControl(null, {validators: [Validators.required, Validators.maxLength(30)],}),
    description: new FormControl(null, {validators: [Validators.required, Validators.maxLength(120)],}),
    prix: new FormControl(null, {validators: [Validators.required, Validators.maxLength(200)],}),
    filiere: new FormControl(null, { validators: [Validators.required] }),
    cours: new FormControl(null, { validators: [Validators.required] }),
    tp: new FormControl(null, { validators: [Validators.required] }),
    image : new FormControl(null,{validators:[Validators.required]}),
    question : new FormControl(null,{validators:[Validators.maxLength(180)]}),
    reponse : new FormControl(null,{validators:[Validators.required,Validators.maxLength(180)]}),
    option1: new FormControl(null,{validators:[Validators.required,Validators.maxLength(180)]}),
    option2: new FormControl(null,{validators:[Validators.required,Validators.maxLength(180)]}),
    option3: new FormControl(null,{validators:[Validators.required,Validators.maxLength(180)]}),
    option4: new FormControl(null,{validators:[Validators.required,Validators.maxLength(180)]})
  });

  ngOnInit(): void {
  this.course_service.getModuleAssignToFormer().subscribe(data=>{
    this.domaine = data.my_domain;
    this.list_modules = data.my_modules;
  })
  }

  onCourseChange(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ cours: file});
  }

  onTpChange(event: Event) {

    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ tp: file});
  }

  onImageChange(event: Event) {

    console.log("kkkkk");
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image:file});
  }

  public get option(){
    return this.form.get("option") as FormArray;
  }

  onOptionChange($event:Event){
    const val = $event.target as HTMLInputElement;
    const value = val.value;
    this.form.value.reponse = this.form.value.option[value];
    console.log(this.form.value.option[value] +"  "+this.form.value.reponse);
  }

  clickfunction(){

    console.log(this.form.value.domaine);

    if (this.form.value.question  === null  ) {
      return;
    }

    this.cmp += 1;

    if (this.cmp <= 10) {

      this.tab_options.push(this.form.value.option1);
      this.tab_options.push(this.form.value.option2);
      this.tab_options.push(this.form.value.option3);
      this.tab_options.push(this.form.value.option4);

      this.question = {id_question:null,_question:this.form.value.question,_options:this.tab_options,
        _response:this.form.value.reponse,_score:null,id_course:null}
        this.tab_question.push(this.question);
        console.log(this.question);
        this.tab_options = [];
        this.form.patchValue({question:null});

    }
    if(this.cmp == 10){
      this.course_service.AddCourse(this.form.value.titre,this.form.value.description,this.form.value.prix,
        this.domaine.name_domain,this.form.value.filiere,this.form.value.cours,this.form.value.tp,this.form.value.image).subscribe(data =>{
          for (let i = 0; i < this.tab_question.length; i++) {
            this.course_service.addQuetionQCM(this.tab_question[i]._question,this.tab_question[i]._options,
              this.tab_question[i]._response,data.id);
          }
        });
      this.route.navigate(['/Course_create']);
    }

  }
  ngOnDestroy(): void {

  }
}
