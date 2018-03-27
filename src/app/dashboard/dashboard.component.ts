import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {AbstractControl} from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  modalRef: BsModalRef;
  addContentForm: FormGroup;
  messageClass: String = null;
  message: String = null;
  newContentType: String = '';
  modalTemplateName = 'newContent';
  supplierList: any[] = [] ;
  receiverList: any[] = [] ;
  portList: any[] = [] ;
  loadTerminalList: any[] = [] ;
  disTerminalList: any[] = [] ;
  cargoGradeList: any[] = [] ;
  formProcessing: Boolean = false;
  isAdmin: Boolean = false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private modalService: BsModalService
  ) {
    // this.isAdmin =  this.auth.isAdmin;
    this.createForm();
    this.fetchList();
    this.auth.getProfile().subscribe(profile => {
      if (profile.user) {
        if (profile.user.is_admin) {
          this.isAdmin = true;
        }
      }
    });

  }
  ngOnInit() {
  }

  createForm() {
    this.addContentForm = this.fb.group({
      name: [null, Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20)
          ])
      ]
    });
  }

  getFormData() {
    const data = {
        name: this.addContentForm.get('name').value,
        type: this.newContentType,
        addedby: this.auth.loggedinName
    };
    return data;
  }

  filterList (arr , key) {
    return arr.filter(function(item){
     return item.type === key;
  });
  }

  fetchList() {
    this.auth.getRequest('/content', null ).subscribe(res => {
      if (!res.success) {
        this.formProcessing = false;
        this.messageClass = 'alert alert-danger';
        this.message = 'Something went wrong!!';
    } else {
      this.supplierList = this.filterList(res.data, 'supplier');
      this.receiverList = this.filterList(res.data, 'receiver');
      this.portList = this.filterList(res.data, 'port');
      this.loadTerminalList = this.filterList(res.data, 'load terminal');
      this.disTerminalList = this.filterList(res.data, 'discharge terminal');
      this.cargoGradeList = this.filterList(res.data, 'cargo grade');
    }
    setTimeout(() => {
      this.messageClass = '';
      this.message = '';
    }, 10000);
    });
  }

  create() {
    this.formProcessing = true;
    this.auth.postRequest('/content/create', this.getFormData() ).subscribe(res => {
      this.modalRef.hide();
      this.formProcessing = false;
      if (!res.success) {
          this.messageClass = 'alert alert-danger';
          this.message = 'Something went wrong!!';
      }else {
          this.fetchList();
          this.messageClass = 'alert alert-success';
          this.message = 'New ' + this.getFormData().type + ' Has Been Created :)';
      }
      setTimeout(() => {
        this.messageClass = '';
        this.message = '';
      }, 10000);
    });
  }

  addContentModal(template, contentName) {
    this.newContentType = contentName;
    this.addContentForm.setValue({name: null});
    this.modalRef = this.modalService.show(template);
  }
}
