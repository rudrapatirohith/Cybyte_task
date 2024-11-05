import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add the imported modules here
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'] // Fixed styleUrl to styleUrls
})
export class HomeComponent {
  selectedDbId: string = '';
  records: any;

  constructor(private http: HttpClient) {}

  fetchRecords() {
    if (this.selectedDbId) {
      this.http.get(`http://localhost:4242/api/home?id=${this.selectedDbId}`).subscribe(
        (response) => {
          this.records = response;
          console.log(response);
          
        },
        (error) => {
          console.error('Error fetching records:', error);
        }
      );
    } else {
      alert('Please select a database.');
    }
  }
}
