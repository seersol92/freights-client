import { Component, TemplateRef,  OnInit} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {AbstractControl} from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { User } from '../entites/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements  OnInit {
  public user: User;
  modalRef: BsModalRef;
  userModalTitle: String = 'Create New User';
  userModalBtn: String = 'Submit';
  userId: String = null;
  messageClass: String = null;
  message: String = null;
  isEditUser: Boolean = false;
  users: (any) = [];
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private modalService: BsModalService
  ) {
    this.getUsers();
   }

  ngOnInit() {
  }

  userModal (index: number, editUser: boolean, template) {
    this.user = new User();
    this.isEditUser = false; // when  creating new user
    if (editUser) {
      this.isEditUser = true;  // when updating existing user
      this.userModalTitle = 'Edit This User';
      this.userModalBtn = 'Update';
      this.user =  this.users[index];
    } else {
      this.userModalTitle = 'Create New User';
      this.userModalBtn = 'Submit';
    }
    this.modalRef = this.modalService.show(template);
  }
  getUsers() {
    this.auth.getRequest('/user', null ).subscribe(res => {
      this.users =  res.data;
    });
  }

  onUserSubmit () {
    const submitUrl = (this.isEditUser) ? 'update' : 'create';
    try {
      if (this.isEditUser) {
        this.userId = this.user['_id'];
      }
      this.auth.postRequest('/user/' + submitUrl, {
        user: this.user,
        userId: this.userId}).subscribe(res => {
        this.modalRef.hide();
        this.isEditUser = false;
        if (!res.success) {
            // this.formProcessing = false;
            this.messageClass = 'alert alert-danger';
            this.message = res.message;
        }else {
            this.messageClass = 'alert alert-success';
            this.message = res.message;
            setTimeout(() => {
              this.messageClass = '';
              this.message = '';
            }, 10000);
        }
      });
    }catch (e) {
      console.log('Error: Something went wrong!!');
    }
  }
  deleteUser(index: number) {
    try {
      const userId =  this.users[index]['_id'];
      if (userId !== '') {
        if (confirm('Are you sure to delete this User?') ) {
           this.auth.postRequest('/user/delete', {
             user : userId
            }).subscribe(res => {
             if (!res.success) {
               this.messageClass = 'alert alert-danger';
               this.message = res.message;
             } else {
               this.users.splice(index, 1);
               this.messageClass = 'alert alert-success';
               this.message = res.message;
             }
           setTimeout(() => {
             this.messageClass = '';
             this.message = '';
           }, 10000);
           });
        }
      }
    }catch (e) {
      console.log('Error: Something went wrong!!', e);
    }
  }

}
