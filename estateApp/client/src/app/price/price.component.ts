import { Component } from '@angular/core';
import { StorageService } from '../storage.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css']
})
export class PriceComponent {
  minPrice: number = 0
  maxPrice: number = 0
  minM2: number = 0
  maxM2: number = 0
  
  constructor(
    private storageService: StorageService,
    private router: Router
  ){}

  onSubmit() {
    this.storageService.set("minPrice", this.minPrice)
    this.storageService.set("maxPrice", this.maxPrice)
    this.storageService.set("minM2", this.minM2)
    this.storageService.set("maxM2", this.maxM2)
    this.router.navigate(['/places'])
  }

}
