import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { DataService } from '../../../services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { DataService } from '../../../services/data.service';

// DataService
@Component({
  selector: 'app-project-work-detail',
  templateUrl: './project-work-detail.component.html',
  styleUrls: ['./project-work-detail.component.scss'],
})
export class ProjectWorkDetailComponent implements OnInit {
  displayedColumns = [
    'Project_work_detail_id',
    'Project_name',
    'module_name',
    'Work_name',
    'Detail_work_name',
    'Start_date',
    'End_date',
    'Description',
    'remark',
    'Action',
  ];
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
  showForm: boolean = false;
  WorkDataByid: any;
  data_id: any;
  ModuleData: any;
  projectwork: any;
  projectWorkDetaildata: any;
  project: any;

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private datepipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.projectWorkDetailForm = this.fb.group({
      Project_ID: [null, Validators.required],
      project_module_id: [null, Validators.required],
      Project_work_main_id: [null, Validators.required],
      Detail_work_name: [
        null,
        [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)],
      ],
      Description: [null],
      remark: [null],
      Start_date: [null, Validators.required],
      End_date: [null, Validators.required],
    });
    this.getTable();
    // this.getProjectwork()
    this.getProject();
  }

  onInputChange(controlName: string): void {
    const control = this.projectWorkDetailForm.get(controlName);
    if (control) {
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity({ onlySelf: true });
    }
  }

  // get Project in dropdown
  getProject() {
    this.ds.getData('projectWorkDetail/allProjectmap').subscribe((result) => {
      console.log(result);
      this.project = result;
    });
  }
  // get module in dropdown
  onChangeModule(Project_id: any) {
    this.ds
      .getData('projectWorkDetail/allmodulemap/' + Project_id)
      .subscribe((result) => {
        console.log(result);
        this.ModuleData = result;
      });
  }

  // get work in dropdown
  onChangeWork(project_module_id: any) {
    this.ds
      .getData('projectWorkDetail/allWork/' + project_module_id)
      .subscribe((result) => {
        console.log(result);
        this.projectwork = result;
      });
  }

  // Show data in Mat Table
  getTable() {
    this.ds
      .getData('projectWorkDetail/allProjectWorkDetaildata')
      .subscribe((result: any) => {
        this.projectWorkDetaildata = result;
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

  showAddForm() {
    this.showForm = true;
    this.iseditmode = false;
    this.onClear();
  }

  hideForm() {
    this.showForm = false;
    this.iseditmode = false;
    this.onClear();
  }

  onSubmit() {
    if (this.projectWorkDetailForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly.',
      });
      return;
    }

    // Format dates
    this.projectWorkDetailForm.patchValue({
      Start_date: this.datepipe.transform(
        this.projectWorkDetailForm.get('Start_date')?.value,
        'yyyy-MM-dd'
      ),
      End_date: this.datepipe.transform(
        this.projectWorkDetailForm.get('End_date')?.value,
        'yyyy-MM-dd'
      ),
    });

    // Submit data
    this.ds
      .postData(
        'projectWorkDetail/PostProjectWorkDetail',
        this.projectWorkDetailForm.value
      )
      .subscribe((res) => {
        this.data = res;
        if (this.data) {
          Swal.fire('Success', 'Data saved successfully.', 'success');
          this.getTable();
          this.onClear();
          this.hideForm();
        }
      });
  }

  onClear() {
    this.projectWorkDetailForm.reset();

    // Patch default values if any (you can modify as needed)
    this.projectWorkDetailForm.patchValue({
      Project_ID: null,
      project_module_id: null,
      Project_work_main_id: null,
      Detail_work_name: '',
      Description: '',
      remark: '',
      Start_date: null,
      End_date: null,
    });

    // Clear validation states
    Object.keys(this.projectWorkDetailForm.controls).forEach((key) => {
      const control = this.projectWorkDetailForm.get(key);
      control?.setErrors(null);
      control?.markAsPristine();
      control?.markAsUntouched();
    });

    // Reset edit mode
    this.iseditmode = false;
  }

  //  Get single Data into form for update
  onedit(Project_work_detail_id: any) {
    this.WorkDataByid = this.projectWorkDetaildata.find(
      (f: any) => f.Project_work_detail_id === parseInt(Project_work_detail_id)
    );
    console.log(this.WorkDataByid);
    this.iseditmode = true;
    this.showForm = true;
    this.data_id = Project_work_detail_id;
    this.projectWorkDetailForm.patchValue({
      Project_ID: this.WorkDataByid.Project_ID,
      project_module_id: this.WorkDataByid.project_module_id,
      Project_work_main_id: this.WorkDataByid.Project_work_main_id,
      Detail_work_name: this.WorkDataByid.Detail_work_name,
      Description: this.WorkDataByid.Description,
      remark: this.WorkDataByid.remark,
      Start_date: this.WorkDataByid.Start_date,
      End_date: this.WorkDataByid.End_date,
    });
  }

  onupdate() {
    this.projectWorkDetailForm.patchValue(
      //this will help to set the date format (for storing in database)
      {
        Start_date: this.datepipe.transform(
          this.projectWorkDetailForm.get('Start_date')?.value,
          'yyyy-MM-dd'
        ),
      }
    );
    this.projectWorkDetailForm.patchValue(
      //this will help to set the date format (for storing in database)
      {
        End_date: this.datepipe.transform(
          this.projectWorkDetailForm.get('End_date')?.value,
          'yyyy-MM-dd'
        ),
      }
    );
    this.ds
      .putData(
        'projectWorkDetail/updateProjectWorkDetail/' + this.data_id,
        this.projectWorkDetailForm.value
      )
      .subscribe((result) => {
        console.log(result);
        this.data = result;
        if (this.data) {
          Swal.fire('data updated successfully');
        }
        this.getTable();
        this.onClear();
      });
    this.iseditmode = false;
    this.hideForm();
  }

  // Delete Resource detail
  ondelete(Project_work_detail_id: any) {
    this.WorkDataByid = this.projectWorkDetaildata.find(
      (f: any) => f.Project_work_detail_id === parseInt(Project_work_detail_id)
    ); //here we matching and extracting the selected id
    console.log(this.WorkDataByid);
    this.data_id = Project_work_detail_id;
    this.ds
      .Delete_Data('projectWorkDetail/deletedataByid/' + this.data_id)
      .subscribe((result) => {
        console.log(result);
        this.data = result;
        if (this.data) {
          Swal.fire('Data Deleted...');
        }
        this.getTable();
      });
  }
}
