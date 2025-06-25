import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { DataService } from '../../../services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { DataService } from '../../../services/data.service';

// DataService
@Component({
  selector: 'app-map-post-emp',
  templateUrl: './map-post-emp.component.html',
  styleUrls: ['./map-post-emp.component.scss'],
})
export class MapPostEmpComponent implements OnInit {
  deptType: any;
  projectType: any;
  data: any;

  displayedColumns = [
    'Map_post_emp_id',
    'Financial_name',
    'Post_name',
    'Emp_First_Name_E',
    'Join_date',
    'Appointment_order',
    'Reliving_date',
    'Reliving_order',
    'Active_yn',
    'Remark',
    'NOC_reliving',
    'Action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) MatSort!: MatSort;

  postMapForm!: FormGroup;
  postEmpMapDetail: any;
  MapDetaiDataByid: any;
  data_id: any;
  iseditmode: boolean = false;
  allemp: any;
  allPost: any;
  uploadedimage: any;
 imageurl: string | null = null;
  images: any;
  post: any;
  FYear: any;
  selectedFile: File | null = null;
fileError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private datepipe: DatePipe,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.postMapForm = this.fb.group({
      Financial_id: [null, Validators.required],
      Emp_Id: [null, Validators.required],
      Post_id: [null, Validators.required],
      Remark: [null],
      Active_yn: [null, Validators.required],
      Join_date: [null, Validators.required],
      Reliving_order: [null, Validators.required],
      Reliving_date: [null, Validators.required],
      Appointment_order: [null, Validators.required],
      NOC_reliving: [null],
    });
    this.getEmpMap();
    //  this.getPost()
    this.getTable();
    this.getYear();
  }

  // this is scroll function
  scrollToBottom() {
    const element = document.getElementById('bottom');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  // mat Table filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getEmpMap() {
    this.ds.getData('map_post_emp/allemp').subscribe((result) => {
      console.log(result);
      this.allemp = result;
    });
  }

  // this api calling also use in financial-post component  so both component use same api only for year and post calling
  getYear() {
    this.ds
      .getData('Financialyear_post/getFinancialYear')
      .subscribe((result) => {
        console.log(result);
        this.FYear = result;
      });
  }

  onChangeFYear(Financial_id: any) {
    this.ds
      .getData('Financialyear_post/getPost/' + Financial_id)
      .subscribe((res) => {
        this.post = res;
      });
  }

selectimage(event: any) {
  this.fileError = null; // reset error

  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    const fileType = file.type;

    // Validate PDF
    if (fileType !== 'application/pdf') {
      this.fileError = 'Only PDF files are allowed.';
      this.selectedFile = null;
      this.uploadedimage = null;
      this.imageurl = null;
      return;
    }

    this.selectedFile = file;
    this.images = file;
    this.uploadedimage = URL.createObjectURL(file);
    this.imageurl = null;
    // console.log('PDF file selected:', file.name);
  }
}

submitfile() {
  if (!this.selectedFile) {
    return this.nopath();
  }

  const formData = new FormData();
  formData.append('NOC_reliving', this.selectedFile);

  this.ds.postData('map_post_emp/uploadfile', formData).subscribe(
    (result: any) => {
      this.imageurl = result['profile_url'];

      // Set uploaded URL to form
      this.postMapForm.patchValue({
        NOC_reliving: this.imageurl,
      });

      Swal.fire('File uploaded successfully');
    },
    (error) => {
      console.error('Upload error:', error);
      Swal.fire('Upload failed', 'Please try again', 'error');
    }
  );
}

