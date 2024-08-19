import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { DataService } from '../services/data.service';
import { firstValueFrom } from 'rxjs';


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
export class FormComponent {
  insertForm: FormGroup;

  constructor(private http: HttpClient) {
    this.insertForm = new FormGroup({
      text_field: new FormControl('', [Validators.required]),
      multi_line_text: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      telephone: new FormControl('', [Validators.pattern(/^\d{10}$/)]),
      number_field: new FormControl('', [Validators.required, Validators.min(1)]),
      date_field: new FormControl('', [Validators.required]),
      time_field: new FormControl('', [Validators.required]),
      timestamp_field: new FormControl('', [Validators.required]),
      checkbox_field: new FormControl(false),
      dropdown_field: new FormControl('', [Validators.required]),
      radio_list: new FormControl('', [Validators.required]),
      checkbox_list: new FormArray([], [Validators.required]),
      pdf_file: new FormControl('', [Validators.required]),
      image_file: new FormControl('', [Validators.required]),
      list_box: new FormArray([], [Validators.required]),
    });
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
    if (e.target.selected) {
      listBoxArray.push(new FormControl(e.target.value));
    } else {
      const index = listBoxArray.controls.findIndex(x => x.value === e.target.value);
      listBoxArray.removeAt(index);
    }
  }

  // Marked the method as 'async'
  async onSubmit() {
    if (this.insertForm.valid) {
      const formData = new FormData();

      for (const key in this.insertForm.value) {
        formData.append(key, this.insertForm.value[key]);
      }

      formData.append('pdf_file', this.insertForm.get('pdf_file')?.value);
      formData.append('image_file', this.insertForm.get('image_file')?.value);

      const token = localStorage.getItem('jwtToken');
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      try {
        const response = await firstValueFrom(this.http.post('/api/insert-data', formData, { headers }));
        console.log('Data inserted successfully:', response);
      } catch (error) {
        console.error('Error inserting data:', error);
      }
    } else {
      console.error('Form is invalid');
    }
  }

  // Marked the method as 'async'
  async onUpdate() {
    if (this.insertForm.valid) {
      const formData = new FormData();

      for (const key in this.insertForm.value) {
        formData.append(key, this.insertForm.value[key]);
      }

      formData.append('pdf_file', this.insertForm.get('pdf_file')?.value);
      formData.append('image_file', this.insertForm.get('image_file')?.value);

      const token = localStorage.getItem('jwtToken');
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      try {
        const response = await firstValueFrom(this.http.put('/api/update-data', formData, { headers }));
        console.log('Data updated successfully:', response);
      } catch (error) {
        console.error('Error updating data:', error);
      }
    } else {
      console.error('Form is invalid');
    }
  }
}
