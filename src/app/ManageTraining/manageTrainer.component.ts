import { Component, ChangeDetectorRef, ViewChild,OnInit,OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatTableDataSource,MatTable } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { ActivatedRoute,Router  } from "@angular/router";
import { CourseService } from "../Course.service";
import { Domain,filiere } from "../Course.module";
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
  id_domaine=null;
  nom_domaine="Sélectionnez un domaine"
  displayedColumns: string[] = ['edit','name_domain'];
  dataSource : MatTableDataSource<any>;
  selection = new SelectionModel(true, []);
  list_domain:Domain[];
  lists_filieres:filiere[]=[];
  list_domain_sub:Subscription = new Subscription();
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];


  constructor(private course_service: CourseService,private cdr: ChangeDetectorRef){
    this.form =  new FormGroup({
      domain: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(30)]})
    });

    this.dataSource= new MatTableDataSource(this.list_domain);
  }


  ngOnInit(): void {
    // on recupere tous les domaines
    this.course_service.getDomains();
    this.list_domain_sub = this.course_service.getUpdateDomain().subscribe((data: Domain[]) =>{
      this.list_domain = data;
      this.TotalDomain = this.list_domain.length;
    });

  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value ).trim()) {
      this.lists_filieres.push({_id:null,id_domain:this.id_domaine,name_module: value.trim()});
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(module: filiere): void {
    const index = this.lists_filieres.indexOf(module);
    this.lists_filieres.splice(index, 1);
  }



  afficher_les_filieres(event: any){
    this.isDisabled = false;
    this.nom_domaine = event.name_domain;
    this.id_domaine = event.id;
    this.course_service.getfilieres(this.id_domaine).subscribe(data=>{
      this.lists_filieres=data.list_module;
    })
  }

  DeleteDomain(event: any){
    const domaine = event.name_domain;
    this.course_service.deleteDomain(domaine);
    this.lists_filieres = []; // pour vider le input ( la place pour ajouter un filiere )
    this.nom_domaine="Sélectionnez un domaine";
    this.isDisabled = true;
    }


    Sauvegarder(){
    if (this.lists_filieres.length == 0) {
      this.course_service.delete_all_filieres(this.id_domaine);
    }else if(this.lists_filieres[0].id_domain !== null){
      this.course_service.delete_all_filieres(this.id_domaine);
      this.course_service.add_filieres(this.lists_filieres);
    }
  }

  add_new_domain(){
    if (this.form.invalid) {
      alert("ajoutez un domaine");
      return;
    }
    this.course_service.addDomain(this.form.value.domain);
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.list_domain_sub.unsubscribe();
  }

}
