import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  Emp_Id: any = '';
  Full_name: any;
  messageEmitter = new EventEmitter<Object>();

  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    private helper: JwtHelperService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getFunction(functionName: string): Observable<any> {
    return this.http.get(`${environment.rootUrl}${functionName}`).pipe(
      tap(res => res),
      catchError(err => {
        console.error('API Error:', err);
        return throwError(() => new Error(err));
      })
    );
  }

  userlogin(credentials: any): Observable<any> {
    return this.http.post(`${environment.rootUrl}login`, credentials).pipe(
      map((res: any) => {
        if (res?.token && this.isBrowser) {
          localStorage.setItem('token', res.token);
        }
        return res;
      })
    );
  }

  get currentUser() {
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      if (token && !this.helper.isTokenExpired(token)) {
        return this.helper.decodeToken(token);
      } else {
        this.logout();
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      return !!token && !this.helper.isTokenExpired(token);
    }
    return false;
  }

  logout(): void {
    const user = this.currentUser;
    if (user?.Emp_Id) {
      this.http.get(`${environment.rootUrl}common/logout/${user.Emp_Id}`).subscribe({
        next: () => {
          // Handle successful logout if needed
        },
        error: err => {
          console.error('Logout error:', err);
        }
      });
    }

    if (this.isBrowser) {
      localStorage.removeItem('token');
    }

    this.router.navigate(['/login']);
  }

  // Placeholder method — implement this if needed
  updateFunction(key: string, value: any) {
    throw new Error('Method not implemented.');
  }
}
