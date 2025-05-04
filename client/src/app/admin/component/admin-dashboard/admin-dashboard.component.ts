import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
// import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { ConfirmLogoutDialogComponent } from '../confirm-logout-dialog/confirm-logout-dialog.component';

// AuthService
// ConfirmLogoutDialogComponent

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  role: any;
  Emp_Id: any;
  roles: any = [];
  
  constructor(private breakpointObserver: BreakpointObserver,private AS: AuthService,private dialog: MatDialog,private router:Router) {}

  
  isHandset$: Observable<boolean> | undefined;


  ngOnInit() {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
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

//   logout() {
//     // Remove token from local storage
//     localStorage.removeItem('token');
    
//     // Redirect to login page
//     this.router.navigate(['/login']);
//  }
    logout(): void {
      const dialogRef = this.dialog.open(ConfirmLogoutDialogComponent, {
        width: '300px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      });
    }

}