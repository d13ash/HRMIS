import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
// import { AuthService } from 'src/app/services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
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

  logout() {
    // Remove token from local storage
    localStorage.removeItem('token');
    
    // Redirect to login page
    this.router.navigate(['/login']);
 }

}