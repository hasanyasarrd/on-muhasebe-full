import { Component, OnInit, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ExcelExportService } from '../../services/excel-export.service';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-project-profit-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule, RouterModule],
  template: `
    <div style="max-width: 800px; margin: 20px auto;">
      <h3>📊 Proje Kâr/Zarar Grafiği</h3>

      <canvas baseChart
              [data]="barChartData"
              [options]="barChartOptions"
              [type]="'bar'">
      </canvas>

      <button (click)="exportProfitData()" class="export-btn">
        📤 Kâr-Zarar Verisini Excel’e Aktar
      </button>

      <a routerLink="/" class="back-home">⬅️ Ana Sayfa</a>
    </div>

    <style>
      .export-btn {
        margin-top: 20px;
        background: #4CAF50;
        color: white;
        padding: 10px 16px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
      }
      .export-btn:hover {
        background: #388E3C;
      }

      .back-home {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #eee;
        padding: 10px 14px;
        border-radius: 8px;
        color: #333;
        text-decoration: none;
        font-weight: bold;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        transition: background 0.2s ease;
      }
      .back-home:hover {
        background: #ddd;
      }
    </style>
  `
})
export class ProjectProfitChartComponent implements OnInit {
  private dataService = inject(DataService);

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Gelir' },
      { data: [], label: 'Gider' },
      { data: [], label: 'Kâr/Zarar' }
    ]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true
  };

  constructor(private excelExportService: ExcelExportService) {}

  ngOnInit(): void {
    this.dataService.loadInitialData(); // sayfa yenilense bile veriler gelsin

    this.dataService.projects$.pipe(take(1)).subscribe(projects => {
      this.dataService.projectPersons$.pipe(take(1)).subscribe(assignments => {
        this.dataService.persons$.pipe(take(1)).subscribe(persons => {
          const labels: string[] = [];
          const incomes: number[] = [];
          const costs: number[] = [];
          const profits: number[] = [];

          for (let project of projects) {
            const cost = assignments
              .filter(a => a.projectId === project.id)
              .reduce((total, a) => {
                const person = persons.find(p => p.id === a.personId);
                return total + (person?.monthlyCost || 0);
              }, 0);

            labels.push(project.name);
            incomes.push(project.monthlyIncome || 0);
            if (typeof cost === "number") {
              costs.push(cost);
            }
            profits.push((project.monthlyIncome || 0) - cost);
          }

          this.barChartData.labels = labels;
          this.barChartData.datasets[0].data = incomes;
          this.barChartData.datasets[1].data = costs;
          this.barChartData.datasets[2].data = profits;
        });
      });
    });
  }

  exportProfitData(): void {
    this.excelExportService.exportProfitLoss(); // ⬅️ Excel'e verileri gönder
  }
}
