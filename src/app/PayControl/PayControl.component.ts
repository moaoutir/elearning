import { Component,OnInit } from '@angular/core';
import { CourseService } from "../Course.service";
import { Router } from '@angular/router';

@Component({
  selector: 'pay-control',
  templateUrl: './PayControl.component.html',
  styleUrls: ['./PayControl.component.css']
})
export class PayControlComponent implements OnInit{
  phrase:string = "";
  url:string="";
  constructor(private course_service:CourseService, private router:Router){}
  ngOnInit(): void {
    console.log(this.router.url);

    if (this.router.url === "/courses") {
      this.phrase="Payez d'abord la moitié du prix du cours";
      this.url="courses";
    }else{
      this.phrase="Payer le solde restant du prix du cours";
      this.url="quiz";
    }
  }
  functionTOApply(){
    if (this.url ==="courses") {
      const id_course = this.course_service.getIdCourse();
      this.course_service.addToMyCourses(id_course);
    }else{
      const id_course_quiz = this.course_service.getIdCourse_quiz();
      this.router.navigate(['/quiz',id_course_quiz]);
    }

  }

}
