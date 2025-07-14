import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportDialogComponent } from '../export-dialog/export-dialog.component';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

export interface AttendanceRecord {
  employee_code: string;
  employee_name: string;
  department_name: string;
  date: string;
  singInTime: string;
  singoutTime: string;
  mark: boolean;
  signin_image_url: string;
  work_hours?: string;
}

@Component({
  selector: 'app-attendance-emp',
  templateUrl: './attendance-emp.component.html',
  styleUrl: './attendance-emp.component.scss'
})
export class AttendanceEmpComponent implements OnInit, AfterViewInit {
  private baseCols = [
    'date',
    'singInTime',
    'singoutTime',
    'work_hours',
    'status',
    'signin_image_url',
  ];
  filterType: 'daily' | 'monthly' | 'yearly' = 'daily';
  selectedDate?: Date;
  selectedMonth?: Date;
  selectedYear?: Date;
  allAttendanceData: any[] = [];
  today: Date = new Date();
  roles: any = [];

  // Data + selection
  dataSource = new MatTableDataSource<AttendanceRecord>([]);
  selection = new SelectionModel<AttendanceRecord>(true, []);
  searchTerm = '';
  attendanceList: AttendanceRecord[] = [];

  // Toggle selection-mode
  selectionEnabled = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  originalAttendanceData: any[] = [];
  statusFilter: string = '';

  constructor(
    private DataService: DataService,
    private dialog: MatDialog,
    private AS: AuthService
  ) {}

