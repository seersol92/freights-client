import { Component, TemplateRef, Pipe, PipeTransform, OnInit } from '@angular/core';
import { Load } from '../entites/load';
import { Discharge } from '../entites/discharge';
import { ShippingDetails } from '../entites/shipping-details';
import { Quote } from '../entites/quote';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {AbstractControl} from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-inquiry',
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.css']
})
export class InquiryComponent implements OnInit {
  public load: Load;
  public quote: Quote;
  public discharge: Discharge;
  public shipping: ShippingDetails;
  public quoteId: number;
  inquiryQuoteList = [];
  viewList = [];
  quoteDetailsKey: String = '';
  loadList = [];
  disChargeList = [];
  contentData = [];
  supplierList = [] ;
  receiverList = [] ;
  portList = [] ;
  loadTerminalList = [] ;
  disTerminalList = [] ;
  cargoGradeList = [] ;
  volumeList = ['BBLS', 'Gallons', 'Metric Tons', 'Cubic Meters'];
  loadingTolerance = ['5', '10', '15'];
  volumeTolerance = ['Buyer', 'Seller'];
  modalRef: BsModalRef;
  cargoFrom: FormGroup;
  isEditForm: Boolean = false;
  key: String = 'status';
  reverse: Boolean = false;
  modalTitleTxt: String = 'Create Inquiry';
  modalSaveBtnTxt: String = 'Save';
  messageClass: String = null;
  message: String = null;
  formProcessing: Boolean = false;
  summery: Boolean = true;
  selected: string;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private modalService: BsModalService
  ) {
  }

   async ngOnInit() {
   await this.auth.getProfile().subscribe(profile => {
        if (profile.user) {
         this.auth.loggedinName = profile.user.username ;
         this.auth.isAdmin = profile.user.is_admin;
        }
       });
     this.fetchList();
     this.getQuote();
     this.load = new Load();
     this.quote = new Quote();
     this.discharge = new Discharge();
     this.shipping = new ShippingDetails();
   }

  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  transform(value: string) {
     const datePipe = new DatePipe('en-US');
     value = datePipe.transform(value, 'yyyy-MM-dd');
     return value;
  }

  filterList (arr , key) {
    return arr.filter(function(item){
    return item.type === key;
    });
  }

  filterArray (arr , key) {
    const newArr = [];
    for ( let i = 0, l = arr.length; i < l; i++) {
      newArr[i] = arr[i].name;
    }
    return newArr;
  }

  async fetchList() {
    await this.auth.getRequest('/content', null ).subscribe(res => {
    if (!res.success) {
      this.formProcessing = false;
      this.messageClass = 'alert alert-danger';
      this.message = 'Something went wrong!!';
    } else {
      this.contentData = res.data;
    }
    setTimeout(() => {
      this.messageClass = '';
      this.message = '';
    }, 10000);
    });
  }
  addAnotherLoad() {
    this.loadList.push(this.load);
    this.load = new Load();
    console.log(this.loadList);
  }

  addAnotherDischarge() {
    this.disChargeList.push(this.discharge);
    this.discharge = new Discharge();
    console.log(this.disChargeList);
  }

  filterDataByType() {
    this.supplierList = this.filterList(this.contentData, 'supplier');
    this.receiverList = this.filterList(this.contentData, 'receiver');
    this.portList = this.filterList(this.contentData, 'port');
    this.loadTerminalList = this.filterList(this.contentData, 'load terminal');
    this.disTerminalList = this.filterList(this.contentData, 'discharge terminal');
    this.cargoGradeList = this.filterList(this.contentData, 'cargo grade');
 }


 createCargoModal(template) {
    this.filterDataByType();
    this.load = new Load();
    this.loadList = [];
    this.discharge = new Discharge();
    this.disChargeList = [];
    this.modalTitleTxt = 'Create Inquiry';
    this.modalSaveBtnTxt = 'Save';
    this.isEditForm = false;
    this.modalRef = this.modalService.show(template);
  }

  updateQuotePrice (index: number, template) {
    this.quoteId = this.inquiryQuoteList[index];
    if (this.quoteId) {
       this.quote.pricing = this.quoteId['pricing'];
       this.modalRef = this.modalService.show(template);
    }
  }

  onUpdatePrice () {
  const data = {
    'quote':      this.quoteId['_id'],
    'new_price':  this.quote.pricing
  };
  this.formProcessing = true;
  this.auth.postRequest('/inquiry-quote/update-price', data ).subscribe(res => {
  this.modalRef.hide();
  this.formProcessing = false;
   if (!res.success) {
    this.messageClass = 'alert alert-danger';
    this.message = res.message;
  } else {
    this.getQuote();
    this.messageClass = 'alert alert-success';
    this.message = res.message;
  }
  setTimeout(() => {
    this.messageClass = '';
    this.message = '';
  }, 10000);
  });
  }
  async getQuote() {
    await this.auth.getRequest('/inquiry-quote', null ).subscribe(res => {
    if (!res.success) {
      this.formProcessing = false;
      this.messageClass = 'alert alert-danger';
      this.message = 'Something went wrong!!';
    } else {
      this.inquiryQuoteList = res.data;
    }
    setTimeout(() => {
      this.messageClass = '';
      this.message = '';
    }, 10000);
    });
  }

  viewContent(index: number, key: string, template) {
    this.viewList = null;
    this.quoteId = this.inquiryQuoteList[index];
    if (this.quoteId) {
      this.quoteDetailsKey = key;
       this.viewList = this.inquiryQuoteList[index][key];
       this.modalRef = this.modalService.show(template);
    } else {
      // todo: no data found
      alert('No, Data Found!!');
    }
  }

  showSummery(template) {
    this.modalRef.hide();
    if (this.loadList.length === 0) {
      this.loadList.push(this.load);
    }
    if (this.disChargeList.length === 0) {
      this.disChargeList.push(this.discharge);
    }
    this.modalRef = this.modalService.show(template);
  }
  onSubmitQuote() {
    if (this.loadList.length === 0) {
      this.loadList.push(this.load);
    }
    if (this.disChargeList.length === 0) {
      this.disChargeList.push(this.discharge);
    }
    const data = {
      'load':       this.loadList,
      'discharge':  this.disChargeList,
      'shipping':   this.shipping,
      'quote':      this.quote,
      'added_by':   this.auth.loggedinName
    };
    this.formProcessing = true;
    this.auth.postRequest('/inquiry-quote/create', data ).subscribe(res => {
    this.modalRef.hide();
     if (!res.success) {
      this.formProcessing = false;
      this.messageClass = 'alert alert-danger';
      this.message = res.message;
    } else {
      this.getQuote();
      this.messageClass = 'alert alert-success';
      this.message = res.message;
    }
    setTimeout(() => {
      this.messageClass = '';
      this.message = '';
    }, 10000);
    });
  }

  removeDetailItems (index: number) {
    const id = this.viewList[index]['_id'];
    if (id) {
      if (confirm('Are you sure to delete this  ' + this.quoteDetailsKey + ' detail?') ) {
         this.auth.postRequest('/inquiry-quote/delete-detail', {
           sub_doc_id : id,
           quote_id: this.quoteId['_id'],
           key: this.quoteDetailsKey
          }).subscribe(res => {
          this.modalRef.hide();
           if (!res.success) {
             this.formProcessing = false;
             this.messageClass = 'alert alert-danger';
             this.message = res.message;
           } else {
             this.viewList.splice(index, 1);
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
  }
  removeQuote(index: number) {
    this.quoteId = this.inquiryQuoteList[index]['_id'];
     if (this.quoteId) {
       if (confirm('Are you sure to delete this Inquiry Quote?') ) {
          this.auth.postRequest('/inquiry-quote/delete', {quote_id: this.quoteId} ).subscribe(res => {
            if (!res.success) {
              this.formProcessing = false;
              this.messageClass = 'alert alert-danger';
              this.message = res.message;
            } else {
              this.inquiryQuoteList.splice(index, 1);
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
  }
}
