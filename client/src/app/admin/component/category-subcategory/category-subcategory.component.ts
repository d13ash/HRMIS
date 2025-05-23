import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { DataService } from 'src/app/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DataService } from '../../../services/data.service';
// import { DatePipe } from '@angular/common';

// DataService
@Component({
  selector: 'app-category-subcategory',
  templateUrl: './category-subcategory.component.html',
  styleUrls: ['./category-subcategory.component.scss'],
})
export class CategorySubcategoryComponent implements OnInit {
  displayedColumns = [
    'Item_ID',
    'Category_Name',
    'Sub_Category_Name',
    'item_name',
    'Item_Discription',
    'Action',
  ];
  dataSource!: MatTableDataSource<any>;

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

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.getcategory();
    this.getTable();
    this.addcategoryform = this.fb.group({
      category_name: [null, Validators.required],
      Description: [null, Validators.required],
    });

    this.addsubcategoryform = this.fb.group({
      category_id: [null, Validators.required],
      Sub_category_name: [null, Validators.required],
      Description: [null, Validators.required],
    });

    this.additemform = this.fb.group({
      category_id: [null, Validators.required],
      sub_category_id: [null, Validators.required],
      item_name: [null, Validators.required],
      Description: [null, Validators.required],
    });
  }

  onSubmitcategory() {
    this.ds
      .postData('category_subcategory/addcategory', this.addcategoryform.value)
      .subscribe((res) => {
        this.data = res;
        if (this.data) {
          Swal.fire('Data Saved successfully');
        }
        this.getcategory();
        this.getTable();
        this.onClears();
      });
  }

  onClears() {
    this.addcategoryform.reset();
  }

  onSubmitsubcategory() {
    console.log(this.addsubcategoryform.value);
    this.ds
      .postData(
        'category_subcategory/addsubcategory',
        this.addsubcategoryform.value
      )
      .subscribe((res) => {
        this.data = res;
        if (this.data) {
          Swal.fire('Data Saved successfully');
        }
        this.onChangeSub_Category(this.addsubcategoryform.value.category_id);
        this.getTable();
        this.ondeletes();
        this.onClearr();
      });
  }
  onClearr() {
    this.addsubcategoryform.reset();
  }
  ondeletes() {
    this.addcategoryform.reset();
  }
  // this is scroll function
  scrollToBottom() {
    document
      .getElementById('endOfPage')
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  getcategory() {
    this.ds
      .getData('resource_stock_entry/getstock_category')
      .subscribe((res) => {
        this.item_category = res;
        console.log(this.item_category);
      });
  }

  onChangeSub_Category(category_id: any) {
    this.ds
      .getData('resource_stock_entry/getstock_subcategory/' + category_id)
      .subscribe((res) => {
        this.subcategory = res;
        console.log(this.subcategory);
      });
  }

  onSubmit() {
    // console.log(this.additemform.value);
    this.ds
      .postData('category_subcategory/additem', this.additemform.value)
      .subscribe((res) => {
        this.data = res;
        if (this.data) {
          Swal.fire('Data Saved successfully');
        }
        this.getTable();
        this.onClear();
      });
  }

  onClear() {
    this.additemform.reset();
  }

  getTable() {
    this.ds.getData('category_subcategory/allitem').subscribe((result: any) => {
      this.allitem = result;
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.MatSort;
      console.log(result);
    });
  }

  onedit(item_id: any) {
    this.itemDataByid = this.allitem.find(
      (f: any) => f.item_id === parseInt(item_id)
    );
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
    this.iseditmode = true;
  }

  // Update

  onupdate() {
    console.log(this.additemform.value);
    this.ds
      .putData(
        'category_subcategory/updateallitem/' + this.data_id,
        this.additemform.value
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
  }

  // Delete Department detail
  ondelete(item_id: any) {
    console.log(item_id);
    this.allitem = this.allitem.find(
      (f: any) => f.item_id === parseInt(item_id)
    ); //here we matching and extracting the selected id
    this.ds
      .Delete_Data('category_subcategory/deletedByid/' + this.allitem.item_id)
      .subscribe((result: any) => {
        console.log(result);
        this.data = result;
        if (this.data) {
          Swal.fire('Data Deleted...');
        }
        this.getTable();
      });
  }
  // mat Table filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
