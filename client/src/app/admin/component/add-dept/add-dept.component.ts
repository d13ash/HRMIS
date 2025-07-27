import { Component,ViewEncapsulation, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DataService } from '../../../services/data.service';
import { ChangeDetectorRef } from '@angular/core';

// DataService
@Component({
  selector: 'app-add-dept',
  templateUrl: './add-dept.component.html',
  styleUrls: ['./add-dept.component.scss'],
   encapsulation: ViewEncapsulation.None
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
  fileSizeError: boolean = false;
  showForm: boolean = false; // Control form visibility

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private elementRef: ElementRef,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.departmentDetailForm = this.fb.group({
      Dept_Name: this.fb.control('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z ]*$'),
      ]),
      Dept_Type_ID: ['', Validators.required],
      Parent_Dept_ID: ['', Validators.required],
      Contact_Number: this.fb.control('', [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/),
      ]),
      Email_ID: this.fb.control('', {
        validators: [Validators.required, Validators.email],
        updateOn: 'change',
      }),
      Website_Url: this.fb.control('', [
        Validators.required,
        Validators.pattern(
          /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,6}(:\d+)?(\/.*)?$/i
        ),
      ]),
      State: ['', Validators.required],
      District: ['', Validators.required],
      Block: ['', Validators.required],
      About_Department: [''],
      Address: ['', Validators.required],
      Pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      Contact_Person_ID: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)],
      ],
      Logo_Path: ['', Validators.required],
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
        console.log( this.District);
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

  onInputChange(controlName: string): void {
    const control = this.departmentDetailForm.get(controlName);
    if (control) {
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity({ onlySelf: true });
    }
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
            this.hideForm(); // Hide form after successful submission
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
  }

  onClear() {
    this.departmentDetailForm.reset();

    // Reset specific default values if required
    this.departmentDetailForm.patchValue({
      Dept_Type_ID: '',
      Parent_Dept_ID: '',
      State: '',
      District: '',
      Block: '',
      Logo_Path: '',
    });

    // Clear validation states
    Object.keys(this.departmentDetailForm.controls).forEach((key) => {
      const control = this.departmentDetailForm.get(key);
      control?.setErrors(null);
      control?.markAsPristine();
      control?.markAsUntouched();
    });

    // Reset image
    this.uploadedimage = null;
    this.imageurl = null;
    this.fileInput.nativeElement.value = '';

    // Force change detection to refresh form UI
    this.cdRef.detectChanges();
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

async fetchFile(url: string, fileName: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
}


onedit(Dept_ID: any) {
  this.departmentDataByid = this.allDepartmentDetail.find(
    (f: any) => f.Dept_ID === parseInt(Dept_ID)
  );

  this.iseditmode = true;
  this.data_id = Dept_ID;
  this.showForm = true; // Show form for editing

  // Scroll to the form
  document.getElementById('addnews')?.scrollIntoView();

  // Fetch and patch form values
  this.onChangeState(this.departmentDataByid.State);
  setTimeout(async () => {
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
       Logo_Path: this.departmentDataByid.Logo_Path,
    });

    // Fetch the logo as a file and update the form
    if (this.departmentDataByid.Logo_Path) {
      const logoFile = await this.fetchFile(
        this.departmentDataByid.Logo_Path,
        'logo.png'
      );

      this.uploadedimage = URL.createObjectURL(logoFile); // Update the displayed image
      this.departmentDetailForm.patchValue({ Logo_Path: logoFile });
    }
  }, 300);
}
onupdate() {
  const finalLogoPath = this.imageurl || this.uploadedimage||this.departmentDataByid.Logo_Path;

  if (!finalLogoPath) {
    Swal.fire('Please upload a logo.');
    return;
  }

  this.departmentDetailForm.patchValue({
    Logo_Path: finalLogoPath,
  });

  if (this.departmentDetailForm.invalid) {
    this.departmentDetailForm.markAllAsTouched();
    return;
  }

  this.ds
    .updateData(
      'updateDepartmentDetail/' + this.data_id,
      this.departmentDetailForm.value
    )
    .subscribe((result) => {
      Swal.fire('Data Updated Successfully');
      this.onClear();
      this.getTable();
      this.hideForm(); // Hide form after successful update
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
     this.fileSizeError = false;
    //here on selecting the image(event) this will check any images are present or not
    if (event.target.files.length > 0) {
      const file = event.target.files[0]; //it is used to get the input file dom property
      this.images = file;

      if (file.size > 102400) {
      this.fileSizeError = true; // Set the error flag
      this.uploadedimage = null; // Reset the preview
      return; // Stop processing further
    }
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

  // Show the add department form
  showAddForm() {
    this.showForm = true;
    this.iseditmode = false;
    this.onClear(); // Clear any existing data
    setTimeout(() => {
      document.getElementById('addnews')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  // Hide the form
  hideForm() {
    this.showForm = false;
    this.iseditmode = false;
    this.onClear(); // Clear form data when hiding
  }
}
