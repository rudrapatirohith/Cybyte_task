import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  styleUrls: ['./form.component.scss']
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


  constructor(private fb: FormBuilder,private http: HttpClient,private authService: AuthService, private recordService:RecordService,private router: Router, private route: ActivatedRoute) {
    // this.insertForm = new FormGroup({
    //   text_field: new FormControl(''),
    //   multi_line_text: new FormControl(''),
    //   email: new FormControl(''),
    //   telephone: new FormControl(''),
    //   number_field: new FormControl(''),
    //   date_field: new FormControl(''),
    //   time_field: new FormControl(''),
    //   timestamp_field: new FormControl(''),
    //   checkbox_field: new FormControl(false),
    //   dropdown_field: new FormControl(''),
    //   radio_list: new FormControl(''),
    //   checkbox_list: new FormArray([]),
    //   pdf_file: new FormControl(''),
    //   image_file: new FormControl(''),
    //   list_box: new FormArray([]),
    this.insertForm = this.fb.group({
      text_field: ['', Validators.required],
      multi_line_text: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      number_field: [null, Validators.required],
      date_field: ['', Validators.required],
      time_field: ['', Validators.required],
      timestamp_field: ['', Validators.required],
      checkbox_field: [false],
      dropdown_field: ['', Validators.required],
      radio_list: ['', Validators.required],
      checkbox_list: this.fb.array([]), // Initialize as FormArray for checkbox list
      list_box: this.fb.array([]), // Initialize as FormArray for list box selections
      pdf_file: [''],
      image_file: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // checking for id
    this.recordId = id ? parseInt(id, 10) : null; // if id exist we will convert to int
    if(this.recordId){
      this.isEditMode = true;
      this.loadRecord(this.recordId);
    }
  }


    loadRecord(recordId:number):void{
      this.recordService.getRecordsById(recordId).subscribe({
        next: (response) => {
          console.log(response);
          
          console.log('Response from server:', response);

          const record = response.data;
          console.log('Record data:',record);

           if (!record) {
                    console.error('Record is undefined or null.');
                    return;
                }

                // record.checkbox_field = record.checkbox_field === '1' || record.checkbox_field === true || record.checkbox_field === 'true';

          if(record.image_file){
            this.imageFileUrl = this.getFileUrl(record.image_file);
          }


          if(record.pdf_file){
            this.pdfFileUrl = this.getFileUrl(record.pdf_file);
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
  

      // Populate checkbox_list FormArray
      const checkboxArray: FormArray = this.insertForm.get('checkbox_list') as FormArray;
      // checkboxArray.clear();
      if (Array.isArray(record.checkbox_list)) {
        record.checkbox_list.forEach((value: string) => {
          checkboxArray.push(new FormControl(value));
        });
      }
  
        // Populate list_box FormArray
      const listBoxArray: FormArray = this.insertForm.get('list_box') as FormArray;
      // listBoxArray.clear();
      if (Array.isArray(record.list_box)) {
        record.list_box.forEach((value: string) => {
          listBoxArray.push(new FormControl(value));
        });
      }
        },
        error: (error: any) => {
          console.error('Error fetching record:', error);
        }
      });
    // }
  }
  

  getFileUrl(filename: string): string {
    return `http://localhost:4242/api/file/${filename}`;
  }
  
  onCheckboxChange(e: any) {
    const checkboxArray: FormArray = this.insertForm.get('checkbox_list') as FormArray;
    checkboxArray.clear();
    if (e.target.checked) {
      checkboxArray.push(new FormControl(e.target.value));
    } else {
      const index = checkboxArray.controls.findIndex(x => x.value === e.target.value);
      checkboxArray.removeAt(index);
    }
  //   this.insertForm.patchValue({
  //   checkbox_field: checkboxArray.length > 0 ? 1 : 0 // update checkbox_field if needed
  // });
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
        }
        else if(key === 'checkbox_feild'){
          formData.append(key, controlValue ? '1' : '0'); // Convert boolean to '1' or '0'
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