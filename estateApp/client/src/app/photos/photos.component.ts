import { Component } from '@angular/core';
import { Property } from './property.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent {
  currentIndex: number = 0;
  properties: Property[] = [];

  constructor(private http: HttpClient) { }

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
    this.http.get<Property[]>('assets/file.json').subscribe(data => {
      this.properties = data;
      console.log(this.properties)
    });
  }
}
