import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, map, shareReplay } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  isMobile: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isMobile = this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  toaboutus() {
    document.getElementById("about-usss")?.scrollIntoView({ behavior: 'smooth' });
  }

  contactus() {
    document.getElementById("contact-usss")?.scrollIntoView({ behavior: 'smooth' });
  }

  service() {
    document.getElementById("services-usss")?.scrollIntoView({ behavior: 'smooth' });
  }

  portfolio() {
    document.getElementById("portfolio-usss")?.scrollIntoView({ behavior: 'smooth' });
  }
}