  /** recompute columns to show "select" first when enabled **/
  get displayedColumns(): string[] {
    return this.selectionEnabled
      ? ['select', ...this.baseCols]
      : [...this.baseCols];
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data, filter) => {
      const term = filter.trim().toLowerCase();
      return (
        data.employee_code.toLowerCase().includes(term) ||
        data.employee_name.toLowerCase().includes(term) ||
        data.department_name.toLowerCase().includes(term)
      );
    };
    this.getAactiveuserdata();
    // this.loadAttendance();
  }

  getAactiveuserdata() {
    this.AS.getFunction('login/allEmplogin/' + this.AS.currentUser.Emp_Id).subscribe((res: any) => {
     this.roles = res;
     console.log(this.roles[0].Emp_ID);
     this.loadAttendance(this.roles[0].Emp_ID);
     console.log(this.roles)
    });
  }

  ngAfterViewInit(): void {
    // this.loadAttendance();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAttendance(id:any): void {
    this.DataService.getData('attendance/'+ id).subscribe((records) => {
      const withHours = records.map((r) => ({
        ...r,
        work_hours: this.calcHours(r.singInTime, r.singoutTime),
      }));
      this.attendanceList = withHours;
      // this.dataSource.data = withHours;
      this.allAttendanceData = withHours; 
      this.applyFilter();
    });
  }

  applyTextFilter() {
    this.applyFilter();
  }

  clearSearch() {
    this.searchTerm = '';
    this.applyTextFilter();
  }

  /** When Export/Enable button is clicked **/
  onExportClick() {
    if (!this.selectionEnabled) {
      this.selectionEnabled = true;
      this.selection.clear();
      return;
    }
    const ref = this.dialog.open(ExportDialogComponent, { width: '300px' });
    ref.afterClosed().subscribe((format) => {
      if (!format) return;
      const rows = this.selection.selected;
      if (!rows.length) {
        return alert('Please select at least one row.');
      }
      format === 'pdf'
        ? this.exportPDF(rows)
        : format === 'excel'
        ? this.exportExcel(rows)
        : this.exportCSV(rows);
    });
  }

  /** Checkbox helpers **/
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }
  clearSelection() {
    this.selection.clear();
  }

  /** Export methods (PDF / Excel / CSV) **/
  private exportPDF(rows: AttendanceRecord[]) {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['ID', 'Name', 'Dept', 'Date', 'In', 'Out', 'Hours', 'Status']],
      body: rows.map((r) => [
        r.employee_code || '',
        r.employee_name || '',
        r.department_name || '',
        r.date || '',
        r.singInTime || '',
        r.singoutTime || '',
        r.work_hours || '', // <-- default empty string
        !r.mark ? 'Absent' : r.singoutTime ? 'Present' : 'Partial',
      ]) as any[], // <-- cast to any[] / RowInput[]
      theme: 'grid',
    });
    doc.save('attendance.pdf');
  }

  private exportExcel(rows: AttendanceRecord[]) {
    const data = rows.map((r) => ({
      'Emp ID': r.employee_code,
      Name: r.employee_name,
      Department: r.department_name,
      Date: r.date,
      'In Time': r.singInTime,
      'Out Time': r.singoutTime,
      'Work Hours': r.work_hours,
      Status: !r.mark ? 'Absent' : r.singoutTime ? 'Present' : 'Partial',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf]), 'attendance.xlsx');
  }

  private exportCSV(rows: AttendanceRecord[]) {
    const ws = XLSX.utils.json_to_sheet(rows);
    const csv = XLSX.utils.sheet_to_csv(ws);
    saveAs(new Blob([csv], { type: 'text/csv' }), 'attendance.csv');
  }

  /** Utility to calculate hours **/
  private calcHours(inT: string, outT: string): string {
    if (!inT || !outT) return '—';
    const a = new Date(`1970-01-01T${inT}`),
      b = new Date(`1970-01-01T${outT}`),
      ms = b.getTime() - a.getTime();
    if (ms <= 0) return '—';
    const h = Math.floor(ms / 3600000),
      m = Math.floor((ms % 3600000) / 60000);
    return `${h}h ${m}m`;
  }

  /** Row click selection logic **/
  toggleSelection(row: AttendanceRecord, event: MouseEvent) {
    if (!this.selectionEnabled) return;
    if (event.ctrlKey || event.metaKey) {
      this.selection.toggle(row);
    } else if (event.shiftKey) {
      const currentIndex = this.dataSource.data.indexOf(row);
      const last = this.selection.selected[this.selection.selected.length - 1];
      const lastIndex = this.dataSource.data.indexOf(last);
      const [start, end] = [currentIndex, lastIndex].sort((a, b) => a - b);
      this.dataSource.data
        .slice(start, end + 1)
        .forEach((r) => this.selection.select(r));
    } else {
      this.selection.clear();
      this.selection.select(row);
    }
    event.stopPropagation();
  }

  loadAttendanceData() {
    this.DataService.getData('attendance').subscribe((data) => {
      this.allAttendanceData = data;
      this.dataSource.data = data;
    });
  }

  onFilterTypeChange() {
    this.selectedDate = undefined;
    this.selectedMonth = undefined;
    this.selectedYear = undefined;
    this.dataSource.data = this.allAttendanceData; // Reset filter
  }

  applyFilter() {
    let filteredData = [...this.allAttendanceData];

    // DATE FILTER
    if (this.filterType === 'daily' && this.selectedDate) {
      const selected = this.selectedDate.toISOString().split('T')[0];
      filteredData = filteredData.filter((item) =>
        item.date?.startsWith(selected)
      );
    }

    if (this.filterType === 'monthly' && this.selectedMonth) {
      const selectedMonth = this.selectedMonth.getMonth();
      const selectedYear = this.selectedMonth.getFullYear();
      filteredData = filteredData.filter((item) => {
        const date = new Date(item.date);
        return (
          date.getMonth() === selectedMonth &&
          date.getFullYear() === selectedYear
        );
      });
    }

    if (this.filterType === 'yearly' && this.selectedYear) {
      const selectedYear = this.selectedYear.getFullYear();
      filteredData = filteredData.filter((item) => {
        const date = new Date(item.date);
        return date.getFullYear() === selectedYear;
      });
    }

    // STATUS FILTER
    if (this.statusFilter) {
      filteredData = filteredData.filter((item) => {
        const isPresent = item.mark && item.singoutTime;
        const isAbsent = !item.mark;
        const isPartial = item.mark && !item.singoutTime;

        return (
          (this.statusFilter === 'present' && isPresent) ||
          (this.statusFilter === 'absent' && isAbsent) ||
          (this.statusFilter === 'partial' && isPartial)
        );
      });
    }

    // TEXT SEARCH FILTER
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.employee_code?.toLowerCase().includes(term) ||
          item.employee_name?.toLowerCase().includes(term) ||
          item.department_name?.toLowerCase().includes(term)
      );
    }

    this.dataSource.data = filteredData;
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  chosenMonthHandler(normalizedMonth: Date) {
    this.selectedMonth = normalizedMonth;
    this.applyFilter();
  }

  chosenYearHandler(normalizedYear: Date) {
    this.selectedYear = normalizedYear;
    this.applyFilter();
  }

  resetFilters() {
    this.filterType = 'daily';
    this.selectedDate = undefined;
    this.selectedMonth = undefined;
    this.selectedYear = undefined;
    this.statusFilter = '';
    this.searchTerm = '';
    this.applyFilter();
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    return date <= this.today;
  };
}
