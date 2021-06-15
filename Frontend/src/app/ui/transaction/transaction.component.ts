import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ContractService } from "src/app/services/contract/contract.service";

@Component({
  selector: "app-transaction",
  templateUrl: "./transaction.component.html",
  styleUrls: ["./transaction.component.scss"],
})
export class TransactionComponent implements OnInit {
  address: string;
  amount: string;
  direction: any;
  transactionForm: FormGroup;

  constructor(private fb: FormBuilder, private contract: ContractService) {
    this.transactionForm = new FormGroup({
        sendaddress: new FormControl("", [Validators.required]),
        amount: new FormControl("", [Validators.required]),
      });

    
    contract
      .connectAccount()
      .then((value: any) => {
        this.direction = value;
      })
      .catch((error: any) => {
        console.log(error);
        contract.failure(
          "Could't get the account data, please check if metamask is running correctly and refresh the page"
        );
      });
  }

  ngOnInit(): void {
    this.transactionForm.valueChanges.subscribe((x) => {
      console.log(x);
    });
  }

  sendEth(e) {
    this.address = this.transactionForm.value.sendaddress;
    this.amount = this.transactionForm.value.amount;

    this.contract
      .trasnferEther(this.direction, this.address, this.amount)
      .then((r) => {
        console.log(r);
        this.contract.succes();
      })
      .catch((e) => {
        console.log(e);
        this.contract.failure("Transaction failed");
      });
  }
}
