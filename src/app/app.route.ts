import { Routes } from '@angular/router';

export const rootRouterConfig: Routes = [
  {path: '', loadChildren: './ui/ui.module#UiModule'},
];

