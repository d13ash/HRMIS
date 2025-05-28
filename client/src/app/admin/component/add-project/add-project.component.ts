import { Component, ElementRef, OnInit, ViewChild,Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { DataService } from '../../../services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DataService } from '../../../services/data.service';

// DataService
// import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit{
  constructor(private fb:FormBuilder, private ds : DataService, private elementRef: ElementRef){}


  displayedColumns=['Project_ID','Project_name','Project_Type_Name','Project_Short_name','Project_Discription','Action'];
  dataSource!: MatTableDataSource<any>;

   @ViewChild(MatPaginator) paginator!: MatPaginator ;
   @ViewChild(MatSort) MatSort!: MatSort ;
@ViewChild('formDirective') formDirective!: any;

  // projectDetailForm = this.fb.group({
  //   Project_name: [null, Validators.required],
  //   Project_Type_ID:[null, Validators.required],
  //   // Dept_ID: [null, Validators.required],
  //   Project_Short_name:[null, Validators.required],
  //   Project_Discription: [null, Validators.required],
  // });

  projectDetailForm!: FormGroup

  deptType: any;
  data: any;
  iseditmode: boolean =false;
  data_id: any;
  projectDataByid: any;
  allProjectDetail: any;
  projectType: any;



  ngOnInit(): void {
    this.projectDetailForm = this.fb.group({
      Project_name: [null, Validators.required],
      Project_Type_ID:[null, Validators.required],
      Project_Short_name:[null, Validators.required],
      Project_Discription: [null, Validators.required],
    });

    this.getDepartment()
    this.getTable()
    this.getProjectType()
  }
// this is scroll function
scrollToBottom(): void {
  const element = this.elementRef.nativeElement.querySelector('#endOfPage');
  element.scrollIntoView({ behavior: 'smooth', block: 'end' });
}



  getDepartment(){
    this.ds.getData('departmentDetail/allDepartment').subscribe((result: any)=>{
      console.log(result);
      this.deptType=result;
    })
  }


  getProjectType(){
    this.ds.getData('projectTypeDtail').subscribe((result: any)=>{
      console.log(result);
      this.projectType=result;
    })
  }


 // post Project Detail

onSubmit() {
  if (this.projectDetailForm.invalid) {
    Swal.fire('Please fill all required fields.');
    return;
  }

  this.ds.postData('projectDetail/hello', this.projectDetailForm.value).subscribe(res => {
    this.data = res;
    if (this.data) {
      Swal.fire("Data Saved Successfully");
      this.getTable();
      this.onClear();
    }
  });
}

  onClear() {
  this.projectDetailForm.reset();
  this.formDirective.resetForm();  // <-- this clears Material styles too
  this.projectDetailForm.markAsPristine();
  this.projectDetailForm.markAsUntouched();
  this.projectDetailForm.updateValueAndValidity();
}






// Show data in Mat Table
getTable(){
  this.ds.getData('projectDetail/allProject' ).subscribe((result:any)=>{
      this.allProjectDetail=result;
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.MatSort;
      console.log(result);
    })
    }

//  Get single Data into form for update
onedit(Project_ID: any){
  this.projectDataByid = this.allProjectDetail.find((f : any) => f.Project_ID === parseInt(Project_ID));
  console.log(this.projectDataByid)
 this.iseditmode=true;
  this.data_id = Project_ID;
  document.getElementById("addnews")?.scrollIntoView();
  this.projectDetailForm.patchValue
  ({
    Project_name:this.projectDataByid.Project_name,
   Project_Type_ID:this.projectDataByid.Project_Type_ID,
   Project_Short_name:this.projectDataByid.Project_Short_name,
   Project_Discription:this.projectDataByid.Project_Discription,
  })
  this.iseditmode=true;
}


// Update Project data

onupdate(){
   this.ds.putData('projectDetail/updateProjectDetail/' + this.data_id,this.projectDetailForm.value).subscribe((result)=>{
    console.log(result);
    this.data= result
  if(this.data)
  {Swal.fire("Data Updated Successfully")};
  this.getTable();
  this.onClear();
   })
  this.iseditmode = false;
 }


// Delete Department detail
 ondelete(Project_ID: any){
  this.projectDataByid = this.allProjectDetail.find((f : any) => f.Project_ID === parseInt(Project_ID)); //here we matching and extracting the selected id
  console.log(this.projectDataByid)
  this.data_id = Project_ID;
  this.ds.deleteProjectData('deletedataByid/'+this.data_id,).subscribe((result)=>{
  console.log(result);
  this.data= result

  if(this.data)
  {Swal.fire('Data Deleted...')};
  this.getTable();

 })
}




// mat Table filter
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}
}
