import { AfterViewInit,ViewEncapsulation, Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
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
    project: '',
    module: ''
  };

  constructor(private ds: DataService, private as: AuthService, private http: HttpClient) { }
  ngOnInit(): void {
    this.getPreview();
  }

  getPreview() {
    this.ds.getData('dashboardContent/view').subscribe((result: any) => {
      // this.dataSource = result;
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = this.createFilter();
      // console.log(result);
    })
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
        this.getPreview();
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
    const filterString = JSON.stringify(this.filterValues);
    this.dataSource.filter = filterString;
  }

  // Custom filter logic
  createFilter(): (data: any, filter: string) => boolean {
    return (data, filter): boolean => {
      const searchTerms = JSON.parse(filter);

      const empMatch = data.Emp_First_Name_E?.toLowerCase().includes(searchTerms.employee.toLowerCase());
      const projMatch = data.Project_name?.toLowerCase().includes(searchTerms.project.toLowerCase());
      const modMatch = data.module_name?.toLowerCase().includes(searchTerms.module.toLowerCase());

      return empMatch && projMatch && modMatch;
    };
  }



}
