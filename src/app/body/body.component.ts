import { Component,OnInit } from '@angular/core';
import { CourseService } from "../Course.service";

@Component({
  selector: 'body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit{
  nbrCours:number;
  nbrFormers:number;
  nbrStudents:number;
  constructor(private course_service:CourseService){}
  ngOnInit(): void {
    this.course_service.getCount().subscribe(data=>{
      console.log(data.cours[0].count);

      this.nbrCours = data.cours[0].count;
      this.nbrFormers = data.formers[0].count;
      this.nbrStudents = data.students[0].count;
    })

  }


}

