import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-emp-project',
  templateUrl: './emp-project.component.html',
  styleUrl: './emp-project.component.scss'
})
export class EmpProjectComponent implements OnInit {

  // Material Table properties
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'sr',
    'Project_name',
    'Financial_name', 
    'Project_Type_Name'
  ];

  projectData: any = [];
  useEmpName: any;

  constructor(private ds: DataService, private AS: AuthService) {}
  
  ngOnInit(): void {
    this.getEmployeeProjects();
  }

  // Get employee projects
  getEmployeeProjects() {
    this.ds.getData('projectDetail/employeeProjects/' + this.AS.currentUser.Emp_Id).subscribe((result: any) => {
      console.log(result);
      this.projectData = result;
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
      document.getElementById("projectTable")?.scrollIntoView();
    }, (error: any) => {
      console.error('Error fetching employee projects:', error);
    });
  }

  // Search filter function
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
