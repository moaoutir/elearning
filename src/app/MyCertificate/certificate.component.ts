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
  link: SafeResourceUrl;

  constructor(private course_service: CourseService,public sanitizer: DomSanitizer){}
  displayedColumns: string[] = ['edit','_certificate'];
  dataSource = new MatTableDataSource();
  selection = new SelectionModel(true, []);
  list_certificate: Certificate[]=[];
  path="http://localhost:3000/images/certificate_c++_for_pacha_fromloo.pdf";


  ngOnInit(): void {
    this.course_service.getCertificates().subscribe(data => {
      console.log(data);
      this.path = 'http://localhost:3000/images/certificate_c++_for_pacha_fromloo.pdf'
      this.list_certificate = data.certificates;


    });


  }
  function(link:any){
    console.log("jjj");
    this.link = this.sanitizer.bypassSecurityTrustResourceUrl("http://localhost:3000/images/certificate_c++_for_pacha_fromloo.pdf#toolbar=0&navpanes=0&scrollbar=0");
  }
  showCertificate(certificate:any){
    console.log(certificate);

    window.open(certificate);
  }

}
