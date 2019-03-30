import { contract } from 'truffle-contract';
import { Component, OnInit } from '@angular/core';
import { ContractService } from './../../services/contract/contract.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
type TransactionField = 'sendadress' | 'amount';
type FormErrors = {[u in TransactionField]: string};
@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  direction: string;
  adress: string;
  amount: string;
  balance: string;
  success: boolean;
  transactionDone: boolean;
  transactionForm: FormGroup;
  formErrors: FormErrors = {
    sendadress: '',
    amount: '',
  };
  validationMessages = {
   sendadress: {
   required: 'The send adress is required ',
   pattern: 'that´s no looks like a valid adress',
   minlength: 'a address must have much than 40 characters',

   },
   amount: {
     required: 'Need a amount to sent to address',
     pattern: 'Only support numbers',
   },
  };

// tslint:disable-next-line: no-shadowed-variable
  constructor(private frb: FormBuilder, private contract: ContractService) {
    contract.seeAccountInfo().then((value: any) => {
    this.direction = value.originAccount;
    this.balance = value.balance;
    });
  }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    this.transactionForm = this.frb.group({
      sendadress: ['', [
      Validators.required,
      Validators.minLength(42),
       ]],
      amount : ['', [
        Validators.required,
        Validators.pattern('(.[0-9])'),
     ]],
    });
    this.transactionForm.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.onValueChanged();
  }

  reset() {
  }

  transferEth(e) {
  this.adress = this.transactionForm.value.sendadress;
  this.amount = this.transactionForm.value.amount;

  this.contract.trasnferEther(this.direction, this.adress, this.amount).then((r) => {
    this.showMessage(true, 5000);
  }).catch((e) => {
    this.showMessage(false, 5000);
  });
  }

  showMessage(exito, duracion) {
    this.transactionDone = true;
    this.success = exito;
    setTimeout(() => {
        this.success = !exito;
        this.transactionDone = false;
    }, duracion);
  }

  onValueChanged(data?: any) {
    if (!this.transactionForm) { return; }
    const form = this.transactionForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field) && (field === 'sendadress' || field === 'amount')) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          if (control.errors) {
            for (const key in control.errors) {
              if (Object.prototype.hasOwnProperty.call(control.errors, key) ) {
                this.formErrors[field] += `${(messages as {[key: string]: string})[key]} `;
              }
            }
          }
        }
      }
    }
  }
}
