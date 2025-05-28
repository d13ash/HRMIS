import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DataService } from '../../../services/data.service';

// DataService
@Component({
  selector: 'app-add-dept',
  templateUrl: './add-dept.component.html',
  styleUrls: ['./add-dept.component.scss'],
})
export class AddDeptComponent implements OnInit {
  @ViewChild('profile') fileInput!: ElementRef;

  displayedColumns = [
    'Dept_ID',
    'Dept_Name',
    'Dept_Type_Name',
    'Email_ID',
    'Logo_Path',
    'Contact_Number',
    'Website_Url',
    'About_Department',
    'Address',
    'Action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) MatSort!: MatSort;

  departmentDetailForm!: FormGroup;

  deptType: any;
  department: any;
  data: any;
  submitted: any;
  iseditmode: boolean = false;
  departmentDataByid: any;
  department_id: any;
  allDepartmentDetail: any;
  data_id: any;
  State: any;
  District: any;
  Block: any;
  images: any;
  imageurl: any;
  uploadedimage: any =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWq1fCF7KbKYum0PRRMGKnq4EBj-QT_bcSLhLsIphPeQ&s;';
  pDept: any;

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.departmentDetailForm = this.fb.group({
      Dept_Name: [null, [Validators.required, Validators.maxLength(20)]],
      Parent_Dept_ID: [null, Validators.required],
      Dept_Type_ID: [null, Validators.required],
      Email_ID: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          ),
          Validators.maxLength(50),
        ],
      ],
      Website_Url: [null, [Validators.required, Validators.maxLength(100)]],
      Logo_Path: [null, Validators.required],
      About_Department: [
        null,
        [Validators.required, Validators.maxLength(200)],
      ],
      Address: [null, [Validators.required, Validators.maxLength(99)]],
      State: [null, Validators.required],
      District: [null, Validators.required],
      Block: [null, Validators.required],
      Pincode: [null, [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      Contact_Number: [
        '',
        [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')],
      ],
      Contact_Person_ID: [null, Validators.required],
    });
    this.getDept_type();
    this.getTable();
    this.getState();
    this.getDepartmentMap();
  }

  // get department type in dropdown
  getDept_type() {
    this.ds.getData('departmentDetail/deptType').subscribe((result) => {
      console.log(result);
      this.deptType = result;
    });
  }

  getDepartment(value: any) {
    console.log(value);
    this.ds.getData('allDepartment/' + value).subscribe((result) => {
      console.log(result);
      this.department = result;
    });
  }

  getDepartmentMap() {
    this.ds.getData('departmentDetail/allDepartmentmap').subscribe((result) => {
      console.log(result);
      this.pDept = result;
    });
  }

  getState() {
    this.ds.getData('departmentDetail/getState').subscribe((res) => {
      this.State = res;
      console.log(this.State);
    });
  }

  onChangeState(State_id: any) {
    this.ds
      .getData('departmentDetail/getDistric/' + State_id)
      .subscribe((res) => {
        this.District = res;
        console.log('i am called', this.District);
      });
  }

  onChangeDistrict(Distric_id: any) {
    this.ds
      .getData('departmentDetail/getBlock/' + Distric_id)
      .subscribe((res) => {
        this.Block = res;
        console.log(this.Block);
      });
  }

  // post Department Detail

