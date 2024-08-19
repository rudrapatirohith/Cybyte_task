import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:4242/api';

  constructor(private http: HttpClient) {}

  insertData(formData: FormData) {
    // const token = localStorage.getItem('JwtToken');
    // const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    // return firstValueFrom(this.http.post(`${this.apiUrl}/insert-data`, formData, { headers }));
  // }
  return firstValueFrom(this.http.post(`${this.apiUrl}/insert-data`, formData));
  }

  UpdateData(formData: FormData) {
    // const token = localStorage.getItem('JwtToken');
    // const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  //   return firstValueFrom(this.http.put(`${this.apiUrl}/update-data`, formData, { headers }));
  // }
  return firstValueFrom(this.http.put(`${this.apiUrl}/update-data`, formData));

}
}