onSubmit() {


  if (this.postMapForm.invalid) {
    this.postMapForm.markAllAsTouched();
    return;
  }

  // ✅ IF FILE IS SELECTED BUT NOT UPLOADED, UPLOAD IT FIRST
  if (this.selectedFile && !this.imageurl) {
    return this.submitfile(); // This will call onSubmit() after upload
  }

  // Format dates
  this.postMapForm.patchValue({
    Join_date: this.datepipe.transform(
      this.postMapForm.get('Join_date')?.value,
      'yyyy-MM-dd'
    ),
    Reliving_date: this.datepipe.transform(
      this.postMapForm.get('Reliving_date')?.value,
      'yyyy-MM-dd'
    ),
   NOC_reliving: this.imageurl ?? ''
 // ✅ USE UPLOADED FILE URL
  });

  console.log('Form data being submitted:', this.postMapForm.value);


  this.ds.postData('map_post_emp/postMapPostEmp', this.postMapForm.value)
    .subscribe((res) => {
      this.data = res;
      if (this.data) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Data saved successfully.',
          confirmButtonColor: '#3085d6',
        });
        // console.log('NOC_reliving value:', this.postMapForm.get('NOC_reliving')?.value);

      }
      this.getTable();
      this.onClear();
    },
  );
}

  onClear() {
  this.postMapForm.reset();
  this.selectedFile = null; // ✅ CLEAR SELECTED FILE
  this.imageurl = null; // ✅ CLEAR IMAGE URL
  this.uploadedimage = null; // ✅ CLEAR PREVIEW

  Object.keys(this.postMapForm.controls).forEach((key) => {
    this.postMapForm.get(key)?.markAsPristine();
    this.postMapForm.get(key)?.markAsUntouched();
    this.postMapForm.get(key)?.updateValueAndValidity();
  });
}

  getTable() {
    this.ds.getData('map_post_emp/getmapData').subscribe((result: any) => {
      this.postEmpMapDetail = result;
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.MatSort;
      console.log(result);
    });
  }

  // Delete Department detail
  ondelete(Map_post_emp_id: any) {
    this.MapDetaiDataByid = this.postEmpMapDetail.find(
      (f: any) => f.Map_post_emp_id === parseInt(Map_post_emp_id)
    ); //here we matching and extracting the selected id
    console.log(this.MapDetaiDataByid);
    this.data_id = Map_post_emp_id;
    this.ds
      .DeleteassignData('map_post_emp/deleteMapdataByid/' + this.data_id)
      .subscribe((result) => {
        console.log(result);
        this.data = result;
        if (this.data) {
          Swal.fire('Data Deleted...');
        }
        this.getTable();
      });
  }

  // Get single Data into form for update
  onedit(Map_post_emp_id: any) {
    this.MapDetaiDataByid = this.postEmpMapDetail.find(
      (f: any) => f.Map_post_emp_id === parseInt(Map_post_emp_id)
    );
      this.iseditmode = true;
    console.log(this.MapDetaiDataByid);
    this.iseditmode = true;
    this.data_id = Map_post_emp_id;
    document.getElementById('addnews')?.scrollIntoView();


    this.onChangeFYear(this.MapDetaiDataByid.Financial_id);

    this.postMapForm.patchValue({
      Financial_id: this.MapDetaiDataByid.Financial_id,
      Emp_Id: this.MapDetaiDataByid.Emp_Id,
      Post_id: this.MapDetaiDataByid.Post_id,
      Remark: this.MapDetaiDataByid.Remark,
      Active_yn: this.MapDetaiDataByid.Active_yn,
      Join_date: this.MapDetaiDataByid.Join_date,
      Reliving_order: this.MapDetaiDataByid.Reliving_order,
      Reliving_date: this.MapDetaiDataByid.Reliving_date,
      Appointment_order: this.MapDetaiDataByid.Appointment_order,
      NOC_reliving: this.MapDetaiDataByid.NOC_reliving,
    });


  }

  onupdate() {
    this.postMapForm.patchValue(
      //this will help to set the date format (for storing in database)
      {
        Join_date: this.datepipe.transform(
          this.postMapForm.get('Join_date')?.value,
          'yyyy-MM-dd'
        ),
      }
    );
    this.postMapForm.patchValue(
      //this will help to set the date format (for storing in database)
      {
        Reliving_date: this.datepipe.transform(
          this.postMapForm.get('Reliving_date')?.value,
          'yyyy-MM-dd'
        ),
      }
    );
    this.postMapForm.patchValue({
      NOC_reliving: this.imageurl,
    });
    this.ds
      .putData(
        'map_post_emp/updategetMapPostEmp/' + this.data_id,
        this.postMapForm.value
      )
      .subscribe((result) => {
        console.log(result);
        this.data = result;
        if (this.data) {
         Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Data Updated Successfully.',
          confirmButtonColor: '#3085d6',
        });
        }
        this.getTable();
        this.onClear();
      });
    this.iseditmode = false;
  }

  // file or image upload
  // selectimage(event: any) {
  //   //here on selecting the image(event) this will check any images are present or not
  //   if (event.target.files.length > 0) {
  //     const file = event.target.files[0]; //it is used to get the input file dom property
  //     this.uploadedimage = URL.createObjectURL(file);
  //   }
  // }
  // submitfile() {
  //   //multer will accept form data so we here creating a form data
  //   if (!this.images) {
  //     return this.nopath();
  //   }

  //   const formData = new FormData();
  //   formData.append('NOC_reliving', this.images); //the name of key is to be same as provide in backend(node js)
  //   console.log(this.images);

  //   this.ds
  //     .postData('map_post_emp/uploadfile', formData)
  //     .subscribe((result: any) => {
  //       console.log(result['profile_url']);
  //       this.imageurl = result['profile_url'];
  //       Swal.fire('file uploaded successfully');
  //       this.iseditmode = false;
  //     });
  // }

  nopath() {
    Swal.fire('please select a file');
  }
}