  onSubmit(): void {
    // Set Logo_Path before submission
    this.departmentDetailForm.patchValue({
      Logo_Path: this.imageurl,
    });

    // Validate form
    if (this.departmentDetailForm.invalid) {
      this.departmentDetailForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly.',
      });
      return;
    }

    // Submit the data
    this.ds
      .postData('departmentDetail', this.departmentDetailForm.value)
      .subscribe({
        next: (res) => {
          this.data = res;
          if (this.data) {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Data saved successfully.',
            });
            this.getTable();
            this.onClear();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong while saving the data.',
            });
          }
        },
        error: (err) => {
          console.error('Error saving data:', err);
          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: 'An error occurred while saving data.',
          });
        },
      });
    this.getTable();
    this.onClear();
  }

  onClear() {
    this.departmentDetailForm.reset();
    this.uploadedimage = null;
    this.fileInput.nativeElement.value = '';
    this.departmentDetailForm.markAsPristine();
    this.departmentDetailForm.markAsUntouched();
    this.departmentDetailForm.updateValueAndValidity();
  }

  // Show data in Mat Table
  getTable() {
    this.ds
      .getData('departmentDetail/allDepartmentWithType')
      .subscribe((result: any) => {
        this.allDepartmentDetail = result;
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

  a: any = 5;

  onedit(Dept_ID: any) {
    this.departmentDataByid = this.allDepartmentDetail.find(
      (f: any) => f.Dept_ID === parseInt(Dept_ID)
    );
    console.log(
      'Contact_Person_ID:',
      this.departmentDataByid?.Contact_Person_ID
    );
    this.iseditmode = true;
    this.data_id = Dept_ID;
    document.getElementById('addnews')?.scrollIntoView();

    this.onChangeState(this.departmentDataByid.State);
    setTimeout(() => {
      this.onChangeDistrict(this.departmentDataByid.District);

      this.departmentDetailForm.patchValue({
        Dept_Name: this.departmentDataByid.Dept_Name,
        Parent_Dept_ID: this.departmentDataByid.Parent_Dept_ID,
        Dept_Type_ID: this.departmentDataByid.Dept_Type_ID,
        Email_ID: this.departmentDataByid.Email_ID,
        Website_Url: this.departmentDataByid.Website_Url,
        About_Department: this.departmentDataByid.About_Department,
        Address: this.departmentDataByid.Address,
        State: this.departmentDataByid.State,
        District: this.departmentDataByid.District,
        Block: this.departmentDataByid.Block,
        Pincode: this.departmentDataByid.Pincode,
        Contact_Number: this.departmentDataByid.Contact_Number,
        Contact_Person_ID: this.departmentDataByid.Contact_Person_ID,
      });
    }, 300); // Give time for District to load Blocks

    // Load image preview
    this.imageurl = null;
    this.uploadedimage = this.departmentDataByid.Logo_Path;
  }

  onupdate() {
    this.departmentDetailForm.patchValue({
      Logo_Path: this.imageurl,
    });
    this.ds
      .updateData(
        'updateDepartmentDetail/' + this.data_id,
        this.departmentDetailForm.value
      )
      .subscribe((result) => {
        console.log(result);
        this.data = result;

        if (this.data) {
          Swal.fire('Data Updated Successfully');
        }
        this.onClear();
        this.getTable();
      });
  }

  // Delete Department detail
  ondelete(Dept_ID: any) {
    this.departmentDataByid = this.allDepartmentDetail.find(
      (f: any) => f.Dept_ID === parseInt(Dept_ID)
    ); //here we matching and extracting the selected id
    console.log(this.departmentDataByid);
    this.data_id = Dept_ID;
    this.ds.deleteData('deletedataByid/' + this.data_id).subscribe((result) => {
      console.log(result);
      this.data = result;

      if (this.data) {
        Swal.fire('Data Deleted...');
      }
      this.getTable();
    });
  }

  // file or image upload
  selectimage(event: any) {
    //here on selecting the image(event) this will check any images are present or not
    if (event.target.files.length > 0) {
      const file = event.target.files[0]; //it is used to get the input file dom property
      this.images = file;
      var reader = new FileReader(); //this object is used to read the file
      reader.readAsDataURL(file); //to read the dom property of file
      reader.onload = (event: any) => {
        //this will load the selected image
        this.uploadedimage = event.target.result;
      };
    }
  }

  submitfile() {
    //multer will accept form data so we here creating a form data
    if (!this.images) {
      return this.nopath();
    }

    const formData = new FormData();
    formData.append('Logo_Path', this.images); //the name of key is to be same as provide in backend(node js)
    console.log(this.images);

    this.ds
      .postData('departmentDetail/uploadfile', formData)
      .subscribe((result: any) => {
        console.log(result['profile_url']);
        this.imageurl = result['profile_url'];
        Swal.fire('Image Uploaded Successfully.');
        // this.iseditmode = false;
      });
  }

  nopath() {
    Swal.fire('Please select a file');
  }
}
