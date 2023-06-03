import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// ng add @angular/material
import {MatButtonModule} from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule,FormsModule  } from "@angular/forms";
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import { HttpClientModule,HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import {MatSelectModule} from '@angular/material/select';
import { MatTableModule } from "@angular/material/table";
import {MatChipsModule} from '@angular/material/chips';
import {MatListModule} from '@angular/material/list';
import {MatRadioModule} from '@angular/material/radio';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatDialogModule} from '@angular/material/dialog';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';


// pdf viewer
//import { PdfViewerModule } from "ng2-pdf-viewer";




//import { Ng2SearchPipeModule } from "ng2-search-filter";

import { AuthInterceptor } from "./Login/auth-interceptor";

import { AppComponent } from './app.component';
import { HeaderComponent } from "./header/header.component";
import { AddCourseComponent } from "./AjouterCours/AjouterCours.Component";
import { ListCourseComponent } from "./ListCourse/ListCourse.component";
import { AddQCMComponent } from "./AddQCM/AddQCM.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DisplayCourse } from "./Display_course/display.component";
import { MyLearnersComponent } from "./MyLearners/myLearners.component";
import { AddFormerComponent } from "./AddFormer/addformer.component";
import { GetUserComponent } from "./Trainers/trainers.component";
import { ManageTrainerComponent } from "./ManageTraining/manageTrainer.component";
import { QuizComponent } from "./Quiz/quiz.component";
import { MyLearningComponent } from "./myLearning/myLearning.component";
import { MyCertificateComponent } from "./MyCertificate/certificate.component";
import { SignInComponent } from "./Login/Sign_in/Sign_in.component";
import { SignUpComponent } from "./Login/Sign_up/Sign_up.component";
import { MyCoursesComponent } from "./MyCourses/MyCourses.component";
import { footerComponent } from "./Footer/footer.component";
import { HeaderBackgroundComponent } from "./HeaderBackground/HeaderBackground.component";
import { importType } from '@angular/compiler/src/output/output_ast';
import { PayControlComponent } from "./PayControl/PayControl.component";
import { BodyComponent } from "./body/body.component";
import { EmailComponent } from "./Email/email.component";

//Pipe

//import { FilterPipe } from './filter.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    AppComponent,
    AddCourseComponent,
    ListCourseComponent,
    AddQCMComponent,
    DisplayCourse,
    MyLearnersComponent,
    AddFormerComponent,
    GetUserComponent,
    ManageTrainerComponent,
    QuizComponent,
    MyLearningComponent,
    MyCertificateComponent,
    SignInComponent,
    SignUpComponent,
    MyCoursesComponent,
    footerComponent,
    HeaderBackgroundComponent,
    PayControlComponent,
    BodyComponent,
    EmailComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatSelectModule,
    AppRoutingModule,
    HttpClientModule,
    MatTableModule,
    MatChipsModule,
    MatListModule,
    MatRadioModule,
    MatAutocompleteModule,
    NgxPaginationModule,
    MatDialogModule,
    MatBottomSheetModule
  ],
  exports:[MatDialogModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
