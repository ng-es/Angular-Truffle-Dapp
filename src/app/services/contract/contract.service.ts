import { Injectable } from '@angular/core';
import contract from 'truffle-contract';

declare let require: any;
const Web3 = require('web3');
const tokenAbi = require('../../../../build/contracts/Payment.json');

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private web3Provider: null;
  private contracts: {};

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      this.web3Provider = window.web3.currentProvider;
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    window.web3 = new Web3(this.web3Provider);
  }

  seeAccountInfo() {
    return new Promise((resolve, reject) => {
      window.web3.eth.getCoinbase((err, account) => {

        if (err === null) {
          window.web3.eth.getBalance(account, (error, balance) => {
            if (error === null) {
              return resolve({
                originAccount: account,
                balance: (window.web3.utils.fromWei(balance, 'ether'))
              });
            } else {
              return reject({originAccount: 'error', balance: 0});
            }
          });
        }
      });
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

          return reject('Error transfering Ether ');
        });
    });
  }
}
