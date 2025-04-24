import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  private sharedData: any;

  setData(data: any) {
    this.sharedData = data;
  }

  getData() {
    return this.sharedData;
 }



  postapi: any;
  updateDataa(arg0: string, value: any) {
    throw new Error('Method not implemented.');
  }
  configUrl: any = environment.rootUrl;
  constructor(private http: HttpClient) { }

}
