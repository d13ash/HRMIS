import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { DataService } from 'src/app/services/data.service';
import { DatePipe } from '@angular/common';
import { DataService } from '../../../services/data.service';

// DataService
@Component({
  selector: 'app-project-assign',
  templateUrl: './project-assign.component.html',
  styleUrls: ['./project-assign.component.scss']
})

export class ProjectAssignComponent  implements OnInit{

  workassignForm!: FormGroup

  data:any;
  submitted=false;
  constructor(private fb: FormBuilder, private ds: DataService, private datePipe:DatePipe ,private router:Router){}
  ngOnInit(): void {
    this.workassignForm  = this.fb.group({

      Emp_Document_Detail_Id: [null, Validators.required],
      Emp_Id: [null, Validators.required],
      Project_ID: [null, Validators.required],
      Dept_ID: [null, Validators.required],
      Work_Description: [null, Validators.required],
      Work_Assigned_Date: [null, Validators.required],
      Work_Target_Date: [null, Validators.required],
      Work_Allotment_Period: [null, Validators.required],
      Review_Date: [null, Validators.required],
      Additional_Work_Detail: [null, Validators.required],
      Work_Status: [null, Validators.required],
      Reviewer_Remark: [null, Validators.required],
      Review_By: [null, Validators.required],
    });
  }

  onSubmit() {

this.submitted=true;
if (this.workassignForm.valid){

    this.workassignForm.patchValue
    ({     
      Work_Assigned_Date : this.datePipe.transform(this.workassignForm.get("Work_Assigned_Date")?.value, "yyyy-MM-dd"), 
      Work_Target_Date : this.datePipe.transform(this.workassignForm.get("Work_Assigned_Date")?.value, "yyyy-MM-dd"), 
      Review_Date : this.datePipe.transform(this.workassignForm.get("Work_Assigned_Date")?.value, "yyyy-MM-dd"), 
});

      console.log();
      
    this.ds.postData('mp_work_assign', this.workassignForm.value).subscribe(res => {
      this.data = res;
      if (this.data)
        alert('Data Saved Succesfully');
        this.onClear();
        // this.router.navigate(['/hr/hrdashboard/project-assign'])
    });
   
  }
}
   onClear(){
    this.workassignForm.reset();
   }

}
