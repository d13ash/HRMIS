import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';
// import { environment } from 'src/environments/environment';

// environment


@Injectable({
  providedIn: 'root'
})
export class DataService {
  postapi: any;
  updateDataa(arg0: string, value: any) {
    throw new Error('Method not implemented.');
  }
  configUrl: any = environment.rootUrl;
  constructor(private http: HttpClient) { }

  url = "http://localhost:3000/api/departmentDetail"
  projectURL = "http://localhost:3000/api/projectDetail"
  mapprojecturl = 'http://localhost:3000/api/map_dept_project'

  getData(functionName: any) {
    return this.http.get<any[]>(this.configUrl + functionName)
  }


  postData(functionName: any, data: any) {
    return this.http.post(this.configUrl + functionName, data)
  }
  pData(functionName: any, data: any) {
    return this.http.post(this.configUrl + functionName, data)
  }


  Delete_Data(ID: any) {
    return this.http.delete(`${this.configUrl}${ID}`)
  }


  deleteDataservice(ID: any) {
    return this.http.delete(`${this.mapprojecturl}/${ID}`)
  }

  deleteData(Dept_ID: any) {
    return this.http.delete(`${this.url}/${Dept_ID}`)
  }

  DeleteassignData(resource_assignment_main_ID: any) {
    return this.http.delete(`${this.configUrl}${resource_assignment_main_ID}`)
  }



  deleteProjectData(Project_ID: any) {
    return this.http.delete(`${this.projectURL}/${Project_ID}`)
  }

  updateMapData(ID: any, data: any) {
    return this.http.put(`${this.configUrl}/${ID}`, data);
  }


  putData(ID: any, data: any) {
    return this.http.put(`${this.configUrl}${ID}`, data);
  }

  updateData(Dept_ID: any, data: any) {
    return this.http.put(`${this.url}/${Dept_ID}`, data);
  }
  // return this._http.put(`${this.apiUrl}/${id}`,data);

  getdepart_typedata(functionName: any) {
    return this.http.get("http://localhost:3000/api/departmentDetail" + functionName)
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.configUrl}Student_data/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  del(functionName: string, id: any) {
    return this.http.delete(this.configUrl + functionName + id)
  }
  getOne(functionName: string, id: any) {
    return this.http.get<any[]>(this.configUrl + functionName + id)
  }
  put(functionName: string,data:any) {
    return this.http.put(this.configUrl + functionName, data)
  }
  
}