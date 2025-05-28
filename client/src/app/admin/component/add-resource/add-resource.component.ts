import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
// import { DataService } from '../../../services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { DataService } from '../../../services/data.service';

// DataService
const today = new Date();
const date = today.getDate();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.scss'],
})
export class AddResourceComponent implements OnInit {
  displayedColumns = [
    'Purchase_id',
    'Purchase_name',
    'Purchase_order_no',
    'agency',
    'bill_date',
    'Action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) MatSort!: MatSort;

  resource_stock_entryform!: FormGroup;
  userlist: any[] = [];
  userno: any;
  id: any;
  val1: any = '';
  val2: any = '';
  val3: any = '';
  val4: any = '';
  quantity: any = '';
  total: any = '';
  hide: boolean = false;
  cat: any;
  sub: any;
  item_id: any;
  item_name: any;
  deptType: any;
  item_category: any;
  item_info: any;
  Block: any;
  event: any;
  iseditmode: boolean = false;
  subcategory: any;
  District: any;
  subcategory_item: any;
  item: any;
  data: any;
  datePipe: any;
  allDepartmentDetail: any;
  images: any;
  imageurl: any;
  uploadedimage: any =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWq1fCF7KbKYum0PRRMGKnq4EBj-QT_bcSLhLsIphPeQ&s;';
  rate: any;
  name1: any;
  show_item_details: boolean = false;
  show_view_details: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getTable();
    this.getcategory();
    this.stock_form();
  }

  stock_form() {
    this.resource_stock_entryform = this.fb.group({
      purchase_order_no: [null, Validators.required],
      purachase_name: [null, Validators.required],
      agency: [null, Validators.required],
      bill_no: [null, Validators.required],
      entrydate: [new Date()],
      amount:[
        null,
        [
          Validators.required,
          Validators.pattern(/^\d+$/), // only positive integers
        ],
      ],
      bill_date: [new Date(year, month, date), Validators.required],
      category_id: [null, Validators.required],
      subcategory_id: [null, Validators.required],
      bill_attachment: [null, Validators.required],
      stock_type: [null, Validators.required],
    });
  }

  getitem_name() {
    this.cat = this.resource_stock_entryform.get('category_id')?.value;
    this.sub = this.resource_stock_entryform.get('subcategory_id')?.value;
    this.ds
      .getData(
        `resource_stock_entry/getstock_subcategory/` +
          this.cat +
          `/` +
          this.sub +
          `/` +
          this.item_id
      )
      .subscribe((res) => {
        this.item_name = res;

        console.log(this.item_category);
        this.name1 = this.item_name[0].name;
        console.log(this.name1);
      });
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

  onChange_item(sub_category_id: any) {
    this.ds
      .getData('resource_stock_entry/getitem/' + sub_category_id)
      .subscribe((res) => {
        this.item = res;
        console.log(this.item);
      });
  }

  onChange_quantity(event: any) {
    this.rate = (<HTMLInputElement>document.getElementById('rate')).value;

    const newValue = event.target?.value;
    this.quantity = newValue;
    this.total = this.rate * newValue;
  }

  logSelectedValue(selectedValue: any) {
    this.item_id = selectedValue;
    this.getitem_name();
  }

  onChangeitem() {
    this.hide = true;
  }

  onclick1(
    name: any,
    desc: any,
    rate: any,
    quant: any,
    amount: any,
    name1: any
  ) {
    this.userlist.push({ name, desc, rate, quant, amount, name1 });
    this.val1 = '';
    this.val2 = '';
    this.val4 = '';
    this.quantity = '';
    this.show_item_details = true;
  }

  onsubmit() {
    this.resource_stock_entryform.patchValue({
      // bill_date: this.datepipe.transform(this.resource_stock_entryform.get("Entry_Date")?.value, "yyyy-MM-dd"),
      bill_date: this.datepipe.transform(
        this.resource_stock_entryform.get('bill_date')?.value,
        'yyyy-MM-dd'
      ),
      entrydate: this.datepipe.transform(
        this.resource_stock_entryform.get('entrydate')?.value,
        'yyyy-MM-dd'
      ),
      bill_attachment: this.imageurl,
    }); //this will help to set the date format (for storing in database)
    console.log(this.resource_stock_entryform.value);

    this.ds
      .postData(
        'resource_stock_entry/post',
        this.resource_stock_entryform.value
      )
      .subscribe((res) => {
        this.data = res;
        if (this.data) {
          const body = {
            paramArray: this.userlist,
          };
          this.ds
            .postData(`resource_stock_entry/post1/` + this.data.id, body)
            .subscribe((res) => {
              this.data = res;
              if (this.data) alert('Data saved succesfully..');
            });
          this.getTable();
        }
      });
  }
  onClear() {
    this.resource_stock_entryform.reset();
  }
  onupdate() {}

  selectimage(event: any) {
    //here on selecting the image(event) this will check any images are present or not
    if (event.target.files.length > 0) {
      const file = event.target.files[0]; //it is used to get the input file dom property
      this.images = file;
      console.log(this.images);

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
      .postData('resource_stock_entry/uploadfile', formData)
      .subscribe((result: any) => {
        console.log(result['profile_url']);
        this.imageurl = result['profile_url'];
        Swal.fire('image uploaded successfully');
        this.iseditmode = false;
      });
  }
  nopath() {
    Swal.fire('please select a file');
  }

  getTable() {
    this.ds
      .getData('resource_stock_entry/showdata')
      .subscribe((result: any) => {
        this.allDepartmentDetail = result;
        console.log(this.allDepartmentDetail);

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

  onview(id: any) {
    {
      this.ds
        .getData('resource_stock_entry/showdata1/' + id)
        .subscribe((res) => {
          this.item_info = res;
          console.log(this.item_category);
          this.show_view_details = true;
        });
    }
  }
}
