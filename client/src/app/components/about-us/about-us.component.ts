import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  imageSources: string[] = [
    '../../../assets/slider4.jpg',
    '../../../assets/slider2.jpg',
    '../../../assets/slider3.jpg',
    // Add more image URLs as needed
  ];

  currentImageIndex = 0;
  currentImageUrl = this.imageSources[this.currentImageIndex];

  ngOnInit(): void {
    // this.startImageSlideshow();
  }

  // startImageSlideshow(): void {
  //   setInterval(() => {
  //     this.currentImageIndex = (this.currentImageIndex + 1) % this.imageSources.length;
  //     this.currentImageUrl = this.imageSources[this.currentImageIndex];
  //   }, 3000); // Change image every 3 seconds (adjust the duration as needed)
  // }
}