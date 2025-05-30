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
import { producerNotifyConsumers } from '@angular/core/primitives/signals';

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


  selectID:any;
  selectDetail: any;

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
  sort:any;
  iseditmode: boolean = false;
  subcategory: any;
  District: any;
  subcategory_item: any;
  item: any;
  data: any;
  datePipe: any;
  editItemId :any;
purchase_idmessage ="purchase_id";
purchase_namemessage ="purchase_name";
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
   // purchase_order_no: new FormControl(null, [Validators.required,Validators.pattern(/^\d{10}$/)]),
      purchase_order_no: new FormControl('',[Validators.required]),
   purchase_name: [null,[
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(200),
      Validators.pattern(/^[a-zA-Z ]+$/) // only letters and spaces
    ]],

    agency: [null,[ 
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(200),
      Validators.pattern(/^[a-zA-Z ]+$/) // only letters and spaces
    ]],
    bill_no: [null, [Validators.required, this.positiveNumberValidator.bind(this)]],
    entrydate: [new Date()],
    amount:[null, [Validators.required, this.positiveNumberValidator.bind(this)]],
    bill_date: [new Date(year, month, date), Validators.required],
    category_id: [null, Validators.required],
    subcategory_id: [null, Validators.required],
    bill_attachment: [null, Validators.required],
    stock_type: [null, Validators.required],
   product_Description: [
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
ngAfterViewInit() {
  this.dataSource.sort = this.sort;
}

// Add this method to your component TypeScript file (e.g., add-resource.component.ts)
allowOnlyLetters(event: KeyboardEvent) {
  const charCode = event.key.charCodeAt(0);
  // Allow: a-z, A-Z, space, and backspace
  if (
    (charCode >= 65 && charCode <= 90) || // A-Z
    (charCode >= 97 && charCode <= 122) || // a-z
    charCode === 32 // space
  ) {
    return;
  } else {
    event.preventDefault();
  }
}
allowOnlyNumbers(event: KeyboardEvent): void {
  const charCode = event.key.charCodeAt(0);
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}

//   scrollToBottom() {
//   window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
// }
scrollToBottom() {
    document.getElementById("inventryentry")?.scrollIntoView({ behavior: 'smooth' })
  }



  positiveNumberValidator(control: FormControl) {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null; // Let required validator handle empty case
    }
    return isNaN(value) || Number(value) <= 0
      ? { positiveNumber: true }
      : null;
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
onedit(item_id: number) {
  this.selectID = item_id;
  this.ds.getData(`resource_stock_entry/getitem/${item_id}`).subscribe((result: any) => {
    console.log('Edit API result:', result);

    // If API returns an array, use the first element; otherwise, use the object directly
    const data = Array.isArray(result) ? result[0] : result;
    if (!data) {
      alert('No data returned from API!');
      return;
    }

    // Log all keys and values for debugging
    Object.keys(data).forEach(key => {
      console.log(key, ':', data[key]);
    });

    // Patch form values (ensure keys match your form controls)
    this.resource_stock_entryform.patchValue({
      purchase_order_no: data.purchase_order_no,
      purachase_name: data.purachase_name,
      agency: data.agency,
      bill_no: data.bill_no,
      entrydate: data.entrydate ? new Date(data.entrydate) : null,
      amount: data.amount,
      bill_date: data.bill_date ? new Date(data.bill_date) : null,
      category_id: data.category_id,
      subcategory_id: data.subcategory_id,
      bill_attachment: data.bill_attachment, // add this if you want to fill the attachment field
      stock_type: data.stock_type
    });

    this.iseditmode = true;
    this.editItemId = item_id;

    // Scroll to the top of the page or to the form
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Or, if you want to scroll to a specific form element:
      // this.resourceForm?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  });
}// onupdate() {
    //  // console.log(this.additemform.value);
    //   this.ds.putData('category_subcategory/updateallitem/' + this.selectID, this.resource_stock_entryform.value).subscribe((result) => {
    //     console.log(result);
    //     this.data = result
    //     if (this.data) { Swal.fire("data updated successfully") };
    //     this.getTable();
    //     this.onClear();
    //   })
    //   this.iseditmode = false;
    // }

  // Delete item
  ondelete(item_id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this entry!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ds.Delete_Data(`resource_stock_entry/delete/`+item_id).subscribe(() => {
          Swal.fire('Deleted!', 'Your entry has been deleted.', 'success');
          this.getTable();
        });
      }
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
  // Check if the form is invalid
  if (this.resource_stock_entryform.invalid) {
    // Mark all controls as touched to trigger validation messages
    this.resource_stock_entryform.markAllAsTouched();

    // Display validation error alert
    Swal.fire({
      title: ' validation Error',
      text: 'Please fill all required fields correctly.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return;
  }

  // Format dates before submission
  this.resource_stock_entryform.patchValue({
    bill_date: this.datepipe.transform(this.resource_stock_entryform.get("bill_date")?.value, "yyyy-MM-dd"),
    entrydate: this.datepipe.transform(this.resource_stock_entryform.get("entrydate")?.value, "yyyy-MM-dd"),
    bill_attachment: this.imageurl
  });

  // Submit the main form data
  this.ds.postData('resource_stock_entry/post', this.resource_stock_entryform.value).subscribe(
    res => {
      this.data = res;
      if (this.data) {
        const body = {
          paramArray: this.userlist
        };

        // Submit the related data
        this.ds.postData(`resource_stock_entry/post1/` + this.data.id, body).subscribe(
          res2 => {
            if (res2) {
              // Display success alert
              Swal.fire({
                title: 'Success!',
                text: 'Data saved successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                // Refresh the table or perform any other necessary actions
                this.getTable();
              });
            }
          },
          error => {
            // Display error alert for related data saving failure
            Swal.fire({
              title: 'Error!',
              text: 'Failed to save related data.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      }
    },
    error => {
      // Display error alert for main data saving failure
      Swal.fire({
        title: 'Error!',
        text: 'Failed to save main data.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  );
}



  onClear() {
  this.resource_stock_entryform.reset();   // Clear the form
  this.iseditmode = false;                 // Exit edit mode if needed
  this.editItemId = null;                  // Clear edit id if used
  this.uploadedimage = '';                 // Clear uploaded image if any
  this.show_item_details = false;          // Hide Stock Entry Details section
  this.show_view_details = false;          // Hide View Detail section
  this.userlist = [];                      // Clear the Stock Entry Details table
  this.item_info = [];                     // Clear the View Detail table
}
  
onupdate() {
  if (this.selectID) {
    this.ds.putData('resource_stock_entry/update/' + this.selectID, this.resource_stock_entryform.value).subscribe((result) => {
      if (result) {
        Swal.fire("Data updated successfully");
        this.getTable();         // Refresh the table data
        this.onClear();          // Clear the form and exit edit mode
      }
    });
  }
}


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
