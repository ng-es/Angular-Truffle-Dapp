import { Component, HostListener, OnInit } from '@angular/core';
import { ContractService } from './../../services/contract/contract.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Identicon } from '../../services/identicon';
import { Md5 } from 'ts-md5/dist/md5';
@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  direction;
  resolution;
  accountImage;
  account;
  constructor(private contract: ContractService, private sanitizer: DomSanitizer) {
    contract.seeAccountInfo().then((value: any) => {
       this.direction = value.originAccount;
       this.resolution = window.innerWidth;
       this.account = this.direction.slice(0, 5);
       this.getImage();
        }).catch((error: any) => {
       contract.failure('Could\'t get the account data, please check if metamask is running correctly and refresh the page');
     });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resolution = window.innerWidth;
  }

  ngOnInit() {
    this.resolution = window.innerWidth;
  }

  getImage() {
    this.accountImage = this.sanitizer.bypassSecurityTrustResourceUrl( (
      'data:image/svg+xml; utf8,'
      + encodeURI(new Identicon( Md5.hashStr(this.direction), {size: 32, format: 'svg'} ).toString(true))
    ));
  }
}
