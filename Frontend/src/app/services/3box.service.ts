import { Inject, Injectable } from '@angular/core';
import { WEB3 } from '../core/web3';
import { BoxOptions, GetProfileOptions, Threebox } from '../core/3box';
import Web3 from 'web3';
import * as ThreeboxFactory from '3box';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThreeBox {

  private Box = new BehaviorSubject<Threebox>(null);
  public box$ = this.Box.asObservable();

  constructor(@Inject(WEB3) private web3: Web3) {}

  public get box(): Threebox {
    return this.Box.getValue();
  }

  public set box(box: Threebox) {
    this.Box.next(box);
  }


  public getProfile(address: string, options?: GetProfileOptions): Promise<object> {
    if (!this.web3.utils.isAddress(address)) { throw new Error(`This is not a valid address: ${address}`); }
    return ThreeboxFactory.getProfile(address, options );
  }



  public getPublicProfile(address: string, options?: GetProfileOptions): Promise<object> {
    if (!this.web3.utils.isAddress(address)) { throw new Error(`This is not a valid address: ${address}`); }
    return ThreeboxFactory.box.public.get(address, options );
  }



}
