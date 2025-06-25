import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  showLoginBox = false;

  openLoginBox() {
    this.showLoginBox = true;
  }

  closeLoginBox() {
    this.showLoginBox = false;
  }
}
