import { Injectable } from '@angular/core';
import contract from 'truffle-contract';
import { MdcSnackbar } from '@angular-mdc/web';
import { Subject } from 'rxjs';

declare let require: any;
const Web3 = require('web3');
const tokenAbi = require('../../../../../Blockchain/build/contracts/Payment.json');
declare let window: any;

@Injectable({
  providedIn: 'root'
})

export class ContractService {
  private web3Provider: null;
  private contracts: {};
  public compatible: boolean;
  private accounts: string[];
  public accountsObservable = new Subject<string[]>();

  constructor(private snackbar: MdcSnackbar) {
    if (typeof window.web3 !== 'undefined') {
      this.web3Provider = window.web3.currentProvider;
      this.compatible = true;
    } else {
      console.log('Sorry you are not connect');
      Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
      this.web3Provider = new Web3.providers.HttpProvider('http://ropsten.infura.io/v3/ca2b12f732ef47fcb6b76223b39f8cf3');
      // Change to your own private key in infura.io
      this.compatible = false;
    }

    window.web3 = new Web3(this.web3Provider);
  }

  seeAccountInfo() {
    return new Promise((resolve, reject) => {
      window.web3.eth.getCoinbase((err, account) => {
          if (account === true) {
            console.log('dondt work' + account);
            return reject({name: 'account'});
          } else {
            window.web3.eth.getBalance(account, (error, balance) => {
              if (error === false) {
                return resolve({
                  originAccount: account,
                  balance: (window.web3.utils.fromWei(balance, 'ether'))
                });
              } else {
                console.log(balance);
                return reject({name: 'balance'});
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
        console.log(err , accs);
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
            return resolve({status: true});
          }
        }).catch((error) => {
          console.log(error);

          return reject('Error transfering Ether');
        });
    });
  }

  failure(message: string) {
    const snackbarRef = this.snackbar.open(message);
    snackbarRef.afterDismiss().subscribe(reason => {});
  }

  succes() {
    const snackbarRef = this.snackbar.open('Transaction complete successfuly');
    snackbarRef.afterDismiss().subscribe(reason => {});
  }
}
