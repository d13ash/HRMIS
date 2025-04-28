import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
// import { AuthService } from 'src/app/services/auth.service';
// import { DataService } from 'src/app/services/data.service';

// AuthService,DataService
@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss'],
  animations: [
    trigger('colorChange', [
      state('void', style({ backgroundColor: '{{ initialColor }}' }), {
        params: { initialColor: 'transparent' },
      }),
      transition(
        ':enter',
        animate('5s', keyframes([
          style({ backgroundColor: '{{ initialColor }}', offset: 0 }),
          style({ backgroundColor: '{{ targetColor }}', offset: 1 })
        ])),
      ),
      transition(
        ':leave',
        animate('5s', keyframes([
          style({ backgroundColor: '{{ targetColor }}', offset: 0 }),
          style({ backgroundColor: '{{ initialColor }}', offset: 1 })
        ])),
     ),
   ]),
  ],
})
export class LeaveRequestComponent implements OnInit {

  currentCount = 0;
  finalCount: any; // Initialize finalCount to 0
  Balancecount: any; // Initialize finalCount to 0
  currentCount1 = 0;
  finalCount1: any; // Initialize finalCount to 0
  Balancecount1: any; // Initialize finalCount to 0
  currentCount2 = 0;
  finalCount2: any; // Initialize finalCount to 0
  Balancecount2: any; // Initialize finalCount to 0
  currentCount3 = 0;
  finalCount3: any; // Initialize finalCount to 0
  Balancecount3: any; // Initialize finalCount to 0
  colors = [0, 1, 2, 3, 4]; // Array of different color indices
  colors1 = [4, 3, 2, 1, 0]; // Array of different color indices
  currentColorIndex = 0;
  cardColorClass = `color-${this.colors[0]}`;
  cardColorClass1 = `color-${this.colors1[0]}`;
  res: any;
  leavename: any;
  leavename1: any;
  leavename2: any;
  leavename3: any;
  balancdata: number = 10;



  constructor(private ds: DataService,private AS : AuthService,private http : HttpClient) { }

  ngOnInit(): void {
    // this.changeCardColor();
    // this.changeCardColor1();
    this.sendFormData() 
  }



  animateCount() {
    if (this.finalCount === 0) {
      this.currentCount = 0;
    } else {
      const interval = setInterval(() => {
        this.currentCount += 1;
        if (this.currentCount >= this.finalCount) {
          clearInterval(interval);
        }
      }, 163); // Adjust the interval for the desired animation speed
    }
  }


  animateCount1() {
    if (this.finalCount1 === 0) {
      this.currentCount1 = 0;
    } else {
      const interval = setInterval(() => {
        this.currentCount1 += 1;
        if (this.currentCount1 >= this.finalCount1) {
          clearInterval(interval);
        }
      }, 163); // Adjust the interval for the desired animation speed
    }
  }
  animateCount2() {
    if (this.finalCount2 === 0) {
      this.currentCount2 = 0;
    } else {
      const interval = setInterval(() => {
        this.currentCount2 += 1;
        if (this.currentCount2 >= this.finalCount2) {
          clearInterval(interval);
        }
      }, 163); // Adjust the interval for the desired animation speed
    }
  }
  animateCount3() {
    if (this.finalCount3 === 0) {
      this.currentCount3 = 0;
    } else {
      const interval = setInterval(() => {
        this.currentCount3 += 1;
        if (this.currentCount3 >= this.finalCount3) {
          clearInterval(interval);
        }
      }, 163); // Adjust the interval for the desired animation speed
    }
  }
  // changeCardColor() {
  //   setInterval(() => {
  //     this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length; // Cycle through color indices
  //     this.cardColorClass = `color-${this.colors[this.currentColorIndex]}`;
  //   }, 5000); // Change the card color every 5 seconds
  // }

  // changeCardColor1() {
  //   setInterval(() => {
  //     this.currentColorIndex = (this.currentColorIndex + 1) % this.colors1.length; // Cycle through color indices
  //     this.cardColorClass1 = `color-${this.colors1[this.currentColorIndex]}`;
  //   }, 5000); // Change the card color every 5 seconds
  // }

  sendFormData() {
    var formData: any = new FormData();
    formData.append('Emp_ID', this.AS.currentUser.Emp_Id);
    this.http.post<any>('http://192.168.1.32/igkv/a_edu/API_For_Angular_Project.asmx/LeaveDashboard', formData)
      .subscribe((result: any) => {
        this.res = result;
        console.log(this.res);
         this.leavename = this.res.DetailListResponse.DetailList[0].Leave_Type_Name
         this.finalCount = this.res.DetailListResponse.DetailList[0].Credit_Days_Per_Year
         this.Balancecount = this.res.DetailListResponse.DetailList[0].Balance
         this.animateCount();
        this.leavename1 = this.res.DetailListResponse.DetailList[1].Leave_Type_Name
        this.finalCount1 = this.res.DetailListResponse.DetailList[1].Credit_Days_Per_Year
         this.Balancecount1 = this.res.DetailListResponse.DetailList[1].Balance
         this.animateCount1();
        this.leavename2 = this.res.DetailListResponse.DetailList[2].Leave_Type_Name
        this.finalCount2 = this.res.DetailListResponse.DetailList[2].Credit_Days_Per_Year
         this.Balancecount2 = this.res.DetailListResponse.DetailList[2].Balance
         this.animateCount2();
        this.leavename3 = this.res.DetailListResponse.DetailList[3].Leave_Type_Name
        this.finalCount3 = this.res.DetailListResponse.DetailList[3].Credit_Days_Per_Year
         this.Balancecount3 = this.res.DetailListResponse.DetailList[3].Balance
         this.animateCount3();
        console.log(this.leavename);
       
   });
 }
}