import { Component, ChangeDetectorRef, ViewChild,OnInit,OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatTableDataSource,MatTable } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { ActivatedRoute,Router  } from "@angular/router";
import { CourseService } from "../Course.service";
import { Domain,Module } from "../Course.module";
import { Subscription } from 'rxjs';

@Component({
  selector: 'manage_trainer',
  templateUrl: './manageTrainer.component.html',
  styleUrls: ['./manageTrainer.component.css']
})
export class ManageTrainerComponent implements OnInit,OnDestroy{
  isDisabled = true;
  TotalDomain: number;
  form: FormGroup;
  id_module=null;
  name_module="Sélectionnez un domaine"
  displayedColumns: string[] = ['edit','name_domain'];
  dataSource : MatTableDataSource<any>;
  selection = new SelectionModel(true, []);
  list_domain:Domain[];
  list_module:Module[]=[];
  list_module_null:Module[]=[];
  list_domain_sub:Subscription = new Subscription();
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];


  constructor(private course_service: CourseService,private cdr: ChangeDetectorRef){
    this.form =  new FormGroup({
      domain: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(30)],})
    });

    this.dataSource= new MatTableDataSource(this.list_domain);
  }

  ngOnInit(): void {
    this.course_service.getDomains();
    this.list_domain_sub = this.course_service.getUpdateDomain().subscribe((data: Domain[]) =>{
      this.list_domain = data;
      this.TotalDomain = this.list_domain.length;
    });

  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value ).trim()||'') {
      this.list_module.push({_id:null,id_domain:this.id_module,name_module: value.trim()});
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(module: Module): void {
    const index = this.list_module.indexOf(module);
    if (index >= 0) {
      this.list_module.splice(index, 1);
    }
  }

  get_domain_id(name_module : string): string{
    let id;
    for (let i = 0; i < this.list_domain.length; i++) {
      if (this.list_domain[i].name_domain===name_module)
        id= this.list_domain[i].id;
    }
    return id;
  }

  DisplayModule(event: any){
    this.isDisabled = false;
    const module = event.name_domain;
    this.name_module = event.name_domain
    this.id_module = this.get_domain_id(module);
    this.course_service.getfilieres(this.id_module).subscribe(data=>{
      this.list_module=data.list_module;
    })
  }

  DeleteDomain(event: any){
    console.log(event.name_domain);

    const module = event.name_domain;
    const id = this.get_domain_id(module);
    this.course_service.deleteDomain(event.name_domain);
    this.list_module = [];
    this.name_module="Select a domain";
    this.isDisabled = true;
    }

  saveModule(){
    if (this.list_module.length == 0) {
      this.list_module_null.push({_id:null, id_domain:this.id_module, name_module:null})
      this.course_service.addModule(this.list_module_null);
      this.list_module_null=[];
    }else if(this.list_module[0].id_domain !== null){
      this.course_service.addModule(this.list_module);
    }
  }

  add_new_domain(){
    if (this.form.invalid) {
      alert("invalid");
      return;
    }
    this.course_service.addDomain(this.form.value.domain);
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.list_domain_sub.unsubscribe();
  }

}
