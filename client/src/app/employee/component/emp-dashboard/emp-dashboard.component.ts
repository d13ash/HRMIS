import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
// import { AuthService } from 'src/app/services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
// AuthService
@Component({
  selector: 'app-emp-dashboard',
  templateUrl: './emp-dashboard.component.html',
  styleUrls: ['./emp-dashboard.component.scss']
})
export class EmpDashboardComponent implements OnInit {
  role: any;
  Emp_Id: any;
  roles: any = [];


  isHandset$: Observable<boolean> | undefined;
  constructor(private breakpointObserver: BreakpointObserver,private AS: AuthService,private dialog: MatDialog,private router:Router) {
    // console.log("emp_id in dashborad=",this.AS.Emp_Id)
  }
  ngOnInit() {
    this.isHandset$  = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
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


 logout(): void {
   Swal.fire({
     title: 'Are you sure?',
     text: 'You will be logged out of the system.',
     icon: 'warning',
     showCancelButton: true,
     confirmButtonColor: '#3085d6',
     cancelButtonColor: '#d33',
     confirmButtonText: 'Yes, Logout',
     cancelButtonText: 'Cancel'
   }).then((result) => {
     if (result.isConfirmed) {
       localStorage.removeItem('token');

       Swal.fire({
         icon: 'success',
         title: 'Logged out',
         text: 'You have been successfully logged out.',
         timer: 1000,
         showConfirmButton: false
       });

       this.router.navigate(['/home']);
     }
   });
 }


 }


