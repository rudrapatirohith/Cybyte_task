import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RecordService } from './record.service';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [CommonModule,HttpClientModule,RouterModule],
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})

export class RecordsComponent implements OnInit {
  records: any[]=[];

  constructor(private http:HttpClient,private router:Router, private recordsService:RecordService, private change:ChangeDetectorRef){}

  ngOnInit(): void {
      this.fetchRecords();
  }


  fetchRecords(): void {
this.recordsService.getRecords().subscribe({
  next: (response: {data: any[]})=>{
    console.log('Fetched records:',response.data);
    this.records = response.data;
  },
  error:(error: any)=>{
    console.error('Error fetching records:', error);
  }
});
}


getFileUrl(filename: string): string {
  return `http://localhost:4242/api/uploads/${filename}`;
}



editRecord(recordId: number): void {
  this.router.navigate(['/form', recordId]);
}


  deleteRecord(recordId: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.recordsService.deleteRecord(recordId).subscribe({
       next: () => {
          this.records = this.records.filter(record => record.id !== recordId);
        },
        error:(error : any) => {
          console.error('Error deleting record:', error);
        }
    });
    }
  }
}