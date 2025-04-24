import { HttpClient } from '@angular/common/http';
import { EventEmitter,  } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Inject, Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  updateFunction(arg0: string, value: any) {
    throw new Error('Method not implemented.');
  }
  Emp_Id: any = '';
  Full_name: any;

  constructor(private http: HttpClient, private router: Router,@Inject(JwtHelperService) private helper: JwtHelperService) { }


  getFunction(functionName: any) {
    return this.http.get(environment.rootUrl + functionName).pipe(tap(res => res), catchError(e => {
      throw new Error(e);
    }));
  }

  userlogin(credentials: any): Observable<any> {
    return this.http.post(environment.rootUrl + 'login', credentials).pipe(map((res: any) => {
      if (res && res.token) {
        localStorage.setItem('token', res.token)
      }
      return res;
    }))
  }

  messageEmitter = new EventEmitter<Object>();

  get currentUser() {
    const token = localStorage.getItem('token')
    if (token) {
      if (!this.helper.isTokenExpired(token)) {
        return this.helper.decodeToken(token)

      } else {
        this.logout()
      }
    }
  }

  logout() {
    if (this.currentUser) {
      this.http.get(environment.rootUrl + 'common/logout/' + this.currentUser.Emp_Id).subscribe((res: any) => {
        // Handle the response or perform any necessary actions
      });
    }
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
}


}
