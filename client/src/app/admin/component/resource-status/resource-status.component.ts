import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { DataService } from '../../../services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DataService } from '../../../services/data.service';


// DataService
@Component({
  selector: 'app-resource-status',
  templateUrl: './resource-status.component.html',
  styleUrls: ['./resource-status.component.scss']
})
export class ResourceStatusComponent implements OnInit {

  displayedColumns = ['Resource_status_detail_id', 'Resource_Name', 'Availability_Status', 'Action'];

  // displayedColumns=['Resource_status_detail_id','Resource_Name','Availability_Status','dddddd','Action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) MatSort!: MatSort;

  resourceStatusForm!: FormGroup;

  iseditmode: boolean = false
  resource: any;
  project: any;
  allAssignResourceDetail: any;
  data: any;
  resourceAssDataByid: any;
  data_id: any;
  status: any;
  resourceStatusByid: any;
  images: any;
  // uploadedimage:any = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWq1fCF7KbKYum0PRRMGKnq4EBj-QT_bcSLhLsIphPeQ&s;"
  imageurl: any;
submitted = false;
  constructor(private fb: FormBuilder, private ds: DataService, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.resourceStatusForm = this.fb.group({
      Resource_Main_ID: [null, Validators.required],
      Availability_Status_ID: [null, Validators.required],

    });
    this.getTable()
    this.assignResource()
    this.Status()
  }

  scrollToBottom(): void {
    const element = this.elementRef.nativeElement.querySelector('#endOfPage');
    element.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }


  assignResource() {
    this.ds.getData('resourceStatus/allResource').subscribe((result) => {
      console.log(result);
      this.resource = result;
    })
  }



  // get resource in dropdown
  Status() {
    this.ds.getData('resourceStatus/Status').subscribe((result) => {
      console.log(result);
      this.status = result;
    })
  }

  // Show data in Mat Table
  getTable() {

    this.ds.getData('resourceStatus/ResourcestatusMap').subscribe((result: any) => {
      this.allAssignResourceDetail = result;
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
  this.submitted = true;
  if (this.resourceStatusForm.invalid) {
    this.resourceStatusForm.markAllAsTouched();
    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: 'Please fill all required fields correctly',
    });
    return;
  }

  console.log(this.resourceStatusForm.value);
  this.ds.postData('resourceStatus/PostResorcestatus', this.resourceStatusForm.value).subscribe(
    res => {
      this.data = res;
      if (this.data) {
        Swal.fire({
          title: 'Submitted',
          icon: 'success',
        });
        this.getTable();
        // Reset the form and clear validation states
        this.resourceStatusForm.reset({
          Resource_Main_ID: null,
          Availability_Status_ID: null,
        });
        Object.keys(this.resourceStatusForm.controls).forEach(key => {
          this.resourceStatusForm.get(key)?.setErrors(null);
          this.resourceStatusForm.get(key)?.markAsPristine();
          this.resourceStatusForm.get(key)?.markAsUntouched();
        });
        this.iseditmode = false;
      }
    },
    error => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while saving data.',
      });
    }
  );
}
  onClear() {
    this.resourceStatusForm.reset({
      Resource_Main_ID: null,
      Availability_Status_ID: null,
      file_Path: null
    });
    this.resourceStatusForm.markAsPristine();
    this.resourceStatusForm.markAsUntouched();
    this.iseditmode = false;
  }

  //  Get single Data into form for update
  onedit(Resource_status_detail_id: any) {
    this.resourceStatusByid = this.allAssignResourceDetail.find((f: any) => f.Resource_status_detail_id === parseInt(Resource_status_detail_id));
    console.log(this.resourceStatusByid)
    this.iseditmode = true;
    this.data_id = Resource_status_detail_id;
    this.resourceStatusForm.patchValue
      ({
        Resource_Main_ID: this.resourceStatusByid.Resource_Main_ID,
        Availability_Status_ID: this.resourceStatusByid.Availability_Status_ID,
      })
  }

  onupdate() {
    this.ds.putData('resourceStatus/updateResourceStatus/' + this.data_id, this.resourceStatusForm.value).subscribe((result) => {
      console.log(result);
      this.data = result
      if (this.data) { Swal.fire("data updated successfully") };
      this.getTable()
      this.onClear();
    })
    this.iseditmode = false;
  }

  // Delete Resource detail
  ondelete(Resource_status_detail_id: any) {
    this.resourceStatusByid = this.allAssignResourceDetail.find((f: any) => f.Resource_status_detail_id === parseInt(Resource_status_detail_id)); //here we matching and extracting the selected id
    console.log(this.resourceStatusByid)
    this.data_id = Resource_status_detail_id;
    this.ds.DeleteassignData('resourceStatus/deletedataByid/' + this.data_id,).subscribe((result) => {
      console.log(result);
      this.data = result
      if (this.data) { Swal.fire('Data Deleted...') };
      this.getTable();
    })
  }



}
