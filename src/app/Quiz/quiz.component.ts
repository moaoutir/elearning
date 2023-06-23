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
  tab_nombre_aleatoire = [];
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

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const myParam = params.get('id');
      this.course_service.getQuiz(myParam).subscribe(data=>{

        this.tab_nombre_aleatoire = this.getRandomNumbers();

        for (let i = 0; i < this.tab_nombre_aleatoire.length; i++) {
          this.list_questions.push(data.list_question[this.tab_nombre_aleatoire[i]]);
        }
        this.list_options=data.list_options;

        this.cmp = this.tab_nombre_aleatoire.length;

        this.nextQuestion();
      });
      this.id_course = parseInt(myParam); // pour la creation d'un certificat
    });
}

getRandomNumbers(): number[] {
  const tab_nombre: number[] = [];
  while (tab_nombre.length < 5) {
    // Math.random() => [0,1[ , Math.floor arrondit un nombre à l'entier inférieur le plus proche ex 4.8 => 4
    const randomNumber = Math.floor(Math.random() * 10);
    if (!tab_nombre.includes(randomNumber)) {
      tab_nombre.push(randomNumber);
    }
  }
  return tab_nombre;
}

private start() { // timer est initialise timer = duration ==> duration == 10
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
  clearInterval(this.intervalId); // arreter l'execution de l'intervalle 
  this.form.reset(); // pour enlever la valeur selectionne
  this.nextQuestion();
 }

  private nextQuestion(){
    if (this.cmp > 0) {
      this.question = this.list_questions[this.cmp-1];
      this.cmp--;
      this.start();
    }else{
      this.calculer_note_generale();
    }
  }
  // on ajoute cette fonction dans le cas si on clique sur suivant avant que les 10s passent
  functionStatus () {
    if (this.cmp == 0) {
      this.calculer_note_generale();
    }else {
      this.update_Time_and_Question();
    }
  }

  onChangeOption(response: string,event){
    console.log(event.value," response ",response);
    if (event.value === response) {
      console.log("true");
      this.score += 4;
    }
  }

  calculer_note_generale(){
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
