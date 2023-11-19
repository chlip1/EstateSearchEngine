import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  get(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  set(key: string, value: any): void {
    const item = JSON.stringify(value);
    localStorage.setItem(key, item);
  }

  getAll() {
    const data = {
      "lat": this.get("lat"),
      "lon": this.get("lon"),
      "maxDistance": this.get("maxDistance"),
      "minPrice": this.get("minPrice"),
      "maxPrice": this.get("maxPrice"),
      "minM2": this.get("minM2"),
      "maxM2": this.get("maxM2"),
      "places": this.get("places"),
      "ahpValues": this.get("ahpValues"),
    }
    return data
  }
}
