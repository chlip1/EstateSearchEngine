import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotosComponent } from './photos/photos.component';
import { CheckboxesComponent } from './checkboxes/checkboxes.component';
import { MapComponent } from './map/map.component';
import { AhpComponent } from './ahp/ahp.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { PriceComponent } from './price/price.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'photos', component: PhotosComponent },
  { path: 'places', component: CheckboxesComponent },
  { path: 'price', component: PriceComponent },
  { path: 'map', component: MapComponent },
  { path: 'ahp', component: AhpComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
