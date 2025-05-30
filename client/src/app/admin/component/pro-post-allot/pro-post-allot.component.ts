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
  selector: 'app-pro-post-allot',
  templateUrl: './pro-post-allot.component.html',
  styleUrls: ['./pro-post-allot.component.scss'],
})
export class ProPostAllotComponent implements OnInit {
  displayedColumns = [
    'Project_post_allotment_ID',
    'Project_name',
    'Financial_name',
    'Post_name',
    'Start_date',
    'End_date',
    'Duration_in_days',
    'Manpower_no',
    'Description',
    'Action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) MatSort!: MatSort;
@ViewChild('projectPostFormRef') projectPostFormRef!: ElementRef;

  projectPostForm!: FormGroup;

  iseditmode: boolean = false;
  project: any;
  allprojectPostDetail: any;
  data: any;
  resourceAssDataByid: any;
  data_id: any;
  status: any;
  projectPostDataByid: any;
  projectType: any;
  post: any;
  year: any;

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private datepipe: DatePipe,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.projectPostForm = this.fb.group({
      Post_id: [null, Validators.required],
      Project_ID: [null, Validators.required],
      Description: [null, Validators.required],
      Duration_in_days: [null, Validators.required],
      Manpower_no: [null, Validators.required],
      Financial_id: [null, Validators.required],
      Start_date: [null, Validators.required],
      End_date: [null, Validators.required],
    });
    this.getTable();
    this.getPost();
    this.getProjectMap();
    this.getYear();
  }

  // this is scroll function
  scrollToBottom(): void {
    const element = this.elementRef.nativeElement.querySelector('#endOfPage');
    element.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  // get resource in dropdown
  getPost() {
    this.ds.getData('projectPostDetail/allpost').subscribe((result) => {
      console.log(result);
      this.post = result;
    });
  }

  // get resource in dropdown
  getYear() {
    this.ds
      .getData('projectPostDetail/getFinancialYear')
      .subscribe((result) => {
        console.log(result);
        this.year = result;
      });
  }

  getProjectMap() {
    this.ds.getData('projectDetail/allProjectmap').subscribe((result) => {
      console.log(result);
      this.projectType = result;
    });
  }

  // Show data in Mat Table
  getTable() {
    this.ds
      .getData('projectPostDetail/allProjectPostTable')
      .subscribe((result: any) => {
        this.allprojectPostDetail = result;
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.MatSort;
      });
  }

  // mat Table filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

onSubmit() {
  // Check if form is invalid
  if (this.projectPostForm.invalid) {
     this.projectPostForm.markAllAsTouched();
    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: 'Please fill all required fields correctly!',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    });
    return; // Stop form submission
  }

  // Format the dates before submission
  this.projectPostForm.patchValue({
    Start_date: this.datepipe.transform(this.projectPostForm.get('Start_date')?.value, 'yyyy-MM-dd'),
    End_date: this.datepipe.transform(this.projectPostForm.get('End_date')?.value, 'yyyy-MM-dd'),
  });

  console.log(this.projectPostForm.value);

  // Submit data to backend
  this.ds.postData('projectPostDetail/postProjecPost', this.projectPostForm.value)
    .subscribe((res) => {
      this.data = res;
      if (this.data) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Data Saved Successfully!',
          timer: 1500,
          showConfirmButton: true,
        }).then(() => {
          this.getTable();
          this.onClear(); // Clear form after success
        });
      }
    });
}


 onClear() {
  this.projectPostForm.reset();
  this.projectPostForm.markAsPristine();
  this.projectPostForm.markAsUntouched();
  this.projectPostForm.updateValueAndValidity();
  this.iseditmode = false;

  // Optional: Reset form DOM as well (extra safe)
  if (this.projectPostFormRef) {
    this.projectPostFormRef.nativeElement.reset();
  }
}



  //  Get single Data into form for update
  onedit(Project_post_allotment_ID: any) {
    this.projectPostForm.patchValue(
      //this will help to set the date format (for storing in database)
      {
        Start_date: this.datepipe.transform(
          this.projectPostForm.get('Start_date')?.value,
          'yyyy-MM-dd'
        ),
      }
    );
    this.projectPostForm.patchValue(
      //this will help to set the date format (for storing in database)
      {
        End_date: this.datepipe.transform(
          this.projectPostForm.get('End_date')?.value,
          'yyyy-MM-dd'
        ),
      }
    );
    document.getElementById('addnews')?.scrollIntoView();
    this.projectPostDataByid = this.allprojectPostDetail.find(
      (f: any) =>
        f.Project_post_allotment_ID === parseInt(Project_post_allotment_ID)
    );
    console.log(this.projectPostDataByid);
    this.iseditmode = true;
    this.data_id = Project_post_allotment_ID;
    this.projectPostForm.patchValue({
      Post_id: this.projectPostDataByid.Post_id,
      Project_ID: this.projectPostDataByid.Project_ID,
      Description: this.projectPostDataByid.Description,
      Duration_in_days: this.projectPostDataByid.Duration_in_days,
      Manpower_no: this.projectPostDataByid.Manpower_no,
      Financial_id: this.projectPostDataByid.Financial_id,
      Start_date: this.projectPostDataByid.Start_date,
      End_date: this.projectPostDataByid.End_date,
    });
  }

  onupdate() {
  this.projectPostForm.patchValue({
    Start_date: this.datepipe.transform(this.projectPostForm.get('Start_date')?.value, 'yyyy-MM-dd'),
    End_date: this.datepipe.transform(this.projectPostForm.get('End_date')?.value, 'yyyy-MM-dd'),
  });

  this.ds.putData('projectPostDetail/updateProjectPostDetail/' + this.data_id, this.projectPostForm.value)
    .subscribe((result) => {
      this.data = result;
      if (this.data) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Data updated successfully!',
          timer: 1500,
          showConfirmButton: true,
        }).then(() => {
          this.getTable();
          this.onClear(); // <- move here
        });
      }
    });
  this.iseditmode = false;
}


  // Delete Resource detail
  ondelete(Project_post_allotment_ID: any) {
    this.projectPostDataByid = this.allprojectPostDetail.find(
      (f: any) =>
        f.Project_post_allotment_ID === parseInt(Project_post_allotment_ID)
    ); //here we matching and extracting the selected id
    console.log(this.projectPostDataByid);
    this.data_id = Project_post_allotment_ID;
    this.ds
      .DeleteassignData('projectPostDetail/deletedataByid/' + this.data_id)
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
