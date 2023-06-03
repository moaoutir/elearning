import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'Header_Background',
  templateUrl: './HeaderBackground.component.html',
  styleUrls: ['./HeaderBackground.component.css']
})
export class HeaderBackgroundComponent implements OnInit{
  title = 'project';
  constructor(){}
  ngOnInit(): void {
  }
}
