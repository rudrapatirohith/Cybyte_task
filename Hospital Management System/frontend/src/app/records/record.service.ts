import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable,Signal, signal } from '@angular/core';
import { Observable, ObservedValueOf } from 'rxjs';
import { AuthService } from '../auth/auth.service';



interface Record {
  id?: number;
  user_id?: number;
  text_field: string;
  multi_line_text: string;
  email: string;
  telephone: string;
  number_field: number;
  date_field: string;
  time_field: string;
  timestamp_field: string;
  checkbox_field: boolean;
  dropdown_field: string;
  radio_list: string;
  checkbox_list: string[];
  pdf_file: string;
  image_file: string;
  list_box: string[];
  image_file_url?: string; // Marked as optional
  pdf_file_url?: string;   // Marked as optional
}

interface ApiResponse {
  data: Record[];
}


@Injectable({
  providedIn: 'root'
})
export class RecordService {

  private apiUrl  = 'http://localhost:4242/api/records';
  
  constructor(private http:HttpClient,private authService:AuthService)  {}


    getRecords(): Observable<ApiResponse>{
      const headers = new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)
      return this.http.get<ApiResponse>(`${this.apiUrl}`,{headers})
    }

    getRecordsById(recordId: number): Observable<{data: Record}>{
      const headers = new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)
      return this.http.get<{data:Record}>(`${this.apiUrl}/${recordId}`,{headers});
    }

    updateRecord(recordId: number, updatedData: any):Observable<void>{
      const headers = new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)
      return this.http.put<void>(`${this.apiUrl}/${recordId}`,updatedData,{headers});
    }

    deleteRecord(recordId: number): Observable<void>{
      const headers = new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)
      return this.http.delete<void>(`${this.apiUrl}/${recordId}`,{headers});
    }

}
