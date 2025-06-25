import { Component, OnInit } from '@angular/core';
// import { DataService } from 'src/app/services/data.service';
import { forkJoin } from 'rxjs';
import { Chart } from 'chart.js/auto';
import { DataService } from '../../services/data.service';

// DataService
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  chart: any;

  constructor(private ds: DataService) {}

  ngOnInit(): void {
    this.getData();
  }

  projectData: any = [];

  getData() {
    forkJoin([
      this.ds.getData('projectWorkAllotment/getWorkCount'),
      this.ds.getData('projectWorkAllotment/getApprove')
    ]).subscribe(
      ([workCountRes, approvalCountRes]: [any, any]) => {
        const countData = workCountRes;
        const countApproval = approvalCountRes;
        this.processData(countData, countApproval);
        this.createChart();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  processData(countData: any[], countApproval: any[]) {
    countData.forEach((element: any) => {
      const item = countApproval.find((item: any) => item.Project_name === element.Project_name);
      const percent = item ? Math.floor((item.TotalWor / element.totalWork) * 100) : 0;
      this.projectData.push({ projectName: element.Project_name, percent });
    });
  }

  createChart() {
    const backgroundColors = [
      'grey', 'green', 'pink', 'orange', 'purple', 'yellow', 'red', 'cyan', 'magenta', 'brown'
    ];
    this.chart = new Chart('chart1', {
      type: 'bar',
      data: {
        labels: this.projectData.map((data: any) => data.projectName),
        datasets: [
          {
            label: 'Progress Percent',
            data: this.projectData.map((data: any) => data.percent),
            backgroundColor: backgroundColors.slice(0, this.projectData.length) ,// Use different colors for each bar
            borderColor: 'dark-grey',
          borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 100 // Set the maximum value for Y-axis to 100
          }
        }
      }
    });
  }
}