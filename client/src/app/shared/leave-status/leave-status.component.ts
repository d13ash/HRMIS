import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { LeaveRequestComponent } from '../leave-request/leave-request.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-leave-status',
  templateUrl: './leave-status.component.html',
  styleUrls: ['./leave-status.component.scss']
})
export class LeaveStatusComponent implements OnInit {
  displayedColumns: string[] = ['leaveId','daysRequired', 'leaveFrom', 'leaveTo', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  employeeId: string = '';

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private AS: AuthService
  ) {}

  ngOnInit() {
    this.getActiveUserData();
  }

  getActiveUserData() {
    const currentUser = this.AS.currentUser;
    console.log('Current user:', currentUser);
    if (currentUser && (currentUser.Emp_Id)) {
      this.employeeId = currentUser.Emp_Id;
      this.loadLeaveStatus();
    } else {
      this.snackBar.open('Employee ID not found. Please log in again.', 'Close', { duration: 3000 });
    }
  }

  loadLeaveStatus() {
    if (!this.employeeId) {
      this.snackBar.open('Employee ID not found. Please log in again.', 'Close', { duration: 3000 });
      return;
    }
    this.dataService.getLeaveStatus(this.employeeId).subscribe(
      (response: any) => {
        this.dataSource.data = response;
      },
      (err) => {
        console.error('Error loading leave status:', err);
        this.snackBar.open('Failed to load leave status', 'Close', { duration: 3000 });
      }
    );
  }

  updateLeave(leave: any) {
    const dialogRef = this.dialog.open(LeaveRequestComponent, {
      width: '600px',
      data: { leave }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadLeaveStatus();
      }
    });
  }

  deleteLeave(leaveId: string) {
    if (confirm('Are you sure you want to delete this leave request?')) {
      this.dataService.deleteLeaveRequest(leaveId).subscribe({
        next: () => {
          this.snackBar.open('Leave request deleted successfully', 'Close', { duration: 3000 });
          this.loadLeaveStatus();
        },
        error: (error) => {
          console.error('Error deleting leave request:', error);
          this.snackBar.open('Error deleting leave request', 'Close', { duration: 3000 });
        }
      });
    }
  }

  viewDocument(filename: string) {
    if (filename) {
      window.open(`${this.dataService.configUrl}leave_request/LeaveDocument/${filename}`, '_blank');
    } else {
      this.snackBar.open('No document available', 'Close', { duration: 3000 });
    }
  }
}
