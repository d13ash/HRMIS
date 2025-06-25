import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { LeaveRequestComponent } from '../leave-request/leave-request.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-leave-hr',
  templateUrl: './leave-hr.component.html',
  styleUrl: './leave-hr.component.scss'
})
export class LeaveHrComponent implements OnInit {
  displayedColumns: string[] = ['leaveId', 'employeeId', 'employeeName', 'leaveType', 'leaveReason', 'leaveFrom', 'leaveTo', 'status', 'document', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadLeaveRequests();
  }

  loadLeaveRequests() {
    this.dataService.getData('leave_request/LeaveRequestAdmin').subscribe({
      next: (response: any) => {
        this.dataSource.data = response;
      },
      error: (error: any) => {
        console.error('Error loading leave requests:', error);
        this.snackBar.open('Error loading leave requests', 'Close', { duration: 3000 });
      }
    });
  }

  approveLeave(leaveId: string) {
    this.dataService.approveLeaveRequest(leaveId).subscribe({
      next: () => {
        this.snackBar.open('Leave request approved successfully', 'Close', { duration: 3000 });
        this.loadLeaveRequests();
      },
      error: (error: any) => {
        console.error('Error approving leave request:', error);
        this.snackBar.open('Error approving leave request', 'Close', { duration: 3000 });
      }
    });
  }

  rejectLeave(leaveId: string) {
    this.dataService.rejectLeaveRequest(leaveId).subscribe({
      next: () => {
        this.snackBar.open('Leave request rejected successfully', 'Close', { duration: 3000 });
        this.loadLeaveRequests();
      },
      error: (error: any) => {
        console.error('Error rejecting leave request:', error);
        this.snackBar.open('Error rejecting leave request', 'Close', { duration: 3000 });
      }
    });
  }

  viewDocument(filename: string) {
    if (filename) {
      window.open(`${this.dataService.configUrl}leave_request/LeaveDocument/${filename}`, '_blank');
    } else {
      this.snackBar.open('No document available', 'Close', { duration: 3000 });
    }
  }

  addNewLeaveRequest() {
    const dialogRef = this.dialog.open(LeaveRequestComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadLeaveRequests();
      }
    });
  }
}
