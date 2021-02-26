import { Injectable } from '@angular/core';
import contract from 'truffle-contract';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

declare let require: any;
const Web3 = require('web3');
const tokenAbi = require('../../../../../Blockchain/build/contracts/Payment.json');
declare let window: any;

@Injectable({
  providedIn: 'root'
})

export class ContractService {
  private readonly web3Provider: null;
  private accounts: string[];
  public accountsObservable = new Subject<string[]>();
  public compatible: boolean;
  web3Modal;
  web3js;
  provider;

  constructor(private snackbar: MatSnackBar) {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "INFURA_ID" // required
        }
      }
    };

    this.web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
      theme: {
        background: "rgb(39, 49, 56)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(16, 26, 32)"
      }
    });
  }
  async connectAccount() {
    this.provider = await this.web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();
    return this.accounts;
    console.log(this.accounts);
  }

  seeAccountInfo() {
    return new Promise((resolve, reject) => {
      window.web3.eth.getCoinbase((err, account) => {
        if (account === true) {
          console.log('dont work' + account);
          return reject({ name: 'account' });
        } else {
          window.web3.eth.getBalance(account, (error, balance) => {
            if (error === null) {
              return resolve({
                originAccount: account,
                balance: (window.web3.utils.fromWei(balance, 'ether'))
              });
            } else {
              console.log(balance);
              return reject({ name: 'balance' });
            }
          });
        }
      });
    });
  }

  refreshAccounts() {

    window.web3.eth.getAccounts((err, accs) => {
      console.log('Refreshing accounts');
      if (err === true) {
        console.warn('There was an error fetching your accounts.');
        console.log(err, accs);
        return;
      }

      // Get the initial account balance so it can be displayed.
      if (accs.length === 0) {
        console.warn('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        return;
      }

      if (!this.accounts || this.accounts.length !== accs.length || this.accounts[0] !== accs[0]) {
        console.log('Observed new accounts');

        this.accountsObservable.next(accs);
        this.accounts = accs;
      }

      console.log('ready');
    });
  }

  trasnferEther(originAccount, destinyAccount, amount) {
    const that = this;

    return new Promise((resolve, reject) => {
      const paymentContract = contract(tokenAbi);
      paymentContract.setProvider(that.web3Provider);

      paymentContract.deployed().then((instance) => {
        return instance.nuevaTransaccion(
          destinyAccount,
          {
            from: originAccount,
            value: window.web3.utils.toWei(amount, 'ether')
          });
      }).then((status) => {
        if (status) {
          return resolve({ status: true });
        }
      }).catch((error) => {
        console.log(error);

        return reject('Error transferring Ether');
      });
    });
  }

  failure(message: string) {
    const snackbarRef = this.snackbar.open(message);
    snackbarRef.dismiss()
  }

  succes() {
    const snackbarRef = this.snackbar.open('Transaction complete successfully');
    snackbarRef.dismiss()
  }
}
