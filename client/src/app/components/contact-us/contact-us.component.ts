import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
// import { DataService } from 'src/app/services/data.service';

// DataService
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit{

  data: any;

  ngOnInit(): void {
   this.Contact_form  = this.fb.group({

    C_Name: [null, Validators.required],
    C_Email: [null, Validators.required],
    C_Subject: [null, Validators.required],
    C_Message: [null, Validators.required],
  });
    
  }

  Contact_form!:FormGroup;

  constructor(private fb: FormBuilder, private ds: DataService) { }

  onSubmit(){

    console.log(this.Contact_form.value);
    this.ds.postData('dashboardContent/Contact',this.Contact_form.value).subscribe(res =>{
      this.data=res;
      if (this.data)
      {alert("Data Saved successfully")};
      this.onClear()
    });
  
    }
    onClear(){
      this.Contact_form.reset();
    }

}
