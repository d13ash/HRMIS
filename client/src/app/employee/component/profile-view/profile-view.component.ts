import { Component, OnInit } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
// import { AuthService } from 'src/app/services/auth.service';

// AuthService

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {
  role: any;
  Emp_Id: any;
  roles: any = [];


  constructor(private AS: AuthService,private router:Router) {
    // console.log("emp_id in dashborad=",this.AS.Emp_Id)
  }


  ngOnInit() {
    console.log(this.AS.currentUser);
    // this.AS.getAactiveuserdata();
    // this.Full_name = this.AS.getAactiveuserdata().get('Emp_Detail')
    this.getAactiveuserdata();
  }

  getAactiveuserdata() {
    this.AS.getFunction('login/allEmplogin/' + this.AS.currentUser.Emp_Id).subscribe((res: any) => {
     this.roles = res;
     console.log(this.roles)
   });
 }





}
