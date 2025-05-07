import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  toaboutus(){
    document.getElementById("about-usss")?.scrollIntoView({behavior:'smooth'})
  }

  contactus(){
    document.getElementById("contact-usss")?.scrollIntoView({behavior:'smooth'})
  }

  service(){
    document.getElementById("services-usss")?.scrollIntoView({behavior:'smooth'})
  }

  portfolio(){
    document.getElementById("portfolio-usss")?.scrollIntoView({behavior:'smooth'})
  }
}
