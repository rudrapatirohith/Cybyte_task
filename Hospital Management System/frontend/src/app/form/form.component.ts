import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { RecordService } from '../records/record.service';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'console';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule, // Importing CommonModule for built-in Angular directives
    ReactiveFormsModule, // Importing ReactiveFormsModule to support reactive forms
    HttpClientModule // Importing HttpClientModule for HTTP client functionality

  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})


export class FormComponent implements OnInit{
  insertForm: FormGroup;
  isEditMode = false;
  recordId: number | null = null;
  imageFileUrl: SafeUrl | null = null;
  pdfFileUrl: SafeUrl | null = null;


  // constructor(private http: HttpClient) {
  //   this.insertForm = new FormGroup({
  //     text_field: new FormControl('', [Validators.required]),
  //     multi_line_text: new FormControl(''),
  //     email: new FormControl('', [Validators.required, Validators.email]),
  //     telephone: new FormControl('', [Validators.pattern(/^\d{10}$/)]),
  //     number_field: new FormControl('', [Validators.required, Validators.min(1)]),
  //     date_field: new FormControl('', [Validators.required]),
  //     time_field: new FormControl('', [Validators.required]),
  //     timestamp_field: new FormControl('', [Validators.required]),
  //     checkbox_field: new FormControl(false),
  //     dropdown_field: new FormControl('', [Validators.required]),
  //     radio_list: new FormControl('', [Validators.required]),
  //     checkbox_list: new FormArray([], [Validators.required]),
  //     pdf_file: new FormControl('', [Validators.required]),
  //     image_file: new FormControl('', [Validators.required]),
  //     list_box: new FormArray([], [Validators.required]),
  //   });
  // }


  constructor(private http: HttpClient,private authService: AuthService, private recordService:RecordService,private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer) {
    this.insertForm = new FormGroup({
      text_field: new FormControl(''),
      multi_line_text: new FormControl(''),
      email: new FormControl(''),
      telephone: new FormControl(''),
      number_field: new FormControl(''),
      date_field: new FormControl(''),
      time_field: new FormControl(''),
      timestamp_field: new FormControl(''),
      checkbox_field: new FormControl(false),
      dropdown_field: new FormControl(''),
      radio_list: new FormControl(''),
      checkbox_list: new FormArray([]),
      pdf_file: new FormControl(''),
      image_file: new FormControl(''),
      list_box: new FormArray([]),
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // checking for id
    this.recordId = id ? parseInt(id, 10) : null; // if id exist we will convert to int
    if (this.recordId) {
      this.isEditMode = true;
      this.recordService.getRecordsById(this.recordId).subscribe({
        next: (response) => {
          const record = response.data[0];
          console.log(record);
  

          if(record.image_file){
            this.imageFileUrl = this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,${record.image_file}`);
          }


          if(record.pdf_file){
            this.pdfFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${record.pdf_file}`);
          }
          
          // Parse JSON fields if necessary
          if (typeof record.checkbox_list === 'string') {
            try {
              record.checkbox_list = JSON.parse(record.checkbox_list);
            } catch (e) {
              console.error('Failed to parse checkbox_list:', e);
              record.checkbox_list = [];
            }
          }
  
          if (typeof record.list_box === 'string') {
            try {
              record.list_box = JSON.parse(record.list_box);
            } catch (e) {
              console.error('Failed to parse list_box:', e);
              record.list_box = [];
            }
          }

          if(typeof record.date_field === 'string'){
            record.date_field = new Date(record.date_field).toISOString().split('T')[0];
          }

          if(typeof record.timestamp_field === 'string'){
            record.timestamp_field = new Date(record.timestamp_field).toISOString().slice(0,16);
          }
  
          // Patch the form with the record data
          this.insertForm.patchValue(record);
  
          // Populate checkbox and list box arrays if they exist
          if (Array.isArray(record.checkbox_list)) {
            const checkboxArray: FormArray = this.insertForm.get('checkbox_list') as FormArray;
            record.checkbox_list.forEach((value: string) => {
              checkboxArray.push(new FormControl(value));
            });
          }
  
          if (Array.isArray(record.list_box)) {
            const listBoxArray: FormArray = this.insertForm.get('list_box') as FormArray;
            record.list_box.forEach((value: string) => {
              listBoxArray.push(new FormControl(value));
            });
          }
        },
        error: (error: any) => {
          console.error('Error fetching record:', error);
        }
      });
    }
  }
  

  getFileUrl(filename: string): string {
    return `http://localhost:4242/api/file/${filename}`;
  }
  
  onCheckboxChange(e: any) {
    const checkboxArray: FormArray = this.insertForm.get('checkbox_list') as FormArray;
    if (e.target.checked) {
      checkboxArray.push(new FormControl(e.target.value));
    } else {
      const index = checkboxArray.controls.findIndex(x => x.value === e.target.value);
      checkboxArray.removeAt(index);
    }
  }

  onListBoxChange(e: any) {
    const listBoxArray: FormArray = this.insertForm.get('list_box') as FormArray;
    listBoxArray.clear();
    const options = e.target.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        listBoxArray.push(new FormControl(options[i].value));
      }
    }
  }

  onFileChange(event: any, controlName: string) {
    const file = event.target.files[0];
    this.insertForm.patchValue({
      [controlName]: file
    });
    this.insertForm.get(controlName)?.updateValueAndValidity();
  }

  async onSubmit() {
    if (this.insertForm.valid) {
      const formData = new FormData();

      for (const key in this.insertForm.controls) {
        const controlValue = this.insertForm.get(key)?.value;
        if (controlValue instanceof File) {
          formData.append(key, controlValue);
        }
        else if(Array.isArray(controlValue) || typeof controlValue === 'object'){
          formData.append(key, JSON.stringify(controlValue));
        } else {
          formData.append(key, controlValue);
        }
      }

      const token = this.authService.getToken();
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      try {
        if (this.isEditMode && this.recordId) {
          const response = await firstValueFrom(this.http.put(`http://localhost:4242/api/records/${this.recordId}`, formData, { headers }));
          console.log('Data updated successfully:', response);
        } else {
          const response = await firstValueFrom(this.http.post('http://localhost:4242/api/insert-data', formData, { headers }));
          console.log('Data inserted successfully:', response);
        }
        this.router.navigate(['/records']);
      } catch (error) {
        console.error('Error inserting data:', error);
      }
    } else {
      console.error('Form is invalid');
    }
  }
}