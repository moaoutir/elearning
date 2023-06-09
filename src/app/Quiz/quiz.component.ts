import { Component ,OnInit,OnDestroy} from '@angular/core';
import { ActivatedRoute,Router  } from "@angular/router";
import { CourseService } from "../Course.service";
import { Question } from "../Course.module";
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import {HttpHeaders} from  "@angular/common/http";

//ng generate directive BlockOnload


@Component({
  selector: 'quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit,OnDestroy{
  // on affiche une seule quetion donc on aura pas besoin d'un tableau par contre les options on va garder le meme tableau
  question: Question;
  list_questions: Question[]=[];
  list_options: string[]= [];
  score: number = 0;
  number_questions = 5;
  tab_number = [];
  existNumber:boolean = false;
  cmp:number;
  intervalId: number | undefined;
  duration: number = 10 ; // Durée en secondes
  timer:number = this.duration;
  id_course: number;
  constructor(private route: ActivatedRoute,private course_service:CourseService,private router: Router){}
  form: FormGroup = new FormGroup({
    title: new FormControl(null, {
      validators: [Validators.required, Validators.maxLength(30)]})
    })

  random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getRandomNumbers(): number[] {
    const numbers: number[] = [];
    while (numbers.length < 5) {
      const randomNumber = this.random(0,9)
      if (!numbers.includes(randomNumber)) {
        numbers.push(randomNumber);
      }
    }
    return numbers;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const myParam = params.get('id');
      this.course_service.getQuiz(myParam).subscribe(data=>{
        this.tab_number = this.getRandomNumbers();
        console.log(this.tab_number.length);
        for (let i = 0; i < this.tab_number.length; i++) {
          this.list_questions.push(data.list_question[this.tab_number[i]]);
        }
        this.list_options=data.list_options;
        this.question = this.list_questions[0]; // on choisie une seule question
        this.cmp = this.list_questions.length;
        this.nextQuestion();
      });
      this.id_course = parseInt(myParam);
    });
}

private start() {
  this.intervalId = window.setInterval(() => {
    if (this.timer == 0) {
      this.update_Time_and_Question()
    }else {
      this.timer--;
    }
  }, 1000);
}

 private update_Time_and_Question() {
  this.timer = this.duration;
  clearInterval(this.intervalId);
  this.nextQuestion();
  this.form.reset();
 }

  private nextQuestion(){
    if (this.cmp > 0) {
      this.start();
      this.question = this.list_questions[this.cmp-1];
    }else{
      this.functionStatus();
    }
    this.cmp--;
  }

  onChangeOption(response: string,event){
    console.log(event.value," response ",response);
    if (event.value === response) {
      console.log("true");
      this.score += 4;
    }
  }

  functionStatus () {
    if (this.cmp <= 0) {
      this.correct_the_answers();
    }else {
      this.update_Time_and_Question();
    }
  }

  correct_the_answers(){
    if (this.score>=15) {
      alert("Félicitations! vous avez reussi votre score est: "+this.score)
      const score = this.score;
      this.course_service.getCourse(this.id_course).subscribe(data =>{
      this.course_service.CreateCertificate(data.course._titleCours,data.course._creator,score,data.course._id).subscribe((file) => {
      });
      this.router.navigate(['/MyCertificate']);
    })
    }else{
      alert("Malheureusement vous avez échoué, votre score est :"+this.score)
      this.router.navigate(['/MyLearning']);

    }
    //this.score = 0;
  }
  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
