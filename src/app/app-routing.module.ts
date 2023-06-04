import { NgModule } from '@angular/core';
import { RouterModule,Routes } from "@angular/router";
import { AddCoursComponent } from "./AddCours/AddCours.Component";
import { ListCourseComponent } from "./ListCourse/ListCourse.component";
import { AddQCMComponent } from "./AddQCM/AddQCM.component";
import { DisplayCourse } from "./Display_course/display.component";
import { MyCoursesComponent } from "./MyCourses/MyCourses.component";
import { MyLearnersComponent } from "./MyLearners/myLearners.component";
import { AddFormateurComponent } from "./AddFormateur/addformateur.component";
import { GetUserComponent } from "./Trainers/trainers.component";
import { ManageTrainerComponent } from "./ManageTraining/manageTrainer.component";
import { QuizComponent } from "./Quiz/quiz.component";
import { MyLearningComponent } from "./myLearning/myLearning.component";
import { MyCertificateComponent } from "./MyCertificate/certificate.component";
import { SignInComponent } from "./Login/Sign_in/Sign_in.component";
import { SignUpComponent } from "./Login/Sign_up/Sign_up.component";
import { BodyComponent } from "./body/body.component";
import { AuthGuard } from './Login/auth_guard';

const routes: Routes =[
  {path:'', component: BodyComponent },
  {path:'courses', component: ListCourseComponent },
  {path:'search/:name',component:ListCourseComponent},
  {path:'add_course' , component: AddCoursComponent, canActivate : [AuthGuard] },
  {path: 'QCM',component:AddQCMComponent, canActivate : [AuthGuard] },
  {path:'courses_created',component:ListCourseComponent, canActivate : [AuthGuard] },
  {path:'display/:id',component:DisplayCourse, canActivate : [AuthGuard] },
  {path:'MyCourses',component:MyCoursesComponent, canActivate : [AuthGuard] },
  {path:'add_former',component:AddFormateurComponent, canActivate : [AuthGuard] },
  {path:'get_trainers',component:GetUserComponent, canActivate : [AuthGuard] },
  {path:'get_students',component:MyLearnersComponent, canActivate : [AuthGuard] },
  {path:'manage_training',component:ManageTrainerComponent, canActivate : [AuthGuard] },
  {path:'quiz/:id',component:QuizComponent, canActivate : [AuthGuard] },
  {path:'MyLearning',component:MyLearningComponent, canActivate : [AuthGuard] },
  {path:'MyCertificate',component:MyCertificateComponent, canActivate : [AuthGuard] },
  {path:'Sign_in',component:SignInComponent},
  {path:'Sign_up',component:SignUpComponent},
  {path:'Course_create',component:MyCoursesComponent, canActivate : [AuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)],
  exports:[RouterModule],
  providers: [AuthGuard]

})
export class AppRoutingModule { }
