import { Routes } from '@angular/router';
import { HomeComponent } from './Home/Home.component';
import { OrderComponent } from './Order/Order.component';


export const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'order', component: OrderComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
