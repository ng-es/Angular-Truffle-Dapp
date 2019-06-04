import { AppMaterialModule } from './app.material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { ContractService } from './services/contract/contract.service';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.route';
// UI
import { UiModule} from './ui/ui.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppMaterialModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),
    UiModule
  ],
  providers: [
    ContractService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
