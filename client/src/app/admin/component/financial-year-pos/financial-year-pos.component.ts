import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
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
  selector: 'app-financial-year-pos',
  templateUrl: './financial-year-pos.component.html',
  styleUrls: ['./financial-year-pos.component.scss']
})
export class FinancialYearPosComponent implements OnInit {

  displayedColumns = ['finance_post_main_id', 'Project_name', 'Financial_name', 'PI_ref_no', 'Work_order_ref_no', 'Action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) MatSort!: MatSort;


  FYearPostForm!: FormGroup;

  iseditmode: boolean = false
  project: any;
  allFyearPostDetail: any;
  data: any;
  resourceAssDataByid: any;
  data_id: any;
  status: any;
  FYearePostDataByid: any;
  projectType: any;
  post: any;
  year: any;
  allDetail: any;
  allPreviwDetail: any;
  finance_post_main_id: any;
  useProject: any;
  useFinancialYear: any;


  constructor(private fb: FormBuilder, private ds: DataService, private datepipe: DatePipe, private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.FYearPostForm = this.fb.group({
      Post_id: [null, Validators.required],
      Project_ID: [null, Validators.required],
      Description: [null, Validators.required],
      PI_ref_no: [null, Validators.required],
      Work_order_ref_no: [null, Validators.required],
      Financial_id: [null, Validators.required],
      Start_date: [null, Validators.required],
      End_date: [null, Validators.required],
      Salary: [null, Validators.required],
    });
    this.getPost()
    this.getProjectMap()
    this.getYear()
    this.getonTable()
  }

  // this is scroll function
  scrollToBottom(): void {
    const element = this.elementRef.nativeElement.querySelector('#endOfPage');
    element.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
  // get resource in dropdown
  getPost() {
    this.ds.getData('Financialyear_post/getpost').subscribe((result) => {
      console.log(result);
      this.post = result;
    })
  }

  // get resource in dropdown
  getYear() {
    this.ds.getData('Financialyear_post/getFinancialYear').subscribe((result) => {
      console.log(result);
      this.year = result;
    })
  }

  getProjectMap() {
    this.ds.getData('Financialyear_post/getProject').subscribe((result) => {
      console.log(result);
      this.projectType = result;
    })
  }

  // Show data in Mat Table
  getonTable() {
    this.ds.getData('Financialyear_post/PostPreviewDetail').subscribe((result: any) => {
      this.allDetail = result;
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.MatSort;
    })
  }


  getPreview(finance_post_main_id: any) {
    this.ds.getData('Financialyear_post/bbbbbb/' + finance_post_main_id).subscribe((result: any) => {
      console.log(result)
      this.allPreviwDetail = result;
      document.getElementById("addnews")?.scrollIntoView();
      // console.log(this.allPreviwDetail[0]['Project_name']);
      this.useProject = this.allPreviwDetail[0]['Project_name']
      this.useFinancialYear = this.allPreviwDetail[0]['Financial_name']
    })
  }

  // mat Table filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  onClear() {
    this.FYearPostForm.reset();
  }



}


