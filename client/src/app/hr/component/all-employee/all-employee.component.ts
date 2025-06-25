import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { DataService } from 'src/app/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { DataService } from '../../../services/data.service';

// DataService
@Component({
  selector: 'app-all-employee',
  templateUrl: './all-employee.component.html',
  styleUrls: ['./all-employee.component.scss']
})
export class AllEmployeeComponent  implements OnInit{
    displayedColumns=['resource_assignment_main_ID','Project_name','Resource_Name','Quantity','From_Date','To_Date','Action'];
    dataSource!: MatTableDataSource<any>;
  
     @ViewChild(MatPaginator) paginator!: MatPaginator ;
     @ViewChild(MatSort) MatSort!: MatSort ;
  
     empDetailForm!: FormGroup
   
  iseditmode: boolean =false
  resource: any;
  project: any;
  allAssignResourceDetail: any;
  data: any;
  resourceAssDataByid: any;
  data_id: any;
  saluype: any;
  country: any;
  State: any;
  District: any;
  Block: any;
  
    constructor(private fb:FormBuilder, private ds : DataService, private datepipe:DatePipe){}
  
 ngOnInit(): void {
  this.empDetailForm  = this.fb.group({
    id: ['', Validators.required], 
    Emp_First_Name_E: ['', Validators.required],
    Emp_Middle_Name_E: ['', Validators.required],
    Emp_Last_Name_E: ['', Validators.required],
    Father_Name_E: ['', Validators.required],
    Mother_Name_E: ['', Validators.required],
    Guardian_Name_E: ['', Validators.required],
    Mobile_No:['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[6789][0-9]{9}$")]],
    Email_Id:['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    Gender_Id: ['', Validators.required],
    DOB:['', Validators.required],
    Permanent_Address: ['', Validators.required],
    Permanent_Country_Id:['', Validators.required],
    Permanent_State_Id:['', Validators.required],
    Permanent_District_Id:['', Validators.required],
    Permanent_Block_Id:['', Validators.required],
    Permanent_Pin_Code:['', Validators.required],
    Permanent_City:['', Validators.required],
    Current_Address:['', Validators.required],
    Current_Country_Id:['', Validators.required],
    Current_State_Id:['', Validators.required],
    Current_District_Id:['', Validators.required],
    Current_Block_Id:['', Validators.required],
    Current_Pin_Code:['', Validators.required],
    Current_City:['', Validators.required],
    // Emp_Photo_Path:['',],
  });
  this.getTable()
  this.getSalutation()
  this.getcountry()
    }

// get salutation in dropdown
 getSalutation() {
    this.ds.getData('employeeDetail/salutationtype').subscribe(res => {
      this.saluype = res;
    });
  }

  getcountry() {
    this.ds.getData('employeeDetail/getCountry').subscribe(res => {
      this.country = res;
      console.log(this.country);
    });
  }

  onChangeCountry(Country_id:any){
    this.ds.getData('employeeDetail/getState/'+Country_id).subscribe(res => {
      this.State = res;
      console.log(this.State);
    });
  } 
  onChangeState(State_id:any){
    this.ds.getData('employeeDetail/getDistric/'+State_id).subscribe(res => {
      this.District = res;
      console.log(this.District);
    });
  } 
  onChangeDistrict(Distric_id:any){
    this.ds.getData('employeeDetail/getBlock/'+Distric_id).subscribe(res => {
      this.Block = res;
      console.log(this.Block);
    });
  } 

// Show data in Mat Table
getTable(){
  // this.ds.getData('employeeDetail/allAssignResourceMap' ).subscribe((result:any)=>{
  //     this.allAssignResourceDetail=result;
  //         this.dataSource = new MatTableDataSource(result);
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.MatSort;
  //     console.log(result);  
  //   })
    }


// mat Table filter
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

onSudbmit(){
console.log(this.empDetailForm.value);
this.ds.postData('employeeDetail/PostEmpDetail',this.empDetailForm.value).subscribe(res =>{
  this.data=res;
  if (this.data)
  alert("Data saved succesfully..")
});
this.getTable();
}

onSubmit(){
  console.log(this.empDetailForm.value);
  this.ds.pData('employeeDetail/PostEmpDetail',this.empDetailForm.value).subscribe(res =>{
    this.data=res;
    if (this.data)
    alert("Data saved succesfully..")
  });
  // this.getTable();
  }
 


onClear(){
  this.empDetailForm.reset();
}




//  Get single Data into form for update
onedit(resource_assignment_main_ID: any){ 
  this.resourceAssDataByid = this.allAssignResourceDetail.find((f : any) => f.resource_assignment_main_ID === parseInt(resource_assignment_main_ID)); 
  console.log(this.resourceAssDataByid)
 this.iseditmode=true;
  this.data_id = resource_assignment_main_ID;
  this.empDetailForm.patchValue
  ({
    // Project_ID:this.resourceAssDataByid.Project_ID,
    // Resource_Main_ID:this.resourceAssDataByid.Resource_Main_ID,
    // Quantity:this.resourceAssDataByid.Quantity,
    // From_Date:this.resourceAssDataByid.From_Date,
    // To_Date:this.resourceAssDataByid.To_Date,
  })
}




onupdate(){
   this.ds.putData('resource_assign/updateResourceAssign/' + this.data_id,this.empDetailForm.value).subscribe((result)=>{
    console.log(result);
    this.data= result
  if(this.data)
  {Swal.fire("data updated successfully")};
  this.getTable()
  this.onClear();
   })
  this.iseditmode = false;
 }


 // Delete Resource detail
 ondelete(resource_assignment_main_ID: any){
  this.resourceAssDataByid = this.allAssignResourceDetail.find((f : any) => f.resource_assignment_main_ID === parseInt(resource_assignment_main_ID)); //here we matching and extracting the selected id
  console.log(this.resourceAssDataByid)
  this.data_id = resource_assignment_main_ID;
  this.ds.DeleteassignData('resource_assign/deleteAssignData/'+this.data_id,).subscribe((result)=>{
  console.log(result);
  this.data= result
  if(this.data)
  {Swal.fire('Data Deleted...')};
  this.getTable();
 }) 
}
}
