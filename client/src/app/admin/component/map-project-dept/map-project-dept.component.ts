import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-map-project-dept',
  templateUrl: './map-project-dept.component.html',
  styleUrls: ['./map-project-dept.component.scss'],
})
export class MapProjectDeptComponent implements OnInit {
  deptType: any;
  projectType: any;
  data: any;

  displayedColumns = [
    'ID',
    'Project_Name',
    'Parent_Dept_Name',
    'Associate_Dept_Name',
    'Description',
    'Action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) MatSort!: MatSort;
  @ViewChild('formDirective') formDirective!: NgForm;

  projectMapForm!: FormGroup;
  projectMapDetail: any;
  MapDetaiDataByid: any;
  data_id: any;
  iseditmode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.projectMapForm = this.fb.group({
      Project_ID: [null, Validators.required],
      Parent_Dept_ID: [null, Validators.required],
      Associate_Dept_ID: [null, Validators.required],
      Description: [null],
    });

    this.getDepartmentMap();
    this.getProjectMap();
    this.getTable();
  }

  scrollToBottom(): void {
    const element = this.elementRef.nativeElement.querySelector('#endOfPage');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getDepartmentMap() {
    this.ds.getData('departmentDetail/allDepartmentmap').subscribe((result) => {
      this.deptType = result;
    });
  }

  getProjectMap() {
    this.ds.getData('projectDetail/allProjectmap').subscribe((result) => {
      this.projectType = result;
    });
  }

  onSubmit() {
    if (this.projectMapForm.invalid) {
    this.projectMapForm.markAllAsTouched();
     Swal.fire({
            icon: 'warning',
            title: 'Validation Error',
            text: 'Please fill all required fields correctly.',
          });
    return;
  }

    this.ds
      .postData('map_dept_project', this.projectMapForm.value)
      .subscribe((res) => {
        this.data = res;
        if (this.data) {
          Swal.fire('Success', 'Data saved successfully.', 'success');
          this.getTable();
          this.onClear();
        }
      });
  }

  onClear() {
    this.projectMapForm.reset();
    if (this.formDirective) {
      this.formDirective.resetForm();
    }

    this.projectMapForm.markAsPristine();
    this.projectMapForm.markAsUntouched();
    this.projectMapForm.updateValueAndValidity();
  }

  getTable() {
    this.ds.getData('map_dept_project/getmapData').subscribe((result: any) => {
      this.projectMapDetail = result;
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.MatSort;
    });
  }

  ondelete(id: any) {
  // console.log("Delete called with ID:", id);
  this.ds.deleteDataservice('deleteMapdataByid/' + id)
    .subscribe((result) => {
      // console.log("Delete API result:", result);
      if (result) {
        Swal.fire('Deleted!', 'Data deleted successfully.', 'success');
        this.getTable();
      }
    }, error => {
      // console.error("Delete API error:", error);
      Swal.fire('Error!', 'Failed to delete data.', 'error');
    });
}


  onedit(ID: any) {
    this.MapDetaiDataByid = this.projectMapDetail.find(
      (f: any) => f.ID === parseInt(ID)
    );
    this.iseditmode = true;
    this.data_id = ID;
    document.getElementById('addnews')?.scrollIntoView();
    this.projectMapForm.patchValue({
      Project_ID: this.MapDetaiDataByid.Project_ID,
      Parent_Dept_ID: this.MapDetaiDataByid.Parent_Dept_ID,
      Associate_Dept_ID: this.MapDetaiDataByid.Associate_Dept_ID,
      Description: this.MapDetaiDataByid.Description,
    });
    this.cdr.detectChanges();
    this.scrollToBottom();
  }

  onupdate() {
    this.ds
      .putData(
        'map_dept_project/updateMapProDetail/' + this.data_id,
        this.projectMapForm.value
      )
      .subscribe((result) => {
        this.data = result;
        if (this.data) {
          Swal.fire('Updated!', 'Data updated successfully.', 'success');
          this.getTable();
          this.onClear();
        }
      });
    this.iseditmode = false;
  }
}
