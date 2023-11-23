import { Component } from '@angular/core';
import { Property } from './property.model';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent {
  currentIndex: number = 0;
  properties: any = [];

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private storageService: StorageService
    ) { }

  ngOnInit(): void {
    this.loadProperties();
  }
  
  nextProperty(): void {
    if (this.currentIndex < this.properties.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Jeśli chcesz wrócić do początku po ostatnim zdjęciu
    }
  }
  

  loadProperties(): void {
    const data = this.storageService.getAll()

    this.apiService.sendAhpValues(data).subscribe({
      next: (res) => {
        console.log(res)
        this.properties = res
        console.log(this.properties)
      },
      error: (error) => {
        console.error('Wystąpił błąd podczas wysyłania danych:', error);
      }
    });
  }
}
