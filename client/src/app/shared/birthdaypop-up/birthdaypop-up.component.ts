import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../services/data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-birthdaypop-up',
  templateUrl: './birthdaypop-up.component.html',
  styleUrls: ['./birthdaypop-up.component.scss']
})
export class BirthdaypopUpComponent implements OnInit, OnDestroy {
  birthdays: any[] = [];
  allBirthdays: any[] = [];
  showPopup = false;
showAll = false;
currentIndex = 0;
interval: any;
isCurrentUserBirthday = false;
currentUserBirthdayEmp: any = null;
constructor(
    private http: HttpClient,
    private dataservice: DataService,
    private AS: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any[],
    public dialogRef: MatDialogRef<BirthdaypopUpComponent>
  ) {}

  checkUserRole(id:any): boolean {
    const Emp_Id = this.AS.currentUser.Emp_Id;
    if (Emp_Id == id) {
      return true; // User is the same as the employee
    } 
    return false; // User is not the same as the employee
  }
getBirthdayMessage(emp: any): string {
  const currentEmpId = String(this.AS.currentUser?.Emp_Id);
  const empId = String(emp.id ); // Use ID or Emp_Id based on your data structure
  const days = this.getDaysUntil(emp.birthday);
console.log('Current Emp ID:', currentEmpId);
console.log('Employee ID:', empId);
  console.log('emp:', emp);
 
  if (currentEmpId === empId && days === 0) {
    return `🎉 Hey ${emp.name}, Happy Birthday to you! 🎂`;
  } else if (currentEmpId === empId && days === 1) {
    return `📅 ${emp.name}'s birthday is tomorrow.`;
  } else if (currentEmpId === empId && days === 2) {
    return `📅 ${emp.name}'s birthday is in 2 days.`;
  }

  if (currentEmpId !== empId) {
    if (days === 0) {
      return `🎂 Today is ${emp.name}'s birthday!`;
    } else if (days === 1) {
      return `📅 ${emp.name}'s birthday is tomorrow.`;
    } else if (days === 2) {
      return `📅 ${emp.name}'s birthday is in 2 days.`;
    }
  }

  
  return '';
}

 ngOnInit(): void {
  if (this.data && this.data.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter for today, tomorrow, in 2 days
    this.birthdays = this.data.filter((emp: any) => {
      const bday = new Date(emp.birthday);
      bday.setFullYear(today.getFullYear());
      bday.setHours(0, 0, 0, 0);
      const diff = Math.round((bday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diff === 0 || diff === 1 || diff === 2;
    });

    // Sort: today (0), tomorrow (1), in 2 days (2)
    this.birthdays.sort((a: any, b: any) => {
      const getDiff = (dateStr: string) => {
        const bday = new Date(dateStr);
        bday.setFullYear(today.getFullYear());
        bday.setHours(0, 0, 0, 0);
        return Math.round((bday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      };
      return getDiff(a.birthday) - getDiff(b.birthday);
    });

    // --- ADD THIS BLOCK ---
    const currentEmpId = String(this.AS.currentUser?.Emp_Id);
    this.currentUserBirthdayEmp = this.birthdays.find(emp => String(emp.Emp_Id) === currentEmpId) || null;
    this.isCurrentUserBirthday = !!this.currentUserBirthdayEmp;
    // --- END BLOCK ---

    if (this.birthdays.length > 0) {
      this.showPopup = true;
      this.startRotation();
    }
  }
  setTimeout(() => {
    this.closeAll();
  }, 5000);
}

  fetchBirthdaySoon() {
    this.http.get<any[]>('birthdaypop/birthday-soon').subscribe(data => {
      if (data.length > 0) {
        this.birthdays = data;
        this.showPopup = true;
        this.startRotation();
      }
    });
  }

    startRotation() {
    this.interval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.birthdays.length;
    }, 4000);
  }

  getDaysUntil(birthday: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight

    const bday = new Date(birthday);
    bday.setFullYear(today.getFullYear());
    bday.setHours(0, 0, 0, 0); // Set time to midnight

    if (bday < today) {
      bday.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = bday.getTime() - today.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  }

  getCountdownMessage(name: string, birthday: string): string {
    const days = this.getDaysUntil(birthday);
    if (days === 0) return `Wish you a very happy birthday 🎂 ${name}!`;
    if (days === 1) return `🎁 ${name}'s Birthday is Tomorrow!`;
    return `🎁 ${name}'s Birthday is in ${days} Days!`;
  }

  closeAll() {
    this.showAll = false;
    this.showPopup = false;
    this.currentIndex = 0;
    if (this.interval) {
      clearInterval(this.interval);
    }
   this.dialogRef.close() // <-- This will close the dialog
  // Optionally clear birthdays if you want a full reset:
  // this.birthdays = [];
  // this.allBirthdays = [];
}
  close() {
    this.showPopup = false;
    this.currentIndex = 0;
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.dialogRef.close(); // <-- This will close the dialog
  }

openAllBirthdays() {
    this.dataservice.getData('birthdaypop/all-birthdays').subscribe(data => {
      this.allBirthdays = data;
      this.showAll = true;
    });
  }


ngOnDestroy(): void {
  if (this.interval) {
    clearInterval(this.interval);
  }
}
}