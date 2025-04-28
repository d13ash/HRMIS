import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { DataService } from '../../../services/data.service';
// import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

// import CryproJS from 'crypto-js';
import Swal from 'sweetalert2';
// import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';


// DataService, AuthService, environment
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  constructor(private http:HttpClient,private fb: FormBuilder, private ds: DataService, private AS: AuthService, private router: Router) { }

  loginForm!: FormGroup;
  @ViewChild('captchaContainer', { static: false }) dataContainer!: ElementRef;
  // public apiRootUrl: any = environment.api;
  public captchaKey: any = environment.CAPTCHA_SECRET_KEY;
  public passwordKey: any = environment.PASSWORD_SECRET_KEY;
  public txtCaptcha: any = '';
  public generatedCaptcha: any = "";
  public Emp_Id: any = '';
  //subs = new SubSink();

  ngOnInit(): void {
    this.createForm();
    this.getCaptcha();
  }

  createForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      captcha: ['', Validators.required]
    });
  }
  
  getCaptcha() {
    this.ds.getData('captcha').subscribe((res: any) => {
      //if (res.error === false) {
      this.dataContainer.nativeElement.innerHTML = res.data;
      this.generatedCaptcha = res.text;
      //}
    });
  }

  sendData() {
    this.AS.messageEmitter.emit({
      "role": this.AS.currentUser.role,
      "Emp_Id": this.AS.currentUser.Emp_Id, // Assuming 'username' represents the employee ID
    });
  }


  login() {
    if (this.loginForm.valid) {
      // this.Emp_Id = this.loginForm.value.Emp_Id;
      let txtCaptcha = this.generatedCaptcha;
      if (this.loginForm.value.captcha === txtCaptcha) {
        const password = CryptoJS.AES.encrypt(this.loginForm.value.password, this.passwordKey);
        this.loginForm.patchValue({ password: `${password}` });
        console.log("this.loginForm.value", this.loginForm.value);
        this.AS.userlogin(this.loginForm.value).subscribe(res => {
          if (res.success) {
            this.sendData();
            Swal.fire(res.message, "", "success");
            let role = this.AS.currentUser.role;
            this.Emp_Id = this.AS.currentUser.Emp_Id;
            console.log(this.Emp_Id);
            switch (role) {

              case 1: {
                this.router.navigate(['/admin']);
                break;
              }

              case 2: {
                this.router.navigate(['/hr']);
                break;
              }

              case 3: {
                this.router.navigate(['/employee']);
                break;
              }

              default: this.router.navigate(['/login'])
            }
          } else {
             {
              Swal.fire({ icon: 'error', text: "यूजर आईडी अथवा पासवर्ड गलत", timer: 1000 });
              this.getCaptcha()
              this.loginForm.reset();
            }

          }
        })
      }
      else {
        Swal.fire({ icon: 'error', text: "कृपया सही कैप्चा दर्ज करें |", timer: 1000 });

      }
     }

  }

}