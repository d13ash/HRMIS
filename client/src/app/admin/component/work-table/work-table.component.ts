import { AfterViewInit,ViewEncapsulation, Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-work-table',
  templateUrl: './work-table.component.html',
  styleUrl: './work-table.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class WorkTableComponent implements  OnInit {
  displayedColumns: string[] = [
    'sr',
    'employee',
    'project',
    'module',
    'work',
    'startDate',
    'endDate',
    'description',
    'status',
    'approval'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<any>([]);

  filterValues = {
    employee: '',
    project: ''
  };

  searchFromDate: Date | null = null;
  searchToDate: Date | null = null;

  constructor(private ds: DataService, private as: AuthService, private http: HttpClient, private datePipe: DatePipe) { }
  ngOnInit(): void {
    this.setDefaultDates();
    this.getTable();
  }

  setDefaultDates() {
    const currentDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(currentDate.getDate() - 30);
    
    this.searchFromDate = fromDate;
    this.searchToDate = currentDate;
  }

  onFromDateChange() {
    this.getTable();
  }

  onToDateChange() {
    this.getTable();
  }

  getTable() {
    // Build query string from search fields
    let query = '';
    const params: string[] = [];
    
    if (this.filterValues.project) {
      params.push(`projectName=${encodeURIComponent(this.filterValues.project)}`);
    }
    
    if (this.filterValues.employee) {
      params.push(`empName=${encodeURIComponent(this.filterValues.employee)}`);
    }
    
    // Format dates to yyyy-mm-dd before adding to query
    if (this.searchFromDate && this.searchToDate) {
      const formattedFromDate = this.datePipe.transform(this.searchFromDate, 'yyyy-MM-dd');
      if (formattedFromDate) {
        params.push(`from=${encodeURIComponent(formattedFromDate)}`);
      }
      const formattedToDate = this.datePipe.transform(this.searchToDate, 'yyyy-MM-dd');
      if (formattedToDate) {
        params.push(`to=${encodeURIComponent(formattedToDate)}`);
      }
    }
    if (params.length) {
      query = '?' + params.join('&');
    }
    
    this.ds.getData('dashboardContent/view' + query).subscribe(
      (result: any) => {
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.createFilter();
        console.log(result);
      },
      (err) => {
        console.error('Error fetching project work data:', err);
      }
    );
  }

  onApprovalChange(status: string, id: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to set the status to "${status}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ds.putData("projectWorkAllotment/updateAllotedWork/" + id, { "approval": status }).subscribe((res: any) => {
          Swal.fire(
          'Updated!',
          `The status has been set to "${status}".`,
          'success'
        );
        this.getTable();
        });

      }
    });
  }

  isEditable(status: string) {
    const s = status.toLowerCase();
    if (s.includes('finished')) return false;
    else return true;
  }

   applyFilter() {
    this.getTable();
  }

  // Custom filter logic (now used for client-side filtering of text fields only)
  createFilter(): (data: any, filter: string) => boolean {
    return (data, filter): boolean => {
      const searchTerms = JSON.parse(filter);

      const empMatch = data.Emp_First_Name_E?.toLowerCase().includes(searchTerms.employee.toLowerCase());
      const projMatch = data.Project_name?.toLowerCase().includes(searchTerms.project.toLowerCase());

      return empMatch && projMatch;
    };
  }



}
