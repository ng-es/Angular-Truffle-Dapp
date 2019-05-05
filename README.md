#  Angular + Truffle = 💓 ÐAPPS
This  Trufflebox provides a base for Truffle Framework and Angular ÐAPP. and you can make transactions between accounts and scale you app with beautiful material design 


This  was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

1. Install truffle, Angular CLI and an Ethereum client. If you don't have a test environment 
  ```bash
  npm install -g truffle
  npm install -g @angular/cli
  npm install -g ganache-cli
  ```

2. Download the box.
  ```bash
  truffle unbox ng-es/angulartruffledapp
  ```

3. Run your Ethereum client. For Ganache CLI:
  ```bash
  ganache-cli
  ```
Note the mnemonic 12-word phrase printed on startup, you will need it later.

4. Compile and migrate your contracts.
  ```bash
  truffle compile && truffle migrate
  ```


* __Common errors and their solutions__

| Error | Solution |
|-------|----------|
| `Module not found: Error: Can't resolve '../../../../build/contracts/Payment.json'` during `ng serve` | Run `truffle compile` |
| `Error: the tx doesn't have the correct nonce.` in MetaMask | Reset MetaMask: Settings -> Reset Account |
| `Error getting balance; see log.` in UI, with `Error: MetaCoin has not been deployed to detected network (network/artifact mismatch)` in browser console | Ensure you have started ganache, run `truffle migrate` and configured MetaMask to point to ganache | `Error: i cannot see my account or balance` Ensure you are logged in metamask and refresh | If you have a custom rcp in ganache you can change the dir in `src/app/contract/contract.service.ts line21 with your dir `| `Error: [ethjs-rpc] rpc error with payload` in Metamask | You may need upadate Ganache and restart metamask because some old vesions give 0 gas and the transaction is mark as  underpriced |

