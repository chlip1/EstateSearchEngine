import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  sendAhpValues(data: any) {
    const apiUrl = 'http://localhost:3000/ahp';
    console.log(JSON.stringify(data))
    return this.http.post(apiUrl, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
  }
}

