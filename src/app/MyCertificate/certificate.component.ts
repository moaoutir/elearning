import { Component ,OnInit} from '@angular/core';
import { CourseService } from "../Course.service";
import { Certificate } from "../Course.module";
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']

})
export class MyCertificateComponent implements OnInit{
  
  constructor(private course_service: CourseService,public sanitizer: DomSanitizer){}
  list_certificate: Certificate[]=[];


  ngOnInit(): void {
    this.course_service.getCertificates().subscribe(data => {
      this.list_certificate = data.certificates;
    });


  }
  showCertificate(certificate:any){
    window.open(certificate);
  }

}
