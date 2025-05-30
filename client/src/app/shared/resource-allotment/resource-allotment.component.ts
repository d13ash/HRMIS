import { Component,ViewChild,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { DataService } from 'src/app/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { DataService } from '../../services/data.service';
import Swal from 'sweetalert2';

// DataService
@Component({
  selector: 'app-resource-allotment',
  templateUrl: './resource-allotment.component.html',
  styleUrls: ['./resource-allotment.component.scss']
})
export class ResourceAllotmentComponent implements OnInit {

  displayedColumns=['ID','Emp_name','Item Name','Project Name','Allotment Date','Action'];
  dataSource!: MatTableDataSource<any>;

   @ViewChild(MatPaginator) paginator!: MatPaginator ;
   @ViewChild(MatSort) MatSort!: MatSort ;

  Resource_Allotment_Form!: FormGroup;
  resource_name:any;
  employee_name:any;
  project_name:any;
  selectedResource: any;
  data: any;
  allResource_Allotment_Details:any 
allprojectResourceDetail:any;
resources_1:any;
project:any;
editproject: any;
isEditMode: boolean = false;
update1: any;
  

  ngOnInit(): void {
    this.Resource_Allotment_Form = this.fb.group({
      Emp_Id:[null,Validators.required],
      item_id:[null,Validators.required],
      Project_ID:['',Validators.required],
      allotment_date:['',Validators.required],
      allotment_date_end:['',Validators.required]
      
    });
   this.getresource_name(),
   this.getemployee_name(),
   this.getproject_name(),
   this.getTable()

     }
  constructor(private fb:FormBuilder, private ds : DataService, private datepipe: DatePipe){}
  onClear(){

    this.Resource_Allotment_Form.reset();
  }

// get budget_resource_name 
getresource_name(){
  this.ds.getData('employee_resource_allotment/get_resource_name').subscribe((result)=>{
    console.log(result);  
    this.resource_name = result;
  })
}
// get getemployee_name()
getemployee_name(){
  this.ds.getData('employee_resource_allotment/get_employee_name').subscribe((result)=>{
    console.log(result);  
    this.employee_name = result;
  })
}
// getproject name 
getproject_name(){
  this.ds.getData('employee_resource_allotment/get_project_name').subscribe((result)=>{
    console.log(result);  
    this.project_name = result;
  })
}

// post the data ....
onSubmit() {
  // Check if the form is invalid
  if (this.Resource_Allotment_Form.invalid) {
    // Mark all controls as touched to trigger validation messages
    this.Resource_Allotment_Form.markAllAsTouched();

    // Display validation error alert
    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: 'Please fill all required fields correctly.',
    });
    return;
  }

  // Format the allotment_date and allotment_date_end fields
  this.Resource_Allotment_Form.patchValue({
    allotment_date: this.datepipe.transform(this.Resource_Allotment_Form.get("allotment_date")?.value, "yyyy-MM-dd"),
    allotment_date_end: this.datepipe.transform(this.Resource_Allotment_Form.get("allotment_date_end")?.value, "yyyy-MM-dd"),
  });

  console.log(this.Resource_Allotment_Form.value);

  // Submit the form data
  this.ds.postData('employee_resource_allotment/post_resource_allotment', this.Resource_Allotment_Form.value).subscribe(
    res => {
      this.data = res;
      if (this.data) {
        // Display success alert
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Data saved successfully.',
        }).then(() => {
          // Refresh the table or perform any other necessary actions
          this.getTable();
          this.onClear(); // Clear the form
        });
      }
    },
    error => {
      // Display error alert for data saving failure
      Swal.fire({
        icon: 'error',
        title: 'Submission Error',
        text: 'Failed to save data. Please try again later.',
      });
    }
  );
}




//edit of BudgetForm
onedit(updatedit: any){
  this.resources_1 = this.allResource_Allotment_Details.find((f : any) => f.allotment_id === parseInt(updatedit)); //here we matching and extracting the selected id
 console.log(updatedit)
 document.getElementById("addnews")?.scrollIntoView();

   //console.log(this.resources_1.Financial_id)
  this.editproject = updatedit
  this.isEditMode = true;
  this.selectedResource = this.resources_1.allotment_id; // Set the selected resource for the dropdown
  this.Resource_Allotment_Form.patchValue
  ({
    Emp_Id:this.resources_1.Emp_Id,
    item_id:this.resources_1.item_id,
    Project_ID :this.resources_1.Project_ID,
    allotment_date :this.resources_1.allotment_date,
    allotment_date_end :this.resources_1.allotment_date_end,
   });

  
  // this.iseditmode=true;
  console.log(this.resources_1.allResource_Allotment_Details);
}
onUpdate(){
  this.Resource_Allotment_Form.patchValue //this will help to set the date format (for storing in database)
  ({     
    allotment_date : this.datepipe.transform(this.Resource_Allotment_Form.get("allotment_date")?.value, "yyyy-MM-dd"), 
    allotment_date_end : this.datepipe.transform(this.Resource_Allotment_Form.get("allotment_date_end")?.value, "yyyy-MM-dd"),
   });
  console.log(this.editproject)
  console.log(this.Resource_Allotment_Form.value);

  this.ds.putData('employee_resource_allotment/update/'+this.selectedResource, this.Resource_Allotment_Form.value).subscribe(res =>
    {
      this.update1 = res;
      if(this.update1)
      { 
      this.getTable();
      this.onClear()
      alert('Data updated successfully');
      }
    });  
  

  }


   // mat Table filter
   applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    
// Show data in Mat Table
getTable(){
  this.ds.getData('employee_resource_allotment/mattable' ).subscribe((result:any)=>{
      this.allResource_Allotment_Details = result;
      console.log(this.allResource_Allotment_Details)
  
      if (result) {
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.MatSort;
      } 
    },
    (error: any) => {
      // Handle the error case, such as displaying an error message or taking corrective actions.
      console.error('Error fetching data:', error);
    }
  );
}
ondelete(updateid: any){
  console.log(updateid)
  this.ds.Delete_Data('employee_resource_allotment/delete/'+ updateid,).subscribe((result) => {
       if (result)
       this.getTable();
        alert('Data Deleted...')
});
}
}