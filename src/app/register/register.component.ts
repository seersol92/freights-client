import { Component } from '@angular/core';
import {AbstractControl} from '@angular/forms';
import { matchOtherValidator } from './password-validation';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  regForm: FormGroup;
  messageClass;
  message;
  formProcessing = false;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router ) { // <--- inject FormBuilder
    this.createForm();
  }
  disableForm() {
      this.regForm.controls['firstname'].disable();
      this.regForm.controls['lastname'].disable();
      this.regForm.controls['username'].disable();
      this.regForm.controls['email'].disable();
      this.regForm.controls['password'].disable();
  }
  enableForm() {
    this.regForm.controls['firstname'].enable();
    this.regForm.controls['lastname'].enable();
    this.regForm.controls['username'].enable();
    this.regForm.controls['email'].enable();
    this.regForm.controls['password'].enable();
  }
  createForm() {
    this.regForm = this.fb.group({
      firstname: [null, Validators.compose(
                      [Validators.required,
                      Validators.minLength(3),
                      Validators.maxLength(20),
                      Validators.pattern('([a-zA-Z0-9]*$)')])
                ],
      lastname:  [null, Validators.compose([
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(20),
                        Validators.pattern('([a-zA-Z0-9]*$)')]
                      )],
      username:  [null, Validators.compose([
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(20),
                        Validators.pattern('([a-zA-Z0-9_]*$)')]),
                        this.checkUserName.bind(this)
                  ],
      email:     [null, Validators.compose([
                        Validators.required,
                        Validators.pattern(/^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/),
                        Validators.minLength(8), Validators.maxLength(30)]), this.checkEmail.bind(this)],
      password:  [null, Validators.compose([
                        Validators.required,
                        this.strongPassword,
                        Validators.minLength(8),
                        Validators.maxLength(30)])
                ],
      retype_password: [null, Validators.compose([
                              Validators.required,
                              matchOtherValidator('password')]
                      )]
    });
  }
  strongPassword(c: FormControl) {
    console.log(c.value);
    const regExp = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#)(\$%\^&\*])(?=.{8,})');
    return regExp.test(c.value) ? null : {'strongPassword': true }
  }
  /* @type: Asynchronous
   * Only hit the serve when name is valid do not access for every case :)
   * @Param: username
   * @return: boolean
   */
  checkUserName(c: FormControl): Promise<any> | Observable<any> {
    const username = c.value;
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
          this.auth.checkUserName(username).subscribe( data => {
            if (data.success){
              resolve({'checkUserName': true});
            }
              resolve(null);
          });
      }, 1500 );
    });
    return promise;
  }

  /* @type: Asynchronous
   * Only hit the serve when email is valid do not access for every case :)
   * @Param: email
   * @return: boolean
   */
  checkEmail(c: FormControl): Promise<any> | Observable<any> {
    const email = c.value;
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
          this.auth.checkEmail(email).subscribe( data => {
            if (data.success){
              resolve({'checkEmail': true});
            }
              resolve(null);
          });
      }, 1500 );
    });
    return promise;
  }
  onRegSubmit() {
    this.formProcessing = true;
    const user = {
        firstname: this.regForm.get('firstname').value,
        lastname: this.regForm.get('lastname').value,
        username: this.regForm.get('username').value,
        email: this.regForm.get('email').value,
        password: this.regForm.get('password').value,
        is_admin: true
      };
    this.auth.registerUser(user).subscribe(data => {
      if (!data.success){
          this.enableForm();
          this.formProcessing = false;
          this.messageClass = 'alert alert-danger';
          this.message = data.errorObj;
      }else {
          this.disableForm();
          this.messageClass = 'alert alert-success';
          this.message = 'Your Account Has Been Created :)';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
      }
    });
  }
}
