import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { DataService } from '../../../services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DatePipe, formatDate } from '@angular/common';
import { DataService } from '../../../services/data.service';

// DataService
@Component({
  selector: 'app-project-work',
  templateUrl: './project-work.component.html',
  styleUrls: ['./project-work.component.scss'],
})
export class ProjectWorkComponent implements OnInit {
  displayedColumns = [
    'Project_work_main_id',
    'Project_name',
    'module_name',
    'Work_name',
    'Description',
    'StartDate',
    'EndDate',
    'Action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) MatSort!: MatSort;

  projrctWorkForm!: FormGroup;

  ResType: any;
  CategoryData: any;
  UnitData: any;
  projectWorkDetail: any;
  datePipe: any;
  data: any;
  iseditmode: boolean = false;
  WorkDataByid: any;
  data_id: any;
  project: any;

  modules: any;

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private datepipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.projrctWorkForm = this.fb.group({
      Project_ID: [null, Validators.required],
      Description: [
    null,
    [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(200),
      Validators.pattern(/^[a-zA-Z ]+$/) // only letters and spaces
    ]
  ],
      Work_name: [
    null,
    [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(200),
      Validators.pattern(/^[a-zA-Z ]+$/) // only letters and spaces
    ]
  ],

      project_module_id: [null, Validators.required],
      StartDate: [null, Validators.required],
      EndDate: [null, Validators.required],
    });
    this.getTable();
    this.getProject();
    // this.getModule()
  }

  // get Project in dropdown
  getProject() {
    this.ds.getData('ProjectWork/allProjectmap').subscribe((result) => {
      console.log(result);
      this.project = result;
    });
  }

  // get module in dropdown
  onChangeModule(Project_id: any) {
    this.ds
      .getData('ProjectWork/allmodulemap/' + Project_id)
      .subscribe((result) => {
        console.log(result);
        this.modules = result;
      });
  }

  // onChangeDistrict(Dist_Id: any) {
  //   this.ds.getData('Employee_data/Districtname/' + Dist_Id).subscribe(res => {
  //     this.Block = res;
  //   });
  // }

  // Show data in Mat Table
  getTable() {
    this.ds
      .getData('ProjectWork/allProjectWorkdata')
      .subscribe((result: any) => {
        this.projectWorkDetail = result;
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.MatSort;
        console.log(result);
      });
  }

  // mat Table filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

onSubmit() {
  if (this.projrctWorkForm.invalid) {
    Swal.fire({
      title: 'Validation Error!',
      text: 'Please fill all required fields correctly.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return;
  }

  // Format StartDate and EndDate to 'yyyy-MM-dd'
  const startDate = this.projrctWorkForm.get('StartDate')?.value;
  const endDate = this.projrctWorkForm.get('EndDate')?.value;

  this.projrctWorkForm.patchValue({
    StartDate: formatDate(startDate, 'yyyy-MM-dd', 'en'),
    EndDate: formatDate(endDate, 'yyyy-MM-dd', 'en')
  });

  console.log(this.projrctWorkForm.value);

  this.ds.postData('ProjectWork/PostallProjectWork', this.projrctWorkForm.value).subscribe(
    res => {
      this.data = res;
      if (this.data) {
        Swal.fire({
          title: 'Success!',
          text: 'Data saved successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.getTable(); // Refresh the table data
        this.projrctWorkForm.reset(); // Reset the form
      }
    },
    error => {
      Swal.fire({
        title: 'Error!',
        text: 'There was a problem saving the data.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  );
}

onClear(){
  this.projrctWorkForm.reset();
}



//  Get single Data into form for update
onedit(Project_work_main_id: any){ 
  this.WorkDataByid = this.projectWorkDetail.find((f : any) => f.Project_work_main_id === parseInt(Project_work_main_id)); 
  console.log(this.WorkDataByid)
 this.iseditmode=true;
 document.getElementById("addnews")?.scrollIntoView();

  this.data_id = Project_work_main_id;
  this.projrctWorkForm.patchValue
  ({
    Project_ID:this.WorkDataByid.Project_ID,
    Description:this.WorkDataByid.Description,
    project_module_id:this.WorkDataByid.project_module_id,
    Work_name:this.WorkDataByid.Work_name,
    StartDate:this.WorkDataByid.StartDate,
    EndDate:this.WorkDataByid.EndDate,
    
  })
}
 
onupdate(){
  this.projrctWorkForm.patchValue //this will help to set the date format (for storing in database)
  ({     
    StartDate : this.datepipe.transform(this.projrctWorkForm.get("StartDate")?.value, "yyyy-MM-dd"), 
   });
   this.projrctWorkForm.patchValue //this will help to set the date format (for storing in database)
   ({     
    EndDate : this.datepipe.transform(this.projrctWorkForm.get("EndDate")?.value, "yyyy-MM-dd"), 
    });
   this.ds.putData('ProjectWork/updateProjectWork/' + this.data_id,this.projrctWorkForm.value).subscribe((result)=>{
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
 ondelete(Project_work_main_id: any){
  this.WorkDataByid = this.projectWorkDetail.find((f : any) => f.Project_work_main_id === parseInt(Project_work_main_id)); //here we matching and extracting the selected id
  console.log(this.WorkDataByid)
  this.data_id = Project_work_main_id;
  this.ds.Delete_Data('ProjectWork/deletedataByid/'+this.data_id,).subscribe((result)=>{
  console.log(result);
  this.data= result
  if(this.data)
  {Swal.fire('Data Deleted...')};
  this.getTable();
 }); 
}

  
}
