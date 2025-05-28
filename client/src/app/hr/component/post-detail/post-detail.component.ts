import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})

export class PostDetailComponent implements OnInit {
  displayedColumns = [
    'Post Id',
    'Post Name',
    'Post Name Hindi',
    'Post Short Name',
    'Post_type_name',
    'Post_leval',
    'Action',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) MatSort!: MatSort;

  allPostDetail: any[] = [];
  postDataByid: any;
  iseditmode = false;
  data_id: number | null = null;
  data: any;
  posttype: any[] = [];
  dataSource!: MatTableDataSource<any>;

  PostdetailsForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.getposttype();
    this.getTable();
  }

  initForm() {
    this.PostdetailsForm = this.fb.group({
      Post_name: ['', Validators.required],
      Post_name_hindi: ['', Validators.required],
      Post_short_name: ['', Validators.required],
      Post_Type_ID: ['', Validators.required],
      Post_leval: ['', Validators.required],
      Display_order: ['', Validators.required],
      Is_hod: [''],
    });
  }

  getTable() {
    this.ds.getData('post/allpostdetails').subscribe((result: any) => {
      this.allPostDetail = result;
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.MatSort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getposttype() {
  this.ds.getData('postType').subscribe((result) => {
  console.log("Post Types:", result);
  this.posttype = result as any[]; // or more specific type if known
}, (error) => {
  console.error("Error fetching post types:", error);
});

}

  onSubmit() {
    if (this.PostdetailsForm.invalid) {
      Swal.fire('Please fill all required fields');
      return;
    }

    this.ds
      .postData('post/submitPost', this.PostdetailsForm.value)
      .subscribe((res) => {
        this.data = res;
        Swal.fire('Data saved successfully');
        this.getTable();
        this.onReset();
      });
  }

  onReset() {
    this.PostdetailsForm.reset();
    this.iseditmode = false;
    this.data_id = null;
  }

 onedit(Post_id: number) {
  // Find the selected post by ID
  this.postDataByid = this.allPostDetail.find(
    (f: any) => f.Post_id === Post_id
  );

  console.log("Edit Data:", this.postDataByid);

  if (!this.postDataByid) return;

  this.data_id = Post_id;
  this.iseditmode = true;

  // Load post types if not already loaded
  if (this.posttype.length === 0) {
    this.getposttype();
  }

  // Patch form values after slight delay to ensure form is ready
  setTimeout(() => {
    this.PostdetailsForm.patchValue({
      Post_name: this.postDataByid.Post_name,
      Post_name_hindi: this.postDataByid.Post_name_hindi,
      Post_short_name: this.postDataByid.Post_short_name,
      Post_Type_ID: this.postDataByid.Post_Type_ID,
      Post_leval: this.postDataByid.Post_leval,
      Display_order: this.postDataByid.Display_order,
      Is_hod: this.postDataByid.Is_hod,
    });

    // Scroll to form section
    const formSection = document.getElementById('postFormSection');
    formSection?.scrollIntoView({ behavior: 'smooth' });
  }, 200);
}
onupdate() {
  if (!this.data_id) return;

  if (this.PostdetailsForm.invalid) {
    Swal.fire('Please fill all required fields');
    return;
  }

  const updatedData = this.PostdetailsForm.value;

  this.ds.putData(`post/updatePost/${this.data_id}`, updatedData).subscribe({
    next: (result) => {
      Swal.fire('Data updated successfully');
      this.getTable();  // Refresh the list/table
      this.onReset();   // Clear the form and exit edit mode
    },
    error: (err) => {
      console.error('Update failed', err);
      Swal.fire('Update failed', '', 'error');
    },
  });
}


  ondelete(Post_id: number) {
    this.postDataByid = this.allPostDetail.find(
      (f: any) => f.Post_id === parseInt(Post_id as any)
    );

    if (!this.postDataByid) return;

    this.ds
      .Delete_Data('post/deletePostByid/' + this.postDataByid.Post_id)
      .subscribe((result: any) => {
        Swal.fire('Data Deleted...');
        this.getTable();
      });
  }
}
