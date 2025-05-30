import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-category-subcategory',
  templateUrl: './category-subcategory.component.html',
  styleUrls: ['./category-subcategory.component.scss'],
})
export class CategorySubcategoryComponent implements OnInit {
  displayedColumns = ['Item_ID', 'Category_Name', 'Sub_Category_Name', 'item_name', 'Item_Discription', 'Action'];

  dataSource!: MatTableDataSource<any>;
  submitted: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) MatSort!: MatSort;

  addcategoryform!: FormGroup;
  addsubcategoryform!: FormGroup;
  additemform!: FormGroup;

  item_category: any;
  subcategory: any;
  data: any;
  allitem: any;
  iseditmode: boolean = false;
  itemDataByid: any;
  data_id: any;

  constructor(private fb: FormBuilder, private ds: DataService, private elementRef: ElementRef) {}


  ngOnInit(): void {
    this.getcategory();
    this.getTable();
   this.addcategoryform = this.fb.group({
  category_name: [
     null,
    [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-Z]+$/) // only letters
    ]
  ],
  Description: [
    null,
    [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(200),
      Validators.pattern(/^[a-zA-Z ]+$/) // only letters and space (optional for readability)
    ]
  ]
});


    this.addsubcategoryform = this.fb.group({
  category_id: [null, Validators.required],
  Sub_category_name: [
    null,
    [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
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
  ]
});


    this.additemform = this.fb.group({
      category_id: [null, Validators.required],
      sub_category_id: [null, Validators.required],
      item_name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      Description: [
    null,
    [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(200),
      Validators.pattern(/^[a-zA-Z ]+$/) // only letters and spaces
    ]
  ]
});
 
  }

  onSubmitcategory() {
  if (this.addcategoryform.invalid) {
    this.addcategoryform.markAllAsTouched();
    Swal.fire({
      icon: 'error',
      title: 'validation Error',
      text: 'Please fill all required fields correctly.'
    });
    return;
  }

  this.ds.postData('category_subcategory/addcategory', this.addcategoryform.value).subscribe(res => {
    this.data = res;
    if (this.data) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Data saved successfully.'
      });
      this.getcategory();
      this.getTable();
      this.onClears();
    }
  });
}

  onClears() {
    this.addcategoryform.reset();
  }

 onSubmitsubcategory() {
  // Step 1: Check for form validity
  if (this.addsubcategoryform.invalid) {
    this.addsubcategoryform.markAllAsTouched();
    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: 'Please fill all required fields correctly.'
    });
    return;
  }

  // Step 2: Submit data to backend
  this.ds.postData('category_subcategory/addsubcategory', this.addsubcategoryform.value).subscribe({
    next: (res: any) => {
      console.log('API Response:', res); // For debugging

      // Check if response indicates success
      if (res) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.message || 'Data saved successfully.'
        });

        // Refresh UI data
        this.getcategory();
        this.getTable();
        this.onClears();
      } else {
        // Handle unexpected/failed response
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: res.message || 'Something went wrong while saving the data.'
        });
      }
    },
    error: (err) => {
      // Handle HTTP/API errors
      console.error('API Error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Failed to save data. Please try again later.'
      });
    }
  });
}




  ondeletes() {
    this.addcategoryform.reset();
  }

  scrollToBottom() {
    document.getElementById("AddCategory")?.scrollIntoView({ behavior: 'smooth' });
  }

  getcategory() {
    this.ds.getData('resource_stock_entry/getstock_category').subscribe(res => {
      this.item_category = res;
      console.log('category', this.item_category);
    });
  }

  onChangeSub_Category(category_id: any) {
    this.ds.getData('resource_stock_entry/getstock_subcategory/' + category_id).subscribe((res) => {
        this.subcategory = res;
        console.log(this.subcategory);
      });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.additemform.invalid) {
      this.additemform.markAllAsTouched();
      return;
    }

    this.ds.postData('category_subcategory/additem', this.additemform.value).subscribe(
      (res) => {
        if (res) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Data saved successfully.'
          });
          this.getcategory();
          this.getTable();
          this.onClear();
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while saving data.'
        });
      }
    );
  }


  onClear() {
    this.addcategoryform.reset();
    this.addsubcategoryform.reset();
    this.additemform.reset();
    this.iseditmode = false;
  }

  getTable() {
    this.ds.getData('category_subcategory/allitem').subscribe((result: any) => {
      this.allitem = result;
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.MatSort;
      console.log('table', this.allitem);

    });
  }

  onedit(item_id: any) {
    this.itemDataByid = this.allitem.find((f: any) => f.item_id === parseInt(item_id));

    console.log(this.itemDataByid);
    this.iseditmode = true;
    this.data_id = item_id;
    this.onChangeSub_Category(this.itemDataByid.category_id);
    this.additemform.patchValue({
      category_id: this.itemDataByid.category_id,
      sub_category_id: this.itemDataByid.sub_category_id,
      item_name: this.itemDataByid.item_name,
      Description: this.itemDataByid.Description,
    });

    this.addcategoryform.patchValue({
      category_name: this.itemDataByid.category_name,
      Description: this.itemDataByid.Description
    });
    this.addsubcategoryform.patchValue({
      category_id: this.itemDataByid.category_id,
      Sub_category_name: this.itemDataByid.sub_category_name,
      Description: this.itemDataByid.Description
    });
    this.iseditmode = true;
  }

  onupdate() {
    if (this.additemform.invalid) {
      this.additemform.markAllAsTouched();
      return;
    }

    this.ds.putData('category_subcategory/updateallitem/' + this.data_id, this.additemform.value).subscribe((result) => {
      console.log(result);
      this.data = result;
      if (this.data) { Swal.fire("Data updated successfully"); }
      this.getTable();
      this.onClear();
    });
    this.iseditmode = false;
  }

  ondelete(item_id: any) {
    console.log(item_id);
    this.allitem = this.allitem.find((f: any) => f.item_id === parseInt(item_id));
    this.ds.Delete_Data('category_subcategory/deletedByid/' + this.allitem.item_id).subscribe((result: any) => {
      console.log(result);
      this.data = result;
      if (this.data) { Swal.fire('Data Deleted...'); }
      this.getTable();
    });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
