import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../../services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { differenceInDays } from 'date-fns';
import { AuthService } from '../../services/auth.service';

function formatDateForMariaDB(date: any): string {
  if (!date) return '';
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss']
})
export class LeaveRequestComponent implements OnInit { 
  leaveForm: FormGroup;
  leaveTypes: any[] = [];
  leaveReasons: any[] = [];
  selectedFile: File | null = null;
  isDialog: boolean = false;
  showPurposeField: boolean = false;
  selectedLeaveType: any = null;
  activeUser: any = null;
  selectedFileName: string | null = null;
  maxDaysAvailable: number | null = null;

  constructor(
    private fb: FormBuilder,
    public dataService: DataService,
    private snackBar: MatSnackBar,
    private AS: AuthService,
    @Optional() private dialogRef: MatDialogRef<LeaveRequestComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { leave?: any, viewOnly?: boolean } = {}
  ) {
    this.isDialog = !!this.dialogRef;
    
    this.leaveForm = this.fb.group({
      leaveType: [''],
      daysAvailable: [{ value: 0, disabled: true }],
      leaveReason: [''],
      leaveFrom: [''],
      leaveTo: [''],
      daysRequired: [{ value: 0, disabled: true }],
      purpose: ['']
    });

    // Subscribe to date changes to calculate days
    this.leaveForm.get('leaveFrom')?.valueChanges.subscribe(() => this.calculateDays());
    this.leaveForm.get('leaveTo')?.valueChanges.subscribe(() => this.calculateDays());
  }

  async ngOnInit() {
    this.getActiveUserData();
    if (this.data?.leave) {
      console.log('Leave object received in dialog:', this.data.leave);
      console.log('Leave object keys:', Object.keys(this.data.leave));
      await this.loadLeaveTypes();
      // Patch leaveType first
      this.leaveForm.patchValue({
        leaveType: this.data.leave.leave_type_id || this.data.leave.leaveType || '',
        leaveFrom: this.data.leave.leave_from ? new Date(this.data.leave.leave_from) : '',
        leaveTo: this.data.leave.leave_to ? new Date(this.data.leave.leave_to) : '',
        daysRequired: this.data.leave.days_required ?? '',
        purpose: this.data.leave.purpose_of_leave ?? ''
      });
      // Set daysAvailable from leave type for viewOnly mode
      const leaveTypeId = this.data.leave.leave_type_id || this.data.leave.leaveType;
      const selectedType = this.leaveTypes.find(type => type.leave_type_id === leaveTypeId || type.leave_type === this.data.leave.leave_type);
      if (selectedType) {
        this.leaveForm.patchValue({ daysAvailable: selectedType.max_days_available || 0 });
        this.maxDaysAvailable = selectedType.max_days_available || 0;
      } else {
        console.warn('Leave type not found in leaveTypes array:', leaveTypeId, this.data.leave.leave_type);
        this.maxDaysAvailable = null;
      }
      // Now load reasons for this type, then patch leaveReason
      if (leaveTypeId) {
        await new Promise(resolve => {
          this.dataService.getLeaveReasons(leaveTypeId).subscribe({
            next: (reasons: any) => {
              this.leaveReasons = reasons;
              this.leaveForm.patchValue({
                leaveReason: this.data.leave.leave_reason_id || this.data.leave.leaveReason || ''
              });
              this.onLeaveReasonChange();
              resolve(true);
            },
            error: () => resolve(true)
          });
        });
      }
      if (this.data.leave.supporting_document) {
        this.selectedFileName = this.data.leave.supporting_document;
      }
      // If viewOnly, disable all form controls
      if (this.data.viewOnly) {
        this.leaveForm.disable();
      }
    } else {
      await this.loadLeaveTypes();
    }
  }

  getActiveUserData() {
    this.AS.getFunction('login/allEmplogin/' + this.AS.currentUser.Emp_Id).subscribe((res: any) => {
      this.activeUser = res && res[0] ? res[0] : null;
    });
  }

  loadLeaveTypes(): Promise<void> {
    return new Promise((resolve) => {
      this.dataService.getLeaveTypes().subscribe({
        next: (types: any) => {
          this.leaveTypes = types;
          resolve();
        },
        error: (error) => {
          this.snackBar.open('Error loading leave types', 'Close', { duration: 3000 });
          resolve();
        }
      });
    });
  }

