// Modified card-home.component.ts file with counter animation logic and SSR compatibility
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-card-home',
  templateUrl: './card-home.component.html',
  styleUrls: ['./card-home.component.scss']
})
export class CardHomeComponent implements OnInit, AfterViewInit {
  countProjectData: any;
  projectCountValue: number = 0;
  countWorkData: any;
  workCountValue: number = 0;
  countEmpData: any;
  empCountValue: number = 0;
  leavesCount: number = 17;
  countersAnimated: boolean = false;
  isBrowser: boolean;

  constructor(
    private ds: DataService,
    private as: AuthService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Check if we're in the browser or on the server
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.countProject();
    this.countWork();
    this.countEmp();
  }

  ngAfterViewInit(): void {
    // Set up intersection observer for counter animation
    // Use setTimeout to ensure it runs after the component is fully rendered
    setTimeout(() => {
      this.setupCounterAnimation();
    }, 0);
  }

  countProject() {
    this.ds.getData('dashboardContent/projectCount').subscribe((res) => {
      this.countProjectData = res;
      console.log(this.countProjectData);
      this.projectCountValue = this.countProjectData[0].project_count;
      console.log(this.projectCountValue);
    });
  }

  countWork() {
    this.ds.getData('dashboardContent/workCount').subscribe((res) => {
      this.countWorkData = res;
      console.log(this.countWorkData);
      this.workCountValue = this.countWorkData[0].countdata;
      console.log(this.workCountValue);
    });
  }

  countEmp() {
    this.ds.getData('dashboardContent/empCount').subscribe((res) => {
      this.countEmpData = res;
      console.log(this.countProjectData);
      this.empCountValue = this.countEmpData[0].empCount;
      console.log(this.empCountValue);
    });
  }

  // Setup counter animation using Intersection Observer API
  setupCounterAnimation() {
    // Skip if not in browser environment
    if (!this.isBrowser) {
      return;
    }

    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
      const countsSection = document.getElementById('counts');
      if (!countsSection) {
        setTimeout(() => this.setupCounterAnimation(), 500);
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.countersAnimated) {
            this.animateCounters();
            this.countersAnimated = true;
            observer.disconnect();
          }
        });
      }, { threshold: 0.1 });

      observer.observe(countsSection);
    } else {
      // Fallback for browsers that don't support Intersection Observer
      setTimeout(() => this.animateCounters(), 1000);
    }
  }

  // Animate counter values
  animateCounters() {
    // Skip if not in browser environment
    if (!this.isBrowser) {
      return;
    }

    const animateValue = (start: number, end: number, duration: number, element: HTMLElement) => {
      if (start === end) return;

      // Ensure we have valid numbers to prevent NaN errors
      end = isNaN(end) ? 0 : end;

      const range = end - start;
      const increment = end > start ? 1 : -1;
      const stepTime = Math.abs(Math.floor(duration / Math.max(1, range))); // Prevent division by zero
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (element) {
          element.textContent = current.toString();
        }

        if (current === end) {
          clearInterval(timer);
        }
      }, stepTime);
    };

    // Get all counter elements
    const projectCounter = document.getElementById('projectCounter');
    const workCounter = document.getElementById('workCounter');
    const empCounter = document.getElementById('empCounter');
    const leavesCounter = document.getElementById('leavesCounter');

    // Animate each counter if the element exists
    if (projectCounter) animateValue(0, this.projectCountValue, 2000, projectCounter);
    if (workCounter) animateValue(0, this.workCountValue, 2000, workCounter);
    if (empCounter) animateValue(0, this.empCountValue, 2000, empCounter);
    if (leavesCounter) animateValue(0, this.leavesCount, 2000, leavesCounter);
  }
}
