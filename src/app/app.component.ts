import { Component } from '@angular/core';
import { ContractService } from './services/contract/contract.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  direccion: string;
  balance: string;
  destinoTransaccion: string;
  monto: string;
  exito: boolean;
  transaccionHecha: boolean;

  constructor(private contract: ContractService){
    contract.verInformacionCuenta().then((value: any) => {
      this.direccion = value.cuentaOrigen;
      this.balance = value.balance;
    });
  }

  transferirEther(e){
    this.contract.transferirEther(this.direccion, this.destinoTransaccion, this.monto).then((r) => {
      this.mostrarMensaje(true, 5000);
    }).catch((e) => {
      this.mostrarMensaje(false, 5000);
    });
  }

  mostrarMensaje(exito, duracion){
    this.transaccionHecha = true;
    this.exito = exito;
    setTimeout(() => {
        this.exito = !exito;
        this.transaccionHecha = false;
    }, duracion);
  }
}
