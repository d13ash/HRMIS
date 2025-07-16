
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';
// import { DataService } from 'src/app/services/data.service';
// import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
// import { AuthService } from 'src/app/services/auth.service';

// DataService,AuthService, environment

interface gender {
  value: string;
  viewValue: string;
}

interface category {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss'],
})
export class EmployeeProfileComponent implements OnInit {
  data: any;
  State: any;
  Stateselected!: any;
  District: any;
  Block: any;
  country: any;
  documentsdata: any;

  iseditmode: boolean = true;
  images: any;
  submitted: boolean = false;
  uploadedimage: any =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1VyCFr3rHLultu7DYy5oRiJlAO-eTOSdXLRhBIfhlGQ&s;';
  uploadedimages: any;
  imagesphoto: any[] = [];
  uploadedsignature: any =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWq1fCF7KbKYum0PRRMGKnq4EBj-QT_bcSLhLsIphPeQ&s;';
  imageurl: string[] = [];
  imageurls: any;
  imageurlss: any;
  std_id: any;
  Emp_Id: any;
  registationForm!: FormGroup;
  roles: any;
  isReadOnly: boolean = true;
  roless: any;
  mapDataByid: any;
  data_id: any;
  salutationdata: any;
  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private AS: AuthService,
    private router: Router,
    private datePipe: DatePipe,
      private cdRef: ChangeDetectorRef
  ) {}

  // Inside the component class
  useCurrentAddressAsPermanent: boolean = false;

  ngOnInit(): void {
    this.getcountry();
    this.getdocuments();
    this.getsalutation();
    this.createForm();
    this.getAactiveuserdata();
  }

  getAactiveuserdata() {
    this.AS.getFunction(
      'login/userlogindetail/' + this.AS.currentUser.Emp_Id
    ).subscribe((res: any) => {
      this.roless = res;
      console.log(this.roless);
      // this.roles = res[0]['Emp_ID'];
      // console.log(this.roles);
      this.onedit(this.roless);
    });
  }
  onedit(roless: any) {
    const value = roless[0];

    // Fetch and populate dependent dropdowns for Permanent Address
    if (value.Permanent_Country_Id) {
      this.onChangeCountry(value.Permanent_Country_Id); // Fetch states
      if (value.Permanent_State_Id) {
        this.onChangeState(value.Permanent_State_Id); // Fetch districts
        if (value.Permanent_District_Id) {
          this.onChangeDistrict(value.Permanent_District_Id); // Fetch blocks
        }
      }
    }

    // Fetch and populate dependent dropdowns for Current Address
    if (value.Current_Country_Id) {
      this.onChangeCountry(value.Current_Country_Id); // Fetch states
      if (value.Current_State_Id) {
        this.onChangeState(value.Current_State_Id); // Fetch districts
        if (value.Current_District_Id) {
          this.onChangeDistrict(value.Current_District_Id); // Fetch blocks
        }
      }
    }

    // Patch basic form values
    this.registationForm.patchValue({
      Salutation_E: value.Salutation_E,
      Emp_First_Name_E: value.Emp_First_Name_E,
      Emp_Middle_Name_E: value.Emp_Middle_Name_E,
      Emp_Last_Name_E: value.Emp_Last_Name_E,
      Father_Name_E: value.Father_Name_E,
      Mother_Name_E: value.Mother_Name_E,
      Guardian_Name_E: value.Guardian_Name_E,
      Mobile_No: value.Mobile_No,
      Email_Id: value.Email_Id,
      Gender_Id: value.Gender_Id,
      DOB: value.DOB,
      Permanent_Address: value.Permanent_Address,
      Permanent_Country_Id: value.Permanent_Country_Id,
      Permanent_State_Id: value.Permanent_State_Id,
      Permanent_District_Id: value.Permanent_District_Id,
      Permanent_Block_Id: value.Permanent_Block_Id,
      Permanent_Pin_Code: value.Permanent_Pin_Code,
      Permanent_City: value.Permanent_City,
      Current_Address: value.Current_Address,
      Current_Country_Id: value.Current_Country_Id,
      Current_State_Id: value.Current_State_Id,
      Current_District_Id: value.Current_District_Id,
      Current_Block_Id: value.Current_Block_Id,
      Current_Pin_Code: value.Current_Pin_Code,
      Current_City: value.Current_City,
      Emp_Photo_Path: value.Emp_Photo_Path,
      Emp_Signature_Path: value.Emp_Signature_Path,
    });

    // Update image paths for preview
    this.uploadedimage = value.Emp_Photo_Path;
    this.uploadedsignature = value.Emp_Signature_Path;

    // Fetch and populate documents dynamically using Emp_Id
    this.ds
      .getData(`Employee_data/documentsdetail/getdocuments/${value.Emp_Id}`)
      .subscribe(
        (documents: any[]) => {
          console.log(documents);

          const documentsArray = this.registationForm.get(
            'Documents_Path_emp'
          ) as FormArray;
          documentsArray.clear(); // Clear existing FormArray

          if (documents && documents.length > 0) {
            documents.forEach((doc: any) => {
              documentsArray.push(
                this.fb.group({
                  Emp_Id: [doc.Emp_Id],
                  Document_Id: [doc.Document_Id],
                  Document_Path: [doc.Document_Path],
                })
              );
              this.imageurl.push(doc.Document_Path); // Store document URLs
            });
          }
        },
        (error) => {
          console.error('Failed to fetch documents:', error);
          Swal.fire('Error', 'Failed to fetch documents', 'error');
        }
      );

    this.iseditmode = true;
  }

  createForm() {
    this.registationForm = this.fb.group({
      Salutation_E: [null, Validators.required],
      Emp_First_Name_E: [null, Validators.required],
      Emp_Middle_Name_E: [null],
      Emp_Last_Name_E: [null, Validators.required],
      Father_Name_E: [null, Validators.required],
      Mother_Name_E: [null, Validators.required],
      Guardian_Name_E: [null],
      Mobile_No: [
        null,
        [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')],
      ],
      Email_Id: [null, [Validators.required, Validators.email]],
      Gender_Id: [null, Validators.required],
      DOB: [null, Validators.required],

      Permanent_Address: [null, Validators.required],
      Permanent_Country_Id: [null, Validators.required],
      Permanent_State_Id: [null, Validators.required],
      Permanent_District_Id: [null, Validators.required],
      Permanent_Block_Id: [null, Validators.required],
      Permanent_Pin_Code: [
        null,
        [
          Validators.required,
          Validators.pattern('^[0-9]{6}$'), // Exactly 6 digits
        ],
      ],
      Permanent_City: [null, Validators.required],
      Current_Address: [null, Validators.required],
      Current_Country_Id: [null, Validators.required],
      Current_State_Id: [null, Validators.required],
      Current_District_Id: [null, Validators.required],
      Current_Block_Id: [null, Validators.required],
      Current_Pin_Code: [
        null,
        [Validators.required, Validators.pattern('^[0-9]{6}$')],
      ],
      Current_City: [null, Validators.required],

      Emp_Photo_Path: [null],
      Emp_Signature_Path: [null],

      Documents_Path_emp: this.fb.array([
        this.fb.group({
          Emp_Id: [null],
          Document_Id: [null],
          Document_Path: [null],
        }),
      ]),
    });
  }

  // Inside the component class
  onChangeUseCurrentAddressAsPermanent(event: MatCheckboxChange) {
    this.useCurrentAddressAsPermanent = event.checked;

    if (this.useCurrentAddressAsPermanent) {
      this.registationForm.patchValue({
        Permanent_Address: this.registationForm.get('Current_Address')?.value,
        Permanent_Country_Id:
          this.registationForm.get('Current_Country_Id')?.value,
        Permanent_State_Id: this.registationForm.get('Current_State_Id')?.value,
        Permanent_District_Id: this.registationForm.get('Current_District_Id')
          ?.value,
        Permanent_Block_Id: this.registationForm.get('Current_Block_Id')?.value,
        Permanent_Pin_Code: this.registationForm.get('Current_Pin_Code')?.value,
        Permanent_City: this.registationForm.get('Current_City')?.value,
      });
    } else {
      // You can reset the permanent address fields to null if needed.
      this.registationForm.patchValue({
        Permanent_Address: null,
        Permanent_Country_Id: null,
        Permanent_State_Id: null,
        Permanent_District_Id: null,
        Permanent_Block_Id: null,
        Permanent_Pin_Code: null,
        Permanent_City: null,
      });
    }
  }

  get documentcontrol(): FormArray {
    //this is get the skills(formarray) form demoform(formgroup)
    return this.registationForm.get('Documents_Path_emp') as FormArray;
  }

  addDocuments() {
    //adding formgroup in skills formarray
    (<FormArray>this.registationForm.get('Documents_Path_emp')).push(
      this.Create_Documents()
    ); //here get method can return value in any type(formgroup,formarray,formcontrol) so we have to explicitly type cast this value, from which it return value as formarray
  }

  Create_Documents(): FormGroup {
    //defining formgroup for skills formarray
    return this.fb.group({
      Emp_Id: [null],
      Document_Id: [null],
      Document_Path: [null],
    });
  }

  getcountry() {
    this.ds.getData('Employee_data').subscribe((res) => {
      this.country = res;
    });
  }

  getdocuments() {
    this.ds.getData('Employee_data/documents').subscribe((res) => {
      this.documentsdata = res;
    });
  }

  getsalutation() {
    this.ds.getData('Employee_data/sal/salutations').subscribe((res) => {
      this.salutationdata = res;
      console.log(this.salutationdata);
    });
  }

  onChangeCountry(Country_id: any) {
    this.ds.getData('Employee_data/' + Country_id).subscribe((res) => {
      this.State = res;
    });
  }
  onChangeState(State_id: any) {
    this.ds.getData('Employee_data/Statename/' + State_id).subscribe((res) => {
      this.District = res;
    });
  }
  onChangeDistrict(Dist_Id: any) {
    this.ds
      .getData('Employee_data/Districtname/' + Dist_Id)
      .subscribe((res) => {
        this.Block = res;
      });
  }

  Gender = [
    { value: 'M', viewValue: 'Male' },
    { value: 'F', viewValue: 'Female' },
    { value: 'O', viewValue: 'Other' },
  ];

  category: category[] = [
    { value: '1', viewValue: 'GENERAL' },
    { value: '2', viewValue: 'OBC' },
    { value: '3', viewValue: 'SC/ST' },
    { value: '3', viewValue: 'OTHERS' },
  ];


onReset(): void {
  this.submitted = false;

  /* 1. clear form values */
  this.registationForm.reset();

  /* 2. return controls to a pristine / untouched state */
  this.registationForm.markAsPristine();
  this.registationForm.markAsUntouched();
  this.registationForm.updateValueAndValidity();

  /* 3. clear file previews & arrays */
  this.uploadedimage   = null;          // photo preview
  this.uploadedsignature = null;          // signature preview
  this.imageurls       = null;          // saved photo url
  this.imageurlss      = null;          // saved signature url
  this.images          = null;          // last selected File
  this.imageurl.length = 0;             // document preview list

  /* 4. reset document form‑array */
  this.documentcontrol.clear();
  this.addDocuments();                  // leave one empty row if you like

  /* 5. reset helper flags */
  this.useCurrentAddressAsPermanent = false;

  /* 6. trigger change detection (only needed if you notice UI lag) */
  this.cdRef.detectChanges();
}

  selectDocument(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      // Validate file type (e.g., allow PDFs, images, etc.)
      const allowedTypes = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/jpg',
      ];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire(
          'Invalid file type',
          'Please select a valid document',
          'error'
        );
        return;
      }

      this.images = file; // Store file for blob upload
    }
  }

  uploadDocument(index: number) {
    if (!this.images) {
      Swal.fire(
        'No file selected',
        'Please select a document to upload',
        'error'
      );
      return;
    }

    const formData = new FormData();
    formData.append('Document_Path', this.images);

    this.ds.postData('Employee_data/uploadfiles', formData).subscribe(
      (result: any) => {
        const documentPath = result['profile_url'];
        (this.registationForm.get('Documents_Path_emp') as FormArray)
          .at(index)
          .patchValue({ Document_Path: documentPath });

        Swal.fire('Document uploaded successfully');
      },
      (error) => {
        Swal.fire('Upload failed', 'An error occurred during upload', 'error');
      }
    );
  }

  nopath() {
    Swal.fire('please select a file');
  }
  selectPhoto(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      // Validate file type and size
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      const maxSize = 100 * 1024; // 100 KB
      if (!allowedTypes.includes(file.type)) {
        Swal.fire('Invalid file type', 'Please select an image file', 'error');
        return;
      }
      if (file.size > maxSize) {
        Swal.fire(
          'File too large',
          'Please select a file smaller than 100 KB',
          'error'
        );
        return;
      }

      // Convert to Blob and preview
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.uploadedimage = event.target.result;
        this.images = file; // Store file for blob upload
      };
    }
  }

 uploadPhoto() {
  if (!this.images) {
    Swal.fire('No file selected', 'Please select an image to upload', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('Emp_Photo_Path', this.images);

  this.ds.postData('Employee_data/uploadfile', formData).subscribe(
    (result: any) => {
      const relativePath = result['profile_url']; // "/uploads/employeedata/profile_....jpg"
      this.imageurls = environment.rootUrl + relativePath.replace(/^\/+/, ''); // full URL
      this.uploadedimage = this.imageurls; // set preview
      Swal.fire('Photo uploaded successfully');
    },
    (error) => {
      Swal.fire('Upload failed', 'An error occurred during upload', 'error');
    }
  );
}

  selectSignature(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      // Validate file type and size
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      const maxSize = 100 * 1024; // 100 KB
      if (!allowedTypes.includes(file.type)) {
        Swal.fire('Invalid file type', 'Please select an image file', 'error');
        return;
      }
      if (file.size > maxSize) {
        Swal.fire(
          'File too large',
          'Please select a file smaller than 100 KB',
          'error'
        );
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.uploadedsignature
         = event.target.result;
        this.images = file; // Store file for blob upload
      };
    }
  }



uploadSignature() {
  if (!this.images) {
    Swal.fire(
      'No file selected',
      'Please select an image to upload',
      'error'
    );
    return;
  }

  const formData = new FormData();
  formData.append('Emp_Signature_Path', this.images);

  this.ds.postData('Employee_data/uploadfilesig', formData).subscribe(
    (result: any) => {
      const relativePath = result['profile_url']; // e.g., /uploads/employeedata/signature_....jpg
      this.imageurlss = environment.rootUrl + relativePath.replace(/^\/+/, '');
      this.uploadedsignature = this.imageurlss; // used for preview
      Swal.fire('Signature uploaded successfully');
    },
    (error) => {
      Swal.fire('Upload failed', 'An error occurred during upload', 'error');
    }
  );
}


  patchStdIdValue(index: number, stdId: any) {
    const control = this.documentcontrol.at(index).get('std_id');
    if (control) {
      control.patchValue(stdId);
    }
  }

  async Registration() {
    this.registationForm.patchValue({
      DOB: this.datePipe.transform(
        this.registationForm.get('DOB')?.value,
        'yyyy-MM-dd'
      ),
      Emp_Photo_Path: this.imageurls,
      Emp_Signature_Path: this.imageurlss,
    });
    try {
      const formGroupValue = this.registationForm.value;
      const formArrayValue = formGroupValue.Documents_Path_emp;
      delete formGroupValue.Documents_Path_emp;

      const stdIds = this.imageurl; // Replace with your static std_id values
      if (stdIds && stdIds.length > 0) {
        formArrayValue.forEach((item: any, index: number) => {
          if (index < stdIds.length) {
            //  item.std_id = stdIds[index];
            item.Document_Path = stdIds[index];
            this.patchStdIdValue(index, stdIds[index]);
          }
        });
      } else {
        console.error('No Document_Id values found.');
      }

      const response1 = await this.ds
        .putData(
          'Employee_Data/updateuserdata/' + this.AS.currentUser.Emp_Id,
          formGroupValue
        )
        .toPromise();
      console.log(response1);
      this.Emp_Id = response1;
      for (const item of formArrayValue) {
        console.log(item);
        item.Emp_Id = this.Emp_Id.id;
        const response2 = this.ds
          .postData('Employee_data/documentsdetail/adddocuments', item)
          .toPromise();
      }
      Swal.fire('Data Saved successfully');
      this.onReset();
    } catch (error) {
      // Handle any errors
      console.error('Error', error);
    }
  }
}
