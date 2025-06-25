import { Component, ElementRef, OnInit, ViewChild,Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { DataService } from 'src/app/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { DataService } from '../../../services/data.service';

// DataService
@Component({
  selector: 'app-fina-year-dialog',
  templateUrl: './fina-year-dialog.component.html',
  styleUrls: ['./fina-year-dialog.component.scss']
})
export class FinaYearDialogComponent implements OnInit{

  allDetail: any;
  allPreviwDetail: any;
  useFinancialYear: any;
  useProject: any;

  constructor( private ds : DataService, private datepipe: DatePipe,){}


  ngOnInit(): void {
   this.getonTable()
  }

getonTable(){
    this.ds.getData('Financialyear_post/PostPreviewDetail' ).subscribe((result:any)=>{
        this.allDetail=result;
            
      })
      }
  
  
  getPreview(finance_post_main_id:any){
    this.ds.getData('Financialyear_post/bbbbbb/'+finance_post_main_id ).subscribe((result:any)=>{
         console.log(result)
      this.allPreviwDetail=result;
      // console.log(this.allPreviwDetail[0]['Project_name']);
      this.useProject=this.allPreviwDetail[0]['Project_name']
      this.useFinancialYear=this.allPreviwDetail[0]['Financial_name']
      
  
          })
          }

}
