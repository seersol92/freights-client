import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpModule } from '@angular/http';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './services/auth.service';
import { LoggedInService } from './services/logged-in.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import {ModalModule} from 'ngx-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { InquiryComponent } from './inquiry/inquiry.component';
import { TypeaheadModule  } from 'ngx-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserComponent } from './user/user.component';
import { CountdownTimerModule } from 'ngx-countdown-timer';
import { TimerPipe } from './_pipe/timer.pipe';


const APP_ROUTES: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'inquiry-list',
    component: InquiryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user-management',
    component: UserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ProfileComponent,
    InquiryComponent,
    UserComponent,
    TimerPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    OrderModule,
    Ng2SearchPipeModule,
    FlashMessagesModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(APP_ROUTES),
    ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
    CountdownTimerModule.forRoot()

  ],
  providers: [AuthService, AuthGuard, NotAuthGuard, LoggedInService],
  bootstrap: [AppComponent],
  exports: [ RouterModule ],

})
export class AppModule { }
