import { Component, OnInit } from '@angular/core';
// import { DataService } from 'src/app/services/data.service';
import { forkJoin } from 'rxjs';
import { DataService } from '../../services/data.service';

// DataService
@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss']
})
export class ProgressbarComponent  implements OnInit {
  constructor(private ds: DataService) { }

  ngOnInit(): void {
    this.getData();
  }

  arr: any = [];
  arr1: any = [];
  countData: any;
  countLength: any;
  countApproval: any;

  getData() {
    forkJoin([
      this.ds.getData('projectWorkAllotment/getWorkCount'),
      this.ds.getData('projectWorkAllotment/getApprove')
    ]).subscribe(([workCountRes, approvalCountRes]: [any, any]) => {
      this.countData = workCountRes;
      this.countApproval = approvalCountRes;
      this.getWorkCount();
      this.getApprovalCount();
      this.countFunc();
    }, (error) => {
      console.error('Error:', error);
    });
  }

  getWorkCount() {
    this.countLength = this.countData.length;
  }

  getApprovalCount() {
    this.countLength = this.countApproval.length;
  }

  countFunc() {
    this.countData.forEach((element: any) => {
      console.log(element);
      this.countApproval.forEach((item: any) => {
        if (element.Project_name == item.Project_name) {
          let a = { Project_name: element.Project_name, percent: Math.floor((item.TotalWor / element.totalWork) * 100) };
          console.log(a);
          this.arr.push(a);
          this.arr1.push(element.Project_name);
        }
      });

      if (!this.arr1.includes(element.Project_name)) {
        let a = { Project_name: element.Project_name, percent: 0 };
        console.log(a);
        this.arr.push(a);
      }
    });
    console.log(this.arr);
  }
}
