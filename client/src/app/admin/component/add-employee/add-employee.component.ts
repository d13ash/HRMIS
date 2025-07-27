import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
// import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
// import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import * as XLSX from 'xlsx';
import { DataService } from '../../../services/data.service';
import { environment } from '../../../../environments/environment';

// DataService
// environment

interface Salutation {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent implements OnInit {
  passwordsMatching = false;
  isConfirmPasswordDirty = false;
  confirmPasswordClass = 'form-control';
  Salutation_E = new FormControl(null, Validators.required);
  Emp_First_Name_E = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[A-Za-z ]+$/),
  ]);

  Emp_Middle_Name_E = new FormControl(''); // Optional, no validation

  Emp_Last_Name_E = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[A-Za-z ]+$/),
  ]);

  Mobile_No = new FormControl(null, [
    Validators.required,
    Validators.pattern(/^[6-9]\d{9}$/),
  ]);
  Email_Id = new FormControl(null, [Validators.required, Validators.email]);
  Post_id = new FormControl(null, Validators.required);
  password = new FormControl(null, [
    Validators.required,
    Validators.pattern(/^.{6,}$/), // At least 6 characters, any type
  ]);

  Confirm_Password = new FormControl(null, [
    Validators.required,
    Validators.pattern(/^.{6,}$/),
  ]);

  data: any;
  submitted: boolean = false;
  Emp_Id: any;
  displayedColumns = [
    'Emp_Id',
    'User Id',
    'Name',
    'Department',
    'Mobile',
    'Action',
  ];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) MatSort!: MatSort;
  alluserdetail: any;
  EmployeeDataByid: any;
  postdata: any;
  showForm: boolean = false; // Control form visibility
  iseditmode: boolean = false; // Track edit mode

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private router: Router,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef
  ) {}
  RegistationForm!: FormGroup;
  Registationpass!: FormGroup;
  public passwordKey: any = environment.PASSWORD_SECRET_KEY;
  ngOnInit(): void {
    this.createForm();
    this.createForms();
    this.getTable();
    this.getPostdata();
    this.getSalutations();
  }
  createForm() {
    this.RegistationForm = this.fb.group({
      Salutation_E: this.Salutation_E,
      Emp_First_Name_E: this.Emp_First_Name_E,
      Emp_Middle_Name_E: this.Emp_Middle_Name_E,
      Emp_Last_Name_E: this.Emp_Last_Name_E,
      Mobile_No: this.Mobile_No,
      Email_Id: this.Email_Id,
      Post_id: this.Post_id,
      // Password: this.Password,
      // Confirm_Password: this.Confirm_Password,
    });
  }

  onInputChange(controlName: string): void {
    const control = this.RegistationForm.get(controlName);
    if (control) {
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity({ onlySelf: true });
    }
  }

  createForms() {
    this.Registationpass = this.fb.group({
      Emp_Id: [{ value: '' }], // Set initial value to empty and disable the input
      email: [{ value: '' }], // Set initial value to empty and disable the input
      password: this.password,
      Confirm_Password: this.Confirm_Password,
    });
  }

  async onSubmit() {
    this.submitted = true;

    // Mark all controls as touched to trigger validation UI
    this.RegistationForm.markAllAsTouched();
    this.Registationpass.markAllAsTouched();

    // Check if either form is invalid
    if (this.RegistationForm.invalid || this.Registationpass.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly.',
      }).then(() => {
        // After alert closes, remove red dirty error states
        this.onReset();
      });
      return; // Stop form submission
    }

    try {
      const response1 = await this.ds
        .postData('Employee_Data/empdetailsadd', this.RegistationForm.value)
        .toPromise();
      this.Emp_Id = response1;

      console.log('ID:', this.Emp_Id.id); // Log the ID to the console
      console.log('Email:', this.Emp_Id.email); //
      this.Registationpass.patchValue({ Emp_Id: this.Emp_Id.id });
      this.Registationpass.patchValue({ email: this.Emp_Id.email });

      const password = CryptoJS.AES.encrypt(
        this.Registationpass.value.password,
        this.passwordKey
      );
      this.Registationpass.patchValue({ password: `${password}` });

      const response2 = await this.ds
        .postData('Employee_data/user/addlogin', {
          Emp_Id: this.Registationpass.value.Emp_Id,
          password: this.Registationpass.value.password,
          email: this.Registationpass.value.email,
        })
        .toPromise();

      console.log(response2);
      Swal.fire('Data Saved successfully');
      this.getTable();
      this.onReset();
      this.hideForm(); // Hide form after successful submission
    } catch (error) {
      console.error('Error', error);
    }
  }

  onReset() {
    // Reset all controls to pristine and untouched to clear red borders
    Object.values(this.RegistationForm.controls).forEach((control) => {
      control.markAsPristine();
      control.markAsUntouched();
      control.updateValueAndValidity();
    });

    Object.values(this.Registationpass.controls).forEach((control) => {
      control.markAsPristine();
      control.markAsUntouched();
      control.updateValueAndValidity();
    });

    this.passwordsMatching = false;
    this.isConfirmPasswordDirty = false;
    this.confirmPasswordClass = 'form-control';

    this.cdRef.detectChanges();
  }

  getTable() {
    this.ds.getData('Employee_data/allempdetails').subscribe((result: any) => {
      this.alluserdetail = result;
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.MatSort;
      console.log(result);
      if (result && result.length > 0) {
        let pass = 'U2FsdGVkX1+JlC/V7nil0GBx8wgvQTF8g6k8ofbIgAs=';
        let passwordKey = '08t16e502526fesanfjh8nasd2'; // Replace with your actual password secret key
        let passwordDncyt = CryptoJS.AES.decrypt(pass, passwordKey).toString(
          CryptoJS.enc.Utf8
        );
        console.log('Decrypted Password:', passwordDncyt);
        console.log(result[0].password); // Access password at index 0
      }
    });
  }

  ondelete(Emp_ID: any) {
    this.EmployeeDataByid = this.alluserdetail.find(
      (f: any) => f.Emp_ID === parseInt(Emp_ID)
    ); //here we matching and extracting the selected id
    console.log(this.EmployeeDataByid.Emp_ID);
    // this.data_id = Emp_Id;
    this.ds
      .Delete_Data('Employee_data/deletedByid/' + this.EmployeeDataByid.Emp_ID)
      .subscribe((result: any) => {
        console.log(result);
        this.data = result;

        if (this.data) {
          Swal.fire('Data Deleted...');
        }
        this.getTable();
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  checkPasswords(pw: string, cpw: string) {
    this.isConfirmPasswordDirty = true;
    if (pw == cpw) {
      this.passwordsMatching = true;
      this.confirmPasswordClass = 'form-control is-valid';
    } else {
      this.passwordsMatching = false;
      this.confirmPasswordClass = 'form-control is-invalid';
    }
  }

  SalutationList: Salutation[] = [];

  openDialog(empId: any): void {
    console.log(empId);

    const dialogRef = this.dialog.open(ForgotPasswordComponent, {
      data: { empId: empId }, // Dialog configuration options
    });
  }

  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.alluserdetail);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'All_Department_Report.xlsx');
  }

  getPostdata() {
    this.ds.getData('Employee_data/postdata').subscribe((res) => {
      this.postdata = res;
    });
  }

  getSalutations() {
    this.ds.getData('Employee_data/sal/salutations').subscribe((res: any) => {
      this.SalutationList = res.map((item: any) => ({
        value: item.Id,
        viewValue: item.Salutation_Name,
      }));
    });
  }

  // Clear form data
  onClear() {
    this.onReset();
  }

  // Show the add employee form
  showAddForm() {
    this.showForm = true;
    this.iseditmode = false;
    this.onReset(); // Clear any existing data
  }

  // Hide the form
  hideForm() {
    this.showForm = false;
    this.iseditmode = false;
    this.onReset(); // Clear form data when hiding
  }
}
