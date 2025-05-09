import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
    standalone: true,
    selector: 'app-revenue-stream-widget',
    imports: [CommonModule, ChartModule],
    template: `
    <div class="card">
        <h2 class="text-xl font-semibold mb-4">Revenue Stream Overview</h2>
        <p-chart type="doughnut" [data]="chartData" [options]="chartOptions"></p-chart>
    </div>
    `
})
export class RevenueStreamWidget implements OnInit {
    chartData: any;
    chartOptions: any;

    ngOnInit() {
        this.chartData = {
            labels: ['HR', 'IT', 'Admin', 'Finance', 'Project'],
            datasets: [{
                data: [50, 25, 10, 8, 7],
                backgroundColor: ['#42A5F5', '#66BB6A', '#FF9800', '#FF5722', '#FF4081'],
                hoverBackgroundColor: ['#42A5F5', '#66BB6A', '#FF9800', '#FF5722', '#FF4081']
            }]
        };

        this.chartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#495057'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem: { label: string; raw: string; }) {
                            return tooltipItem.label + ': ' + tooltipItem.raw + '%';
                        }
                    }
                }
            },
            maintainAspectRatio: false,
            cutoutPercentage: 50, // Optional, for a doughnut chart effect
            elements: {
                arc: {
                    borderWidth: 0 // Optional, to remove the border between segments
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };
    }
}
