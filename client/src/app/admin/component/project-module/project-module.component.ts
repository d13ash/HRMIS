
import { Component, ElementRef, OnInit, ViewChild , ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { DataService } from 'src/app/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DataService } from '../../../services/data.service';

// DataService
@Component({
  selector: 'app-project-module',
  templateUrl: './project-module.component.html',
  styleUrls: ['./project-module.component.scss']
})
export class ProjectModuleComponent implements OnInit {

  displayedColumns = ['project_module_id', 'module_name', 'module_Short_Name', 'Project_type', 'Description', 'Action',];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) MatSort!: MatSort;

  project_moduleform!: FormGroup;

  iseditmode: boolean = false;
  showForm: boolean = false; // Add showForm property
  project: any;
  allprojectPostDetail: any;
  data: any;
  resourceAssDataByid: any;
  data_id: any;
  status: any;
  projectPostDataByid: any;
  projectType: any;
  post: any;
  posmodule: any;
  projectPostDataByidd: any;

  constructor(private fb: FormBuilder, private ds: DataService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.project_moduleform = this.fb.group({
     module_name: [null, [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
  module_Short_Name: [null, [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
  project_module_type_id: ['', Validators.required],
      Description: [''],


    });
    this.getTable()
    this.getModule()
  }

  // Show/Hide form methods
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

  // get resource in dropdown
  getModule() {
    this.ds.getData('projectmodule/getModule_type').subscribe((result) => {
      console.log(result);
      this.posmodule = result;
    })
  }


  // Show data in Mat Table
  getTable() {
    this.ds.getData('projectmodule/getallProject_module').subscribe((result: any) => {
      this.allprojectPostDetail = result;
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.MatSort;
    })
  }



  // mat Table filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

 onSubmit() {
  if (this.project_moduleform.invalid) {
    this.project_moduleform.markAllAsTouched();
    Swal.fire({
            icon: 'warning',
            title: 'Validation Error',
            text: 'Please fill all required fields correctly.',
          }); // shows validation messages
    return;
  }

  // console.log(this.project_moduleform.value);

  this.ds.postData('projectmodule/postprojectmodule', this.project_moduleform.value).subscribe(res => {
    this.data = res;

    if (this.data) {
      Swal.fire('Data Saved successfully');

      // ✅ Clear and reset form after successful submit
      this.project_moduleform.reset();
       Object.keys(this.project_moduleform.controls).forEach(key => {
        const control = this.project_moduleform.get(key);
        control?.markAsPristine();
        control?.markAsUntouched();
        control?.updateValueAndValidity(); // optional: re-evaluate validators
      });
      this.hideForm(); // Hide form after successful submission
    }
this.cdRef.detectChanges();
    this.getTable(); // refresh table
  });
}

onClear() {
  this.project_moduleform.reset();
  this.project_moduleform.markAsPristine();
  this.project_moduleform.markAsUntouched();
  this.project_moduleform.updateValueAndValidity();
  this.iseditmode = false;
}

onInputChange(controlName: string): void {
    const control = this.project_moduleform.get(controlName);
    if (control) {
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity({ onlySelf: true });
    }
  }

  //  Get single Data into form for update
  onedit(project_module_id: any) {
    this.projectPostDataByidd = this.allprojectPostDetail.find((f: any) => f.project_module_id === parseInt(project_module_id));
    console.log(this.projectPostDataByidd)
    this.iseditmode = true;
    this.showForm = true; // Show form when editing
    this.data_id = project_module_id;
    document.getElementById("addnews")?.scrollIntoView();

    this.project_moduleform.patchValue
      ({
        module_name: this.projectPostDataByidd.module_name,
        module_Short_Name: this.projectPostDataByidd.module_Short_Name,
        project_module_type_id: this.projectPostDataByidd.project_module_type_id,
        Description: this.projectPostDataByidd.Description,
      })
  }
onupdate() {
  this.ds.putData('projectmodule/updatemodule/' + this.data_id, this.project_moduleform.value)
    .subscribe((result) => {
      console.log(result);
      this.data = result;

      if (this.data) {
        Swal.fire("Data Updated Successfully");
        this.getTable();
        this.onClear();  // Clear form state
        this.iseditmode = false;
        this.hideForm(); // Hide form after successful update

        this.cdRef.detectChanges();  // Force view update to remove red errors
      }
    });
}


  // Delete Resource detail
  ondelete(project_module_id: any) {
    this.projectPostDataByidd = this.allprojectPostDetail.find((f: any) => f.project_module_id === parseInt(project_module_id)); //here we matching and extracting the selected id
    console.log(this.projectPostDataByidd)
    this.data_id = project_module_id;
    this.ds.DeleteassignData('projectmodule/deletedataByid/' + this.data_id,).subscribe((result) => {
      console.log(result);
      this.data = result
      if (this.data) { Swal.fire('Data Deleted...') };
      this.getTable();
    })
  }

}

