import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { StorageService } from '../storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  options: L.MapOptions;
  map!: L.Map;
  currentMarker?: L.Marker;

  lat: string = '';
  lon: string = '';

  maxDistance: number = 0

  constructor(
    private router: Router,
    private storageService: StorageService,
  ) {
    this.options = {
      center: L.latLng(54.3721, 18.6384), 
      zoom: 13,
      layers: [L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '...' })]
    };
  }

  onMapClick(e: any) {
    if (this.currentMarker) {
      this.currentMarker.remove();
    }
    this.currentMarker = L.marker(e.latlng).addTo(this.map);
    this.lat = e.latlng.lat;
    this.lon = e.latlng.lng; 
    this.storageService.set("lat", this.lat)
    this.storageService.set("lon", this.lon)
  }

  onMapReady(map: L.Map) {
    this.map = map;
    
    const defaultIcon = L.icon({
      iconUrl: '/assets/marker-icon.png',
      shadowUrl: '/assets/marker-shadow.png',
      iconSize: [25, 41], 
      shadowSize: [41, 41],
      iconAnchor: [12, 41],
      shadowAnchor: [12, 41],
      popupAnchor: [0, -41]
    });

    L.Marker.prototype.options.icon = defaultIcon;
  }

  onSubmit() {
    this.storageService.set("maxDistance", this.maxDistance)
    this.router.navigate(['/price'])
  }
}
