import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-leave-request-check',
  templateUrl: './leave-request-check.component.html',
  styleUrl: './leave-request-check.component.scss'
})
export class LeaveRequestCheckComponent implements OnInit {
  displayedColumns: string[] = ['leaveId', 'empId', 'empName', 'daysRequired', 'leaveFrom', 'leaveTo', 'status', 'actions'];

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private router: Router
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) MatSort!: MatSort;

  allPostDetail: any[] = [];
  postDataByid: any;
  iseditmode = false;
  data_id: number | null = null;
  data: any;
  posttype: any[] = [];
  dataSource!: MatTableDataSource<any>;

  PostdetailsForm!: FormGroup;

  ngOnInit() {
    this.getTable();
  }

  getTable() {
    this.ds.getData('leave_request/LeaveRequestAdmin').subscribe((result: any) => {
      this.allPostDetail = result;
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.MatSort;
    });
  }

  approveLeave(leave: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to approve this leave request?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ds.putData(`leave_request/approve/${leave.leave_id}`, {}).subscribe(
          (response: any) => {
            Swal.fire(
              'Approved!',
              'Leave request has been approved.',
              'success'
            );
            this.getTable();
          },
          (error) => {
            Swal.fire(
              'Error!',
              'Failed to approve leave request.',
              'error'
            );
          }
        );
      }
    });
  }

  rejectLeave(leave: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to reject this leave request?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ds.putData(`leave_request/reject/${leave.leave_id}`, {}).subscribe(
          (response: any) => {
            Swal.fire(
              'Rejected!',
              'Leave request has been rejected.',
              'success'
            );
            this.getTable();
          },
          (error) => {
            Swal.fire(
              'Error!',
              'Failed to reject leave request.',
              'error'
            );
          }
        );
      }
    });
  }
}
