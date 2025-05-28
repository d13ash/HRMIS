import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
// import { AuthserviceService } from '../../services/authservice.service';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { get } from 'http';
import { Subscription, interval } from 'rxjs';
import Swal from 'sweetalert2';

// import { AuthService } from 'src/app/services/auth.service';
// import { DataService } from 'src/app/services/data.service';

// AuthService, DataService
@Component({
  selector: 'app-main-dash-card',
  templateUrl: './main-dash-card.component.html',
  styleUrls: ['./main-dash-card.component.scss']
})
export class MainDashCardComponent implements OnInit, OnDestroy {
  countProjectData: any;
  projectCountValue: any;
  countWorkData: any;
  workCountValue: any;
  countEmpData: any;
  empCountValue: any;
  allRows: any[] = [];
  currentRow: any;
  currentIndex = 0;
  private timerSub!: Subscription;
  aprlEdit: boolean = true;

  constructor(private ds: DataService, private as: AuthService, private http: HttpClient) { }
  ngOnInit(): void {
    this.countProject()
    this.countWork()
    this.countEmp()
    this.getPreview();
    // Show first row immediately
    this.startTimer();
  }

  countProject() {
    this.ds.getData('dashboardContent/projectCount').subscribe((res) => {
      this.countProjectData = res
      console.log(this.countProjectData)
      this.projectCountValue = this.countProjectData[0].project_count;
      console.log(this.projectCountValue);
    })
  }

  countWork() {
    this.ds.getData('dashboardContent/workCount').subscribe((res) => {
      this.countWorkData = res
      console.log(this.countWorkData)
      this.workCountValue = this.countWorkData[0].countdata;
      console.log(this.workCountValue);
    })
  }

  countEmp() {
    this.ds.getData('dashboardContent/empCount').subscribe((res) => {
      this.countEmpData = res
      console.log(this.countProjectData)
      this.empCountValue = this.countEmpData[0].empCount;
      console.log(this.empCountValue);
    })
  }

  getPreview() {
    this.ds.getData('dashboardContent/view').subscribe((result: any) => {
      console.log(result)
      this.allRows = result;
      this.showRow(0);
    })
  }

  startTimer() {
    this.timerSub = interval(10 * 1000).subscribe(() => { // every 10 min
      this.currentIndex = (this.currentIndex + 1) % this.allRows.length;
      this.showRow(this.currentIndex);
    });
  }

  showRow(index: number) {
    this.currentRow = this.allRows[index];
  }

  statusColor(status: string): string {
    const s = status.toLowerCase();
    if (s.includes('finished')) {
      this.aprlEdit = false;
      return 'finished';
    }
    if (s.includes('running')) {
      this.aprlEdit = true;
      return 'running';
    }
    this.aprlEdit = true;
    return 'incomplete';
  }

  approvalColor(status: string): string {
    const s = status.toLowerCase();
    if (s.includes('approved')) return 'approved';
    if (s.includes('rejected')) return 'rejected';
    return 'pending';
  }

  canShowApprovalActions(): boolean {
    if (!this.currentRow) return false;
    const status = this.currentRow.is_Work_complete?.toLowerCase();
    return status === 'finished' || !this.currentRow.approval;
  }

  updateApproval(status: string) {
    if (!this.currentRow) return;

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
        this.ds.putData("projectWorkAllotment/updateAllotedWork/" + this.currentRow.alloted_project_work_id, { "approval": status }).subscribe((res: any) => {
          console.log(res)
        });
        Swal.fire(
          'Updated!',
          `The status has been set to "${status}".`,
          'success'
        );
      } else {
        // If the user cancels, revert the radio button selection visually if needed
        // This is a bit tricky with radio buttons, but you can manage it by
        // ensuring the [checked] binding keeps the current this.approvalStatus
        // which hasn't changed if the user canceled.
      }
    });
  }


  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }
}