import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import * as CryptoJs from 'crypto-js';
// import { environment } from 'src/environments/environment';
// import { DataService } from 'src/app/services/data.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { DataService } from '../../../services/data.service';
import { environment } from '../../../../environments/environment';

// AuthService
// DataService, environment

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  userData: any; //store token data
  data: any;
  alluserdetail: any;
  constructor(private fB: UntypedFormBuilder, private helper: JwtHelperService, private cm: AuthService, private AS: AuthService, private ds: DataService, @Inject(MAT_DIALOG_DATA) public userempid: any) {
    console.log(this.userempid);


    this.userData = this.userempid;

  }

  ngOnInit(): void {
    this.changepass = this.fB.group({
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]],
      confirmPassword: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]]
    });
    this.getTable();
  }

  //Change Password
  checkPassword: boolean = false;
  redIcon: boolean = false;
  greenIcon: boolean = false;

  changepass!: UntypedFormGroup

  changePassword() {
    if (this.changepass.valid) {
      var password = CryptoJs.AES.encrypt(this.changepass.get('password')?.value, environment.PASSWORD_SECRET_KEY).toString();
      this.changepass.patchValue({ password: `${password}` });
      console.log(password);

      // Remove confirmPassword from the form value before sending to the API
      const formValue = { ...this.changepass.value };
      delete formValue.confirmPassword;
      console.log('before', this.userData.empId);
      this.ds.putData('Employee_data/updatelogindata/' + this.userData.empId, formValue).subscribe((result) => {
        console.log(result);
        this.data = result;
        console.log('afterks', this.userData.empId);

        if (this.data) { Swal.fire("Data updated successfully"); }
      });
    }
  }


  matchPass(n: string, m: string) {
    if (n != m) this.redIcon = true;
    else this.redIcon = false;
    if (n == m) {
      this.greenIcon = true;
      this.checkPassword = true
    } else {
      this.greenIcon = false;
      this.checkPassword = false
    }
  }


  getTable() {
    this.ds.getData('Employee_data/allempdetails').subscribe((result: any) => {
      this.alluserdetail = result;
      console.log(result);

    });
  }

}