  onLeaveTypeChange() {
    const leaveTypeId = this.leaveForm.get('leaveType')?.value;
    if (leaveTypeId) {
      // Find the selected leave type to get days available
      this.selectedLeaveType = this.leaveTypes.find(type => type.leave_type_id === leaveTypeId);
      if (this.selectedLeaveType) {
        this.leaveForm.get('daysAvailable')?.setValue(this.selectedLeaveType.max_days_available || 0);
      }

      // Load leave reasons for this leave type
      this.dataService.getLeaveReasons(leaveTypeId).subscribe({
        next: (reasons: any) => {
          this.leaveReasons = reasons;
          this.leaveForm.get('leaveReason')?.setValue('');
          this.showPurposeField = false;
        },
        error: (error) => {
          console.error('Error loading leave reasons:', error);
          this.snackBar.open('Error loading leave reasons', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onLeaveReasonChange() {
    const leaveReasonId = this.leaveForm.get('leaveReason')?.value;
    if (leaveReasonId) {
      // Check if the selected reason is "Others" to show purpose field
      const selectedReason = this.leaveReasons.find(reason => reason.leave_reason_id === leaveReasonId);
      this.showPurposeField = selectedReason?.leave_reason?.toLowerCase() === 'others';
      
      if (this.showPurposeField) {
        this.leaveForm.get('purpose')?.setValidators([Validators.required]);
      } else {
        this.leaveForm.get('purpose')?.clearValidators();
        this.leaveForm.get('purpose')?.setValue('');
      }
      this.leaveForm.get('purpose')?.updateValueAndValidity();
    }
  }

  calculateDays() {
    const fromDate = this.leaveForm.get('leaveFrom')?.value;
    const toDate = this.leaveForm.get('leaveTo')?.value;

    if (fromDate && toDate) {
      const days = differenceInDays(new Date(toDate), new Date(fromDate)) + 1;
      this.leaveForm.get('daysRequired')?.setValue(days);
    }
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  removeFile() {
    this.selectedFile = null;
    // Reset the file input for both dialog and standalone forms
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const fileInputStandalone = document.getElementById('fileInputStandalone') as HTMLInputElement;
    
    if (fileInput) {
      fileInput.value = '';
    }
    if (fileInputStandalone) {
      fileInputStandalone.value = '';
    }
  }

  onSubmit() {
    console.log('activeUser at submit:', this.activeUser);
    if (this.leaveForm.valid && this.activeUser) {
      // Try all possible property names for employee ID
      const empId = this.activeUser.Emp_ID || this.activeUser.Emp_Id || this.activeUser.emp_id;
      if (!empId) {
        this.snackBar.open('Employee ID not found. Please log in again.', 'Close', { duration: 3000 });
        return;
      }
      const formData = new FormData();
      const formValue = this.leaveForm.getRawValue();
      const formattedFrom = formatDateForMariaDB(formValue?.leaveFrom);
      const formattedTo = formatDateForMariaDB(formValue?.leaveTo);
      console.log('leaveFrom raw:', formValue?.leaveFrom, 'formatted:', formattedFrom);
      console.log('leaveTo raw:', formValue?.leaveTo, 'formatted:', formattedTo);
      formData.append('Emp_Id', empId);
      formData.append('leave_type_id', formValue?.leaveType ?? '');
      formData.append('leave_reason_id', formValue?.leaveReason ?? '');
      formData.append('days_avaliable', formValue?.daysAvailable ?? '');
      formData.append('days_required', formValue?.daysRequired ?? '');
      formData.append('leave_from', formattedFrom);
      formData.append('leave_to', formattedTo);
      formData.append('purpose_of_leave', formValue?.purpose || '');
      if (this.selectedFile) {
        formData.append('supporting_document', this.selectedFile);
      }
      // Print FormData in text format (TypeScript compatible)
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
      const request = this.data?.leave
        ? this.dataService.updateLeaveRequest(this.data.leave.leave_id, formData)
        : this.dataService.submitLeaveRequest(formData);
      request.subscribe({
        next: () => {
          this.snackBar.open(
            this.data?.leave ? 'Leave request updated successfully' : 'Leave request submitted successfully',
            'Close',
            { duration: 3000 }
          );
          if (this.dialogRef) {
            this.dialogRef.close(true);
          } else {
            this.leaveForm.reset();
            this.selectedFile = null;
          }
        },
        error: (error) => {
          console.error('Error submitting leave request:', error);
          this.snackBar.open('Error submitting leave request', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onCancel() {
    if (this.isDialog) {
      this.dialogRef?.close();
    } else {
      // Reset form if not in dialog
      this.leaveForm.reset();
      this.selectedFile = null;
      this.showPurposeField = false;
      this.selectedLeaveType = null;
      this.removeFile(); // Reset file inputs
    }
  }

  // Add a method to download/view the uploaded file
  viewUploadedFile() {
    if (this.selectedFileName) {
      window.open(`${this.dataService.configUrl}leave_request/LeaveDocument/${this.selectedFileName}`, '_blank');
    }
  }

  get displayLeaveType(): string {
    if (this.data?.leave?.leave_type) return this.data.leave.leave_type;
    const id = this.data?.leave?.leave_type_id || this.data?.leave?.leaveType;
    const found = this.leaveTypes?.find(type => type.leave_type_id === id);
    return found ? found.leave_type : '';
  }

  get displayLeaveReason(): string {
    if (this.data?.leave?.leave_reason) return this.data.leave.leave_reason;
    const id = this.data?.leave?.leave_reason_id || this.data?.leave?.leaveReason;
    const found = this.leaveReasons?.find(reason => reason.leave_reason_id === id);
    return found ? found.leave_reason : '';
  }
}
