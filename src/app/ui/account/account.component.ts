import { ContractService } from './../../services/contract/contract.service';
import { Component, OnInit } from '@angular/core';
import { MdcSnackbar } from '@angular-mdc/web';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  direction: string;
  balance: string;

  constructor(private contract: ContractService, private snackbar: MdcSnackbar) {
    contract.seeAccountInfo().then((value: any) => {
      this.direction = value.originAccount;
      this.balance = value.balance;
    }).catch((error: any) => {
      contract.failure('Could\'t get the account data, please check if metamask is running correctly and refresh the page');
    });
  }

  ngOnInit() {}
}
