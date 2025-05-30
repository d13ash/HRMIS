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
  selector: 'app-project-work-detail',
  templateUrl: './project-work-detail.component.html',
  styleUrls: ['./project-work-detail.component.scss']
})
export class ProjectWorkDetailComponent implements OnInit {

  displayedColumns = ['Project_work_detail_id', 'Project_name', 'module_name', 'Work_name', 'Detail_work_name', 'Start_date', 'End_date', 'Description', 'remark', 'Action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) MatSort!: MatSort;


  projectWorkDetailForm!: FormGroup;


  ResType: any;
  CategoryData: any;
  UnitData: any;
  projectWorkDetail: any;
  datePipe: any;
  data: any;
  iseditmode: boolean = false;
  WorkDataByid: any;
  data_id: any;
  ModuleData: any;
  projectwork: any;
  projectWorkDetaildata: any;
  project: any;


  constructor(private fb: FormBuilder, private ds: DataService, private datepipe: DatePipe) { }
  ngOnInit(): void {
    this.projectWorkDetailForm = this.fb.group({

      Project_ID: [null, Validators.required],
      project_module_id: [null, Validators.required],
      Project_work_main_id: [null, Validators.required],
      Detail_work_name: [
    null,
    [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(200),
      Validators.pattern(/^[a-zA-Z ]+$/) // only letters and spaces
    ]
  ],
      Description: [
    null,
    [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(200),
      Validators.pattern(/^[a-zA-Z ]+$/) // only letters and spaces
    ]
  ],
      remark: [
    null,
    [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(200),
      Validators.pattern(/^[a-zA-Z ]+$/) // only letters and spaces
    ]
  ],
      Start_date: [null, Validators.required],
      End_date: [null, Validators.required],
    });
    this.getTable();
    // this.getProjectwork()
    this.getProject()
  }


  // get Project in dropdown
  getProject() {
    this.ds.getData('projectWorkDetail/allProjectmap').subscribe((result) => {
      console.log(result);
      this.project = result;
    })
  }
  // get module in dropdown
  onChangeModule(Project_id: any) {
    this.ds.getData('projectWorkDetail/allmodulemap/' + Project_id).subscribe((result) => {
      console.log(result);
      this.ModuleData = result;
    })
  }

  // get work in dropdown
  onChangeWork(project_module_id: any) {
    this.ds.getData('projectWorkDetail/allWork/' + project_module_id).subscribe((result) => {
      console.log(result);
      this.projectwork = result;
    })
  }


  // Show data in Mat Table
  getTable() {
    this.ds.getData('projectWorkDetail/allProjectWorkDetaildata').subscribe((result: any) => {
      this.projectWorkDetaildata = result;
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.MatSort;
      console.log(result);
    })
  }

  // mat Table filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }




onSubmit() {
  // Check if the form is valid
  if (this.projectWorkDetailForm.invalid) {
    Swal.fire({
      title: 'Validation Error!',
      text: 'Please fill all required fields correctly.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return;
  }

  // Format Start_date and End_date to 'yyyy-MM-dd'
  const startDate = this.projectWorkDetailForm.get('Start_date')?.value;
  const endDate = this.projectWorkDetailForm.get('End_date')?.value;

  this.projectWorkDetailForm.patchValue({
    Start_date: formatDate(startDate, 'yyyy-MM-dd', 'en'),
    End_date: formatDate(endDate, 'yyyy-MM-dd', 'en')
  });

  console.log(this.projectWorkDetailForm.value);

  // Submit the form data
  this.ds.postData('projectWorkDetail/PostProjectWorkDetail', this.projectWorkDetailForm.value).subscribe(
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
        this.onClear();  // Reset the form
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

  onClear() {
    this.projectWorkDetailForm.reset();
  }



  //  Get single Data into form for update
  onedit(Project_work_detail_id: any) {
    this.WorkDataByid = this.projectWorkDetaildata.find((f: any) => f.Project_work_detail_id === parseInt(Project_work_detail_id));
    console.log(this.WorkDataByid)
    this.iseditmode = true;
    this.data_id = Project_work_detail_id;
    this.projectWorkDetailForm.patchValue
      ({
        Project_ID: this.WorkDataByid.Project_ID,
        project_module_id: this.WorkDataByid.project_module_id,
        Project_work_main_id: this.WorkDataByid.Project_work_main_id,
        Detail_work_name: this.WorkDataByid.Detail_work_name,
        Description: this.WorkDataByid.Description,
        remark: this.WorkDataByid.remark,
        Start_date: this.WorkDataByid.Start_date,
        End_date: this.WorkDataByid.End_date,
      })
  }

  onupdate() {
    this.projectWorkDetailForm.patchValue //this will help to set the date format (for storing in database)
      ({
        Start_date: this.datepipe.transform(this.projectWorkDetailForm.get("Start_date")?.value, "yyyy-MM-dd"),
      });
    this.projectWorkDetailForm.patchValue //this will help to set the date format (for storing in database)
      ({
        End_date: this.datepipe.transform(this.projectWorkDetailForm.get("End_date")?.value, "yyyy-MM-dd"),
      });
    this.ds.putData('projectWorkDetail/updateProjectWorkDetail/' + this.data_id, this.projectWorkDetailForm.value).subscribe((result) => {
      console.log(result);
      this.data = result
      if (this.data) { Swal.fire("data updated successfully") };
      this.getTable()
      this.onClear();
    })
    this.iseditmode = false;
  }


  // Delete Resource detail
  ondelete(Project_work_detail_id: any) {
    this.WorkDataByid = this.projectWorkDetaildata.find((f: any) => f.Project_work_detail_id === parseInt(Project_work_detail_id)); //here we matching and extracting the selected id
    console.log(this.WorkDataByid)
    this.data_id = Project_work_detail_id;
    this.ds.Delete_Data('projectWorkDetail/deletedataByid/' + this.data_id,).subscribe((result) => {
      console.log(result);
      this.data = result
      if (this.data) { Swal.fire('Data Deleted...') };
      this.getTable();
    })
  }

}
