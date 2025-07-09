import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
// import { DataService } from 'src/app/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { DataService } from '../../../services/data.service';

// DataService
@Component({
  selector: 'app-financial-post',
  templateUrl: './financial-post.component.html',
  styleUrls: ['./financial-post.component.scss'],
})
export class FinancialPostComponent implements OnInit {
  displayedColumns = [
    'finance_post_main_id',
    'Project_name',
    'Financial_name',
    'PI_ref_no',
    'Work_order_ref_no',
    'View',
    'Action',
  ];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) MatSort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef;
  form!: FormGroup;
  projectType: any;
  FYear: any;
  postList: any;
  projectList: any;
  allDetail: any;
  allPreviwDetail: any;
  useFinancialYear: any;
  useProject: any;
  isEdit: boolean = false;
  f_id: any;
  fm_id: any;
  fileUrl: { pi?: string; wo?: string } = {};
  files: { pi?: any; wo?: any } = {};
  formData: FormData = new FormData();

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private datepipe: DatePipe,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.postDetailsGroup();
    this.getYear();
    this.getonTable();
  }

  postDetailsGroup() {
    this.form = this.fb.group({
      Project_ID: [null, Validators.required],
      PI_ref_no: [null, Validators.required],
      Work_order_ref_no: [null, Validators.required],
      PI_refferal_doc: [null, Validators.required],
      Work_order_doc: [null, Validators.required],
      Financial_id: [null, Validators.required],
      postArray: this.fb.array([this.createPost()], Validators.minLength(1)), // ✅ At least one required
    });
  }

  onChangeProject(pid: any) {
    if (!pid) {
      Swal.fire('Invalid', 'Project not selected.', 'warning');
      return;
    }
    this.ds.getData('Financialyear_post/getPost/' + this.f_id + '/' + pid).subscribe((result) => {
      this.postList = result;
    });
  }

  getYear() {
    this.ds
      .getData('Financialyear_post/getFinancialYear')
      .subscribe((result) => {
        this.FYear = result;
      });
  }

  getonTable() {
    this.ds
      .getData('Financialyear_post/PostPreviewDetail')
      .subscribe((result: any) => {
        this.allDetail = result;
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.MatSort;
      });
  }

  get post(): FormArray {
    return this.form.get('postArray') as FormArray;
  }

  createPost(): FormGroup {
    return this.fb.group({
      yearly_post_detail_id: [''],
      Post_id: ['', Validators.required],
      Start_date: ['', [Validators.required]],
      End_date: ['', Validators.required],
      Salary: [null, [Validators.required, Validators.min(0)]],
      Description: [''],
    });
  }

  addPost() {
    this.post.push(this.createPost());
  }

  removePost(index: number) {
    this.post.removeAt(index);
  }

  onChangeFYear(Financial_id: any) {
    // this.ds
    //   .getData('Financialyear_post/getPost/' + Financial_id)
    //   .subscribe((res) => {
    //     this.postList = res;
    //   });
    if (!Financial_id) {
      Swal.fire('Invalid', 'Financial year not selected.', 'warning');
      return;
    }
    this.f_id = Financial_id;
    this.ds.getData('Financialyear_post/getProject/' + Financial_id).subscribe((result) => {
      this.projectType = result;
    });
  }

  onChangePost(postIndex: number, postId: any) {
    if (!postId || !this.postList) return;
    // Find the post in postList by Post_id
    const found = this.postList.find((p: any) => p.Post_ID == postId || p.Post_id == postId);
    if (found) {
      const postArray = this.form.get('postArray') as FormArray;
      const postGroup = postArray.at(postIndex) as FormGroup;
      // Patch Start_date and End_date
      postGroup.patchValue({
        Start_date: found.Start_date || '',
        End_date: found.End_date || ''
      });
    }
  }

  convertFormToFormData() {
    this.formData = new FormData();
    this.formData.append('Project_ID', this.form.get('Project_ID')?.value);
    this.formData.append('PI_ref_no', this.form.get('PI_ref_no')?.value);
    this.formData.append(
      'Work_order_ref_no',
      this.form.get('Work_order_ref_no')?.value
    );
    this.formData.append('Financial_id', this.form.get('Financial_id')?.value);
    if (this.files.pi) {
      this.formData.append('PI_refferal_doc', this.files.pi);
    }
    if (this.files.wo) {
      this.formData.append('Work_order_doc', this.files.wo);
    }
    const postArray = this.form.get('postArray')?.value.map((item: any) => {
      return {
        ...item,
        Start_date: this.datepipe.transform(item.Start_date, 'yyyy-MM-dd'),
        End_date: this.datepipe.transform(item.End_date, 'yyyy-MM-dd'),
      };
    });
    this.formData.append('postArray', JSON.stringify(postArray));
  }
  onSubmit() {
    if (this.form.valid) {
      this.convertFormToFormData();
      this.ds
        .postData('Financialyear_post/addFinancialPost', this.formData)
        .subscribe({
          next: (res) => {
            Swal.fire(
              'Success',
              'Financial Post Added Successfully!',
              'success'
            );

            // Reset all state
            this.resetFormState();

            // Reload data
            this.getonTable();

            // Scroll to top
            const el = document.getElementById('projectform');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Update UI
            this.cdRef.detectChanges();
          },
          error: (err) => {
            Swal.fire('Error', 'Failed to add Financial Post', 'error');
          },
        });
    } else {
      this.form.markAllAsTouched();
      Swal.fire('Invalid', 'Please fill all required fields.', 'warning');
    }
  }

  markFormGroupPristine(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormControl) {
        control.markAsPristine();
        control.markAsUntouched();
        control.updateValueAndValidity();
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupPristine(control); // recurse
      }
    });

    formGroup.markAsPristine();
    formGroup.markAsUntouched();
    formGroup.updateValueAndValidity();
  }

  resetFormState() {
    // Reset main form fields
    this.form.reset();

    // Clear and reinitialize FormArray
    const postArray = this.form.get('postArray') as FormArray;
    postArray.clear();
    this.addPost(); // Add an empty one if needed

    // Clear uploaded file states
    this.fileUrl = {};
    this.files = {};
    this.formData = new FormData();

    // Reset ID and edit mode
    this.isEdit = false;
    this.f_id = null;
    this.fm_id = null;

    // Mark all controls as pristine and untouched
    this.markFormGroupPristine(this.form);

    // Reset file input if needed
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  async onedit(fm_id: any) {
    this.isEdit = true;
    this.fm_id = fm_id;
    // Extract filename with extension from URL
    const getFileNameFromUrl = (url: string): string => {
      return url.split('/').pop() || 'downloaded_file';
    };

    this.ds
      .getOne('Financialyear_post/PostPreviewDetail/', fm_id)
      .subscribe(async (result: any) => {
        document
          .getElementById('projectform')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.form.patchValue({
          Project_ID: result[0].Project_ID,
          Financial_id: result[0].Financial_id,
          PI_ref_no: result[0].PI_ref_no,
          Work_order_ref_no: result[0].Work_order_ref_no,
        });
        // Set URLs for preview

        this.fileUrl['pi'] = result[0].PI_refferal_doc;

        const piFileName = getFileNameFromUrl(result[0].PI_refferal_doc);
        this.files['pi'] = await this.fetchFile(
          result[0].PI_refferal_doc,
          piFileName
        );

        this.form.patchValue({ PI_refferal_doc: this.files['pi'] });

        this.fileUrl['wo'] = result[0].Work_order_doc;
        const woFileName = getFileNameFromUrl(result[0].Work_order_doc);
        this.files['wo'] = await this.fetchFile(
          result[0].Work_order_doc,
          woFileName
        );

        this.form.patchValue({ Work_order_doc: this.files['wo'] });
        this.form.get('Work_order_doc')?.updateValueAndValidity();
        this.form.get('PI_refferal_doc')?.updateValueAndValidity();
        this.onChangeFYear(result[0].Financial_id);
        this.onChangeProject(result[0].Project_ID);
      });

    this.ds.getData('Financialyear_post/postArray/' + fm_id).subscribe(
      (res) => {
        this.patchPostArray(res);
      },
      (err) => {
        Swal.fire('Error', 'Failed to get Post', 'error');
        console.log(err);
      }
    );
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
  }
  onClear() {
    this.resetFormState();
    this.cdRef.detectChanges();
  }

  onUpdate() {
    if (this.fm_id == null) {
      Swal.fire('Error', 'No ID Selected', 'error');
      return;
    }

    for (const field in this.form.controls) {
      const control = this.form.get(field);
      if (control?.invalid) {
        console.warn(`Invalid field: ${field}`, control.errors);
      }
    }

    if (this.form.valid) {
      this.convertFormToFormData();
      this.ds
        .put(
          'Financialyear_post/updateFinancialPost/' + this.fm_id,
          this.formData
        )
        .subscribe({
          next: (res) => {
            Swal.fire(
              'Success',
              'Financial Post Updated Successfully!',
              'success'
            );
            this.getonTable();
            this.resetFormState();
            this.cdRef.detectChanges();
            (this.form.get('postArray') as FormArray).clear();
            this.addPost();
            this.fileUrl = {};
            this.files = {};
            this.formData = new FormData();
            this.isEdit = false;
            this.fm_id = null;
            this.form.markAsPristine();
            this.form.markAsUntouched();
            this.cdRef.detectChanges();
          },
          error: (err) => {
            Swal.fire('Error', 'Failed to add Financial Post', 'error');
          },
        });
    } else {
      Swal.fire('Invalid', 'Please fill all required fields.', 'warning');
    }
  }
  ondelete(fm_id: any) {
    this.ds.deleteFinancePostById(fm_id).subscribe({
      next: (res: any) => {
        // console.log('Delete response:', res);
        if (res.success) {
          Swal.fire('Deleted!', 'Data deleted successfully.', 'success');
          this.getonTable();
        } else {
          // console.error('Delete failed:', res.message);
          Swal.fire('Failed', 'Failed to delete data', 'error');
        }
      },
      error: (err) => {
        // console.error('Delete API error:', err);
        Swal.fire(
          'Error',
          'Failed to delete data due to server error.',
          'error'
        );
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getPreview(finance_post_main_id: any) {
    this.ds
      .getData('Financialyear_post/bbbbbb/' + finance_post_main_id)
      .subscribe((result: any) => {
        this.allPreviwDetail = result;
        // console.log(this.allPreviwDetail[0]['Project_name']);
        this.useProject = this.allPreviwDetail[0]['Project_name'];
        this.useFinancialYear = this.allPreviwDetail[0]['Financial_name'];
        document.getElementById('addnews')?.scrollIntoView();
      });
  }

  onFileSelect(event: Event, mode: 'pi' | 'wo') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.files[mode] = file;
      // Generate a blob URL for preview/download
      const fileUrl = URL.createObjectURL(file);
      this.fileUrl[mode] = fileUrl;
      if (mode === 'pi') {
        this.form.patchValue({ PI_refferal_doc: file });
        this.form.get('PI_refferal_doc')?.updateValueAndValidity();
      } else if (mode === 'wo') {
        this.form.patchValue({ Work_order_doc: file });
        this.form.get('Work_order_doc')?.updateValueAndValidity();
      }
    }
  }

  async fetchFile(url: string, fileName: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  }

  patchPostArray(posts: any[]) {
    const postArray = this.form.get('postArray') as FormArray;
    postArray.clear();

    posts.forEach((post) => {
      postArray.push(
        this.fb.group({
          yearly_post_detail_id: [post.yearly_post_detail_id],
          Post_id: [post.Post_id],
          Start_date: [post.Start_date],
          End_date: [post.End_date],
          Salary: [post.Salary],
          Description: [post.Description],
        })
      );
    });
  }
}
