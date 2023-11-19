import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-ahp',
  templateUrl: './ahp.component.html',
  styleUrls: ['./ahp.component.css']
})
export class AhpComponent {
  headers = ['Lokalizacja', 'Cena', 'Metraż', 'Dostępność wybranych punktów'];
  loc_price: number = 0;
  loc_m2: number = 0;
  loc_access: number = 0
  price_m2: number = 0;
  price_access: number = 0;
  m2_access: number = 0;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private storageService: StorageService
  ){}

  onSubmit() {
    const ahpValues = {
      "loc_price" : this.loc_price,
      "loc_m2" : this.loc_m2,
      "loc_access" : this.loc_access,
      "price_m2" : this.price_m2,
      "price_access" : this.price_access,
      "m2_access" : this.m2_access
    }
    this.storageService.set("ahpValues", ahpValues)

    const data = this.storageService.getAll()

    this.apiService.sendAhpValues(data).subscribe({
      next: () => {
        this.router.navigate(['/photos']);
      },
      error: (error) => {
        console.error('Wystąpił błąd podczas wysyłania danych:', error);
      }
    });
  }
}
