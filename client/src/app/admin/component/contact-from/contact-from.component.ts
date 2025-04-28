import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { DataService } from 'src/app/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../../services/data.service';

// DataService
@Component({
  selector: 'app-contact-from',
  templateUrl: './contact-from.component.html',
  styleUrls: ['./contact-from.component.scss']
})
export class ContactFromComponent  implements OnInit {

  displayedColumns=['C_id','C_Name','C_Email','C_Subject','C_Message'];
  dataSource: any;

   @ViewChild(MatPaginator) paginator!: MatPaginator ;
   @ViewChild(MatSort) MatSort!: MatSort ;
  projectWorkDetail: any;

  ngOnInit(): void {
    this.getTable()
  }

  constructor(private ds:DataService){}


  getTable(){
    this.ds.getData('dashboardContent/getTabledata').subscribe((result:any)=>{
        this.projectWorkDetail=result;
            this.dataSource = new MatTableDataSource(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.MatSort;
        console.log(result);  
      })
      }

}
