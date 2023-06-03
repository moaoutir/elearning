import { Component,OnInit } from '@angular/core';
import { loginService } from "./Login/login.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Education Center';
  constructor(private login_service :loginService){}
  ngOnInit(): void {
    this.login_service.AutoAuthUser();
  }
}
