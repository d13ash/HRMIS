import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
// import { DataService } from 'src/app/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
// import { AuthService } from 'src/app/services/auth.service';


// DataService,AuthService
@Component({
  selector: 'app-resource-show',
  templateUrl: './resource-show.component.html',
  styleUrls: ['./resource-show.component.scss']
})
export class ResourceShowComponent implements OnInit {
  displayedColumns = ['ID', 'Emp_name', 'Item_Name', 'Project_Name', 'Allotment Date', 'Allotment Date End', 'Action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  allResource_Allotment_Details: any;

  constructor(
    private fb: FormBuilder,
    private AS: AuthService,
    private ds: DataService,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getTable();
  }

  // Show data in Mat Table
  getTable(): void {
    this.ds.getData('employee_resource_allotment/alluser/' + this.AS.currentUser.Emp_Id).subscribe(
      (result: any) => {
        this.allResource_Allotment_Details = result;
        console.log(this.allResource_Allotment_Details);

        if (result) {
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      (error: any) => {
        // Handle the error case, such as displaying an error message or taking corrective actions.
        console.error('Error fetching data:', error);
      }
    );
  }

  // mat Table filter
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}