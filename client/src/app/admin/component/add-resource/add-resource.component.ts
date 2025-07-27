import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { DataService } from '../../../services/data.service';
import { ArgumentOutOfRangeError } from 'rxjs';

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
  @ViewChild('fileInput', { static: false }) fileInput: any;
  selectID: any;
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
  sort: any;
  iseditmode: boolean = false;
  subcategory: any;
  District: any;
  subcategory_item: any;
  item: any;
  data: any;
  datePipe: any;
  editItemId: any;
  purchase_idmessage = 'purchase_id';
  purchase_namemessage = 'purchase_name';
  allDepartmentDetail: any;
  images: any;
  imageurl: any;
  uploadedimage: any =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWq1fCF7KbKYum0PRRMGKnq4EBj-QT_bcSLhLsIphPeQ&s;';
  rate: any;
  name1: any;
  show_item_details: boolean = false;
  show_view_details: boolean = false;
  resource_unit: any[] = [];
  // Remove selectedUnitId property if present
  // Use only Unit_ID form control

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.resource_stock_entryform = this.fb.group({
      purchase_order_no: new FormControl('', [Validators.required]),
      purachase_name: [
        null,
        [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
      ],
      agency: [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      bill_no: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      entrydate: [new Date()],
      amount: [
        null,
        [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)],
      ],
      bill_date: [null, Validators.required],
      category_id: [null, Validators.required],
      subcategory_id: [null, Validators.required],
      bill_attachment: [null, Validators.required],
      stock_type: [null, Validators.required],
      rate: [null, Validators.required],
      quantity: [null, Validators.required],
      total_amount: ['', Validators.required],
      item_id: [null, Validators.required],
      product_Description: ['', Validators.required],
      Unit_ID: [null,Validators.required]
    });
    this.getTable();
    this.getcategory();
    this.getUnits();
  }

  getUnits() {
    this.ds.getData('resource_stock_entry/getallunit').subscribe((res) => {
      this.resource_unit = res;
    });
  }

  nopath() {
    Swal.fire({
      title: 'No Image Selected',
      text: 'Please select an image to upload.',
      icon: 'warning',
      confirmButtonText: 'OK',
    });
  }

  submitfile() {
    if (!this.images) {
      return this.nopath();
    }
    const formData = new FormData();
    formData.append('Logo_Path', this.images);
    this.ds
      .postData('resource_stock_entry/uploadfile', formData)
      .subscribe((result: any) => {
        this.imageurl = result['profile_url'];
        this.resource_stock_entryform.patchValue({
          bill_attachment: this.imageurl,
        });
        Swal.fire({
          icon: 'success',
          title: 'done',
          text: 'Upload succesfully !!',
        });
        this.iseditmode = false;
        const selectedCategory =
          this.resource_stock_entryform.get('category_id')?.value;
        if (selectedCategory) {
          this.onChangeSub_Category(selectedCategory);
        }
      });
  }

  onedit(item_id: number) {
    this.selectID = item_id;
    this.ds
      .getData(`resource_stock_entry/getitem/${item_id}`)
      .subscribe((result: any) => {
        const data = Array.isArray(result) ? result[0] : result;
        if (!data) {
          alert('No data returned from API!');
          return;
        }
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
          bill_attachment: data.bill_attachment,
          stock_type: data.stock_type,

          product_Description: data.product_Description,
        });
        this.iseditmode = true;
        this.editItemId = item_id;
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      });
  }

  scrollToBottom() {
    document
      .getElementById('inventryentry')
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  positiveNumberValidator(control: FormControl) {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null; // Let required validator handle empty case
    }
    return isNaN(value) || Number(value) <= 0 ? { positiveNumber: true } : null;
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
        this.name1 = this.item_name[0].name;
      });
  }

  getcategory() {
    this.ds
      .getData('resource_stock_entry/getstock_category')
      .subscribe((res) => {
        this.item_category = res;
      });
  }

  onChangeSub_Category(category_id: any) {
    this.ds
      .getData('resource_stock_entry/getstock_subcategory/' + category_id)
      .subscribe((res) => {
        this.subcategory = res;
      });
  }

  onChange_item(sub_category_id: any) {
    this.ds
      .getData('resource_stock_entry/getitem/' + sub_category_id)
      .subscribe((res) => {
        this.item = res;
      });
  }

  ondelete(item_id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this entry!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ds
          .Delete_Data(`resource_stock_entry/delete/` + item_id)
          .subscribe(() => {
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
    this.resource_stock_entryform.patchValue({
      total_amount: this.total,
    });
  }

  logSelectedValue(selectedValue: any) {
    this.item_id = selectedValue;
    this.getitem_name();
  }

  onChangeitem() {
    this.hide = true;
  }

  // Auto-fill main product_Description with first item's desc if empty
  onclick1(
    name: any,
    desc: any,
    rate: any,
    quant: any,
    amount: any,
    name1: any
  ) {
    const unitId = this.resource_stock_entryform.get('Unit_ID')?.value;
    const unitName = this.resource_unit.find(u => u.Unit_ID === unitId)?.Unit_Name || '';
    this.userlist.push({
      name,
      desc,
      rate,
      quant,
      amount,
      name1,
      Unit_ID: unitId,
      unit_name: unitName
    });

    // <-- Add this block to update form control when adding first item
    if (
      !this.resource_stock_entryform.get('product_Description')?.value &&
      desc
    ) {
      this.resource_stock_entryform.patchValue({ product_Description: desc });
    }

    this.val1 = '';
    this.val2 = '';
    this.val4 = '';
    this.quantity = '';
    this.show_item_details = true;
  }

  // onsubmit() {
  //   if (this.resource_stock_entryform.invalid) {
  //     this.resource_stock_entryform.markAllAsTouched(); // 👈 This will trigger mat-error display
  //     return;

  //     // your form submission logic here
  //   }

  //   this.resource_stock_entryform.patchValue({
  //     bill_date: this.datepipe.transform(
  //       this.resource_stock_entryform.get('bill_date')?.value,
  //       'yyyy-MM-dd'
  //     ),
  //     entrydate: this.datepipe.transform(
  //       this.resource_stock_entryform.get('entrydate')?.value,
  //       'yyyy-MM-dd'
  //     ),
  //     bill_attachment: this.imageurl,
  //   });
  //   this.ds
  //     .postData(
  //       'resource_stock_entry/post',
  //       this.resource_stock_entryform.value
  //     )
  //     .subscribe(
  //       (res) => {
  //         this.data = res;
  //         if (this.data) {
  //           Swal.fire({
  //             title: 'Success!',
  //             text: 'Data saved successfully.',
  //             icon: 'success',
  //             confirmButtonText: 'OK',
  //           });
  //           this.getTable();
  //           console.log('success', this.data);
  //           const body = {
  //             paramArray: this.userlist,
  //           };
  //         }
  //       },
  //       (error) => {
  //         Swal.fire({
  //           title: 'Error!',
  //           text: 'Failed to save main data.',
  //           icon: 'error',
  //           confirmButtonText: 'OK',
  //         });
  //       }
  //     );
  // }

    onsubmit() {
    // Auto-fill product_Description from first item if empty
    if (
      !this.resource_stock_entryform.get('product_Description')?.value &&
      this.userlist.length > 0 &&
      this.userlist[0].desc
    ) {
      this.resource_stock_entryform.patchValue({ product_Description: this.userlist[0].desc });
    }

    // Check if the form is invalid
    if (this.resource_stock_entryform.invalid) {
      this.resource_stock_entryform.markAllAsTouched();
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill all required fields correctly.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      for (const fieldName in (this.resource_stock_entryform as FormGroup).controls) {
        const control = this.resource_stock_entryform.controls[fieldName];
        if (control && control.errors) {
          console.warn(`Field '${fieldName}' has errors:`, control.errors);
        }
      }
      console.log(this.resource_stock_entryform.value);
      return;
    }

    // Format dates before submission
    this.resource_stock_entryform.patchValue({
      bill_date: this.datepipe.transform(this.resource_stock_entryform.get('bill_date')?.value, 'yyyy-MM-dd'),
      entrydate: this.datepipe.transform(this.resource_stock_entryform.get('entrydate')?.value, 'yyyy-MM-dd'),
      bill_attachment: this.imageurl,
    });

    // Submit the main form data
    this.ds.postData('resource_stock_entry/post', this.resource_stock_entryform.value).subscribe(
      (res) => {
        this.data = res;
        if (this.data) {
          const body = {
            paramArray: this.userlist,
          };

          // Submit the related data
          this.ds.postData(`resource_stock_entry/post1/` + this.data.id, body).subscribe(
            (res2) => {
              if (res2) {
                Swal.fire({
                  title: 'Success!',
                  text: 'Data saved successfully.',
                  icon: 'success',
                  confirmButtonText: 'OK',
                }).then(() => {
                  this.getTable();
                  this.resource_stock_entryform.reset();
                  Object.keys(this.resource_stock_entryform.controls).forEach((key) => {
                    this.resource_stock_entryform.get(key)?.setErrors(null);
                    this.resource_stock_entryform.get(key)?.markAsPristine();
                    this.resource_stock_entryform.get(key)?.markAsUntouched();
                  });
                  this.iseditmode = false;
                  this.editItemId = null;
                  this.uploadedimage = '';
                  this.show_item_details = false;
                  this.show_view_details = false;
                  this.userlist = [];
                  this.item_info = [];
                });
              }
            },
            (error) => {
              Swal.fire({
                title: 'Error!',
                text: 'Failed to save related data.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            }
          );
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to save main data.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }




  onClear() {
    this.resource_stock_entryform.reset();
    this.resource_stock_entryform.patchValue({
      purchase_order_no: '',
      purachase_name: '',
      agency: '',
      bill_no: '',
      entrydate: new Date(),
      amount: '',
      bill_date: new Date(year, month, date),
      category_id: null,
      subcategory_id: null,
      Payment_Receipt: null,
      stock_type: null,
      product_Description: '',
    });
    this.resource_stock_entryform.reset();
    this.iseditmode = false;
    this.editItemId = null;
    this.uploadedimage = '';
    this.show_item_details = false;
    this.show_view_details = false;
    this.userlist = [];
    this.item_info = [];
    this.fileInput.nativeElement.value = '';
  }

  onupdate() {
    if (this.selectID) {
      this.ds
        .putData(
          'resource_stock_entry/update/' + this.selectID,
          this.resource_stock_entryform.value
        )
        .subscribe((result) => {
          if (result) {
            Swal.fire('Data updated successfully');
            this.getTable();
            this.onClear();
          }
        });
    }
  }

  selectimage(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      // Check if the file size is less than or equal to 100KB (100 * 1024 bytes)
      if (file.size <= 100 * 1024) {
        this.images = file;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event: any) => {
          this.uploadedimage = event.target.result;
        };
      } else {
        // Handle file size error
        Swal.fire({
          icon: 'error',
          title: 'File too large',
          text: 'Please select an image smaller than or equal to 100KB.',
        });
        event.target.value = ''; // Clear the input
        this.images = null;
        this.uploadedimage = null;
      }
    }
  }

  getTable() {
    this.ds
      .getData('resource_stock_entry/showdata')
      .subscribe((result: any) => {
        this.allDepartmentDetail = result;
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.MatSort;
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onview(id: any) {
    this.ds.getData('resource_stock_entry/showdata1/' + id).subscribe((res) => {
      this.item_info = res;
      this.show_view_details = true;
    });
  }

  allowOnlyLetters(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }
}
