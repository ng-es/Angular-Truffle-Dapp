import { ContractService } from './../../services/contract/contract.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  direction: string;
  balance: string;
  constructor(private contract: ContractService) {
    contract.seeAccountInfo().then((value: any) => {
    this.direction = value.originAccount;
    this.balance = value.balance;
    });
  }

  ngOnInit() {
  }

}
