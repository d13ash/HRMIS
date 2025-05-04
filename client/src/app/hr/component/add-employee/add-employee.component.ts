import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
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
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  passwordsMatching = false;
  isConfirmPasswordDirty = false;
  confirmPasswordClass = 'form-control';
  Salutation_E = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.required,
  ]);
  Emp_First_Name_E = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.required,
  ]);
  Emp_Middle_Name_E = new FormControl(null,);
  Emp_Last_Name_E = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.required,
  ]);
  Mobile_No = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern("^((\\+91-?)|0)?[6789][0-9]{9}$"),
  ]);
  Email_Id = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
  ]);
  Post_id = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.required,
  ]);
  password = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern('^((?!.*[s])(?=.*[A-Z])(?=.*d).{8,99})'),
  ]);
  Confirm_Password = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern('^((?!.*[s])(?=.*[A-Z])(?=.*d).{8,99})'),
  ]);
  data: any;
  submitted: boolean = false;
  Emp_Id: any;
  displayedColumns = ['Emp_Id', 'User Id', 'Name', 'Department','Mobile', 'Action'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) MatSort!: MatSort;
  alluserdetail: any;
  EmployeeDataByid: any;
  postdata: any;

  constructor(private fb: FormBuilder, private ds: DataService, private router: Router,private dialog: MatDialog) { }
  RegistationForm!: FormGroup;
  Registationpass!: FormGroup;
  public passwordKey: any = environment.PASSWORD_SECRET_KEY;
  ngOnInit(): void {
    this.createForm();
    this.createForms();
    this.getTable();
    this.getPostdata();
  }
  createForm() {

    this.RegistationForm = this.fb.group({
      Salutation_E: this.Salutation_E,
      Emp_First_Name_E: this.Emp_First_Name_E,
      Emp_Middle_Name_E: this.Emp_Middle_Name_E,
      Emp_Last_Name_E: this.Emp_Last_Name_E,
      Mobile_No: this.Mobile_No,
      Email_Id: this.Email_Id,
      Post_id:this.Post_id
      // Password: this.Password,
      // Confirm_Password: this.Confirm_Password,

    });
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
    try {
      const response1 = await this.ds.postData('Employee_Data/empdetailsadd', this.RegistationForm.value).toPromise();
      this.Emp_Id = response1;
      
    console.log('ID:', this.Emp_Id.id); // Log the ID to the console
    console.log('Email:', this.Emp_Id.email); //
      this.Registationpass.patchValue({ Emp_Id: this.Emp_Id.id });
      this.Registationpass.patchValue({ email: this.Emp_Id.email });

      const password = CryptoJS.AES.encrypt(this.Registationpass.value.password, this.passwordKey);
      this.Registationpass.patchValue({ password: `${password}` });

      const response2 = await this.ds.postData('Employee_data/user/addlogin', {
        Emp_Id: this.Registationpass.value.Emp_Id,
        password: this.Registationpass.value.password,
        email:this.Registationpass.value.email
      }).toPromise();

      console.log(response2);
      Swal.fire("Data Saved successfully");
      this.getTable();
      this.onReset();
    } catch (error) {
      console.error('Error', error);
    }
  }

  onReset() {
    this.RegistationForm.reset();
    this.Registationpass.reset();
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
        let passwordDncyt = CryptoJS.AES.decrypt(pass, passwordKey).toString(CryptoJS.enc.Utf8);
        console.log('Decrypted Password:', passwordDncyt);
        console.log(result[0].password); // Access password at index 0
      }
    });
  }
  
  ondelete(Emp_ID: any){
    this.EmployeeDataByid = this.alluserdetail.find((f : any) => f.Emp_ID === parseInt(Emp_ID)); //here we matching and extracting the selected id
    console.log(this.EmployeeDataByid.Emp_ID);
    // this.data_id = Emp_Id;
    this.ds.Delete_Data('Employee_data/deletedByid/'+ this.EmployeeDataByid.Emp_ID,).subscribe((result:any)=>{
      console.log(result);
      this.data= result
  
      if(this.data)
      {Swal.fire('Data Deleted...')};
      this.getTable();
    })
  
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

  Salutation: Salutation[] = [

    { value: '1', viewValue: 'Mr.' },
    { value: '2', viewValue: 'Mrs.' },
    { value: '3', viewValue: 'Miss.' },
  ];


  openDialog(empId: any): void {
    console.log(empId);
    
    const dialogRef = this.dialog.open(ForgotPasswordComponent, {
      data: { empId: empId }  // Dialog configuration options
     

  });
}

ExportTOExcel() {
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.alluserdetail);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, 'All_Department_Report.xlsx');

 }

 getPostdata() {
  this.ds.getData('Employee_data/postdata').subscribe(res => {
    this.postdata = res;
  });
}

}