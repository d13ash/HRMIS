import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../../services/data.service';
// import { DataService } from 'src/app/services/data.service';

// DataService

@Component({
  selector: 'app-stock-item-details',
  templateUrl: './stock-item-details.component.html',
  styleUrls: ['./stock-item-details.component.scss']
})
export class StockItemDetailsComponent implements OnInit {
  displayedColumns = ['Purchase_id', 'Purchase_name', 'Purchase_order_no', 'agency', 'bill_date',  'Action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) MatSort!: MatSort;
  constructor( private ds: DataService) { }
  allDepartmentDetail:any;
  itemlist:any;

  ngOnInit(): void {
  
    this.getTable()

  }


  getTable() {
    this.ds.getData('resource_stock_entry/showdata123').subscribe((result: any) => {
      this.allDepartmentDetail = result;
      console.log(this.allDepartmentDetail);
      
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.MatSort;
    
    })
  }

  View(id:any){
    this.ds.getData('resource_stock_entry/view/'+id).subscribe((result: any) => {
      this.itemlist = result;
      console.log(this.itemlist);

    })

  }


  // mat Table filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}