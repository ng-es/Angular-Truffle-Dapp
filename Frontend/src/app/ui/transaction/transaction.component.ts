import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractService } from 'src/app/services/contract/contract.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  transactionForm: FormGroup;

  constructor( private fb: FormBuilder, private contract: ContractService ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.transactionForm = this.fb.group({
      direction: ['', Validators.required], 
      amount: [ '' , Validators.required]
    });

  }


  sendEth(){
    // this.contract.trasnferEther()
    
  }
}
