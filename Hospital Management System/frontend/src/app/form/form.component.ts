import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth/auth.service';


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


  constructor(private http: HttpClient,private authService: AuthService) {
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



  onCheckboxChange(e: any) {   // Handles the checkbox change event in my form
 
    const checkboxArray: FormArray = this.insertForm.get('checkbox_list') as FormArray;    // I'm grabbing the 'checkbox_list' FormArray from my form

    
    if (e.target.checked) {// If the checkbox is checked
      
      checkboxArray.push(new FormControl(e.target.value)); // pushing the checkbox value into the FormArray as a new FormControl
    } else {
      
      const index = checkboxArray.controls.findIndex(x => x.value === e.target.value); // If the checkbox is unchecked, finding the index of the FormControl that matches the value

     
      checkboxArray.removeAt(index);  // removing that FormControl from the FormArray
    }
  }


  onListBoxChange(e: any) {   // Handles the list box change event in my form
    
    const listBoxArray: FormArray = this.insertForm.get('list_box') as FormArray; // I'm grabbing the 'list_box' FormArray from my form

    listBoxArray.clear();
    const options = e.target.options;
    for(let i=0;i<options.length;i++){
      if(options[i].selected){
        listBoxArray.push(new FormControl(options[i].value));
      }
    }
  }

 
  onFileChange(event: any, controlName: string) {  // Handles the file input change event in my form

    const file = event.target.files[0];  // getting the first file from the file input (since I’m only allowing single file uploads)
   
    this.insertForm.patchValue({     // updating the form control with the selected file using patchValue
      [controlName]: file
    });

    
    this.insertForm.get(controlName)?.updateValueAndValidity(); //  to update the validity of the form control after setting the value
  }



  // Marked the method as 'async'
  async onSubmit() {
    if (this.insertForm.valid) {
      const formData = new FormData();


      for (const key in this.insertForm.controls) {
        const controlValue = this.insertForm.get(key)?.value;
        if (controlValue instanceof File) {
          formData.append(key, controlValue);
        } else {
          formData.append(key, JSON.stringify(controlValue));
        }
      }


      const token = this.authService.getToken();
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });



      try {
        const response = await firstValueFrom(this.http.post('http://localhost:4242/api/insert-data', formData,{headers}));

        console.log('Data inserted successfully:', response);
      } catch (error) {
        console.error('Error inserting data:', error);
      }
    } else {
      console.error('Form is invalid');
    }
  }

}


//   // Marked the method as 'async'
//   async onUpdate() {
//     if (this.insertForm.valid) {
//       const formData = new FormData();


//       for (const key in this.insertForm.controls) {
//         const controlValue = this.insertForm.get(key)?.value;
//         if (controlValue instanceof File) {
//           formData.append(key, controlValue);
//         } else {
//           formData.append(key, JSON.stringify(controlValue));
//         }
//       }
   

//       const token = this.authService
//       const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

//       try {
//         const response = await firstValueFrom(this.http.put('http://localhost:4242/api/update-data', formData));
//         console.log('Data updated successfully:', response);
//       } catch (error) {
//         console.error('Error updating data:', error);
//       }
//     } else {
//       console.error('Form is invalid');
//     }
//   }
// }
