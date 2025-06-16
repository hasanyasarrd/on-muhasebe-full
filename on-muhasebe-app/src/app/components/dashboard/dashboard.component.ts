import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Project, Person } from '../../models';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <h1>📊 Ön Muhasebe Dashboard</h1>

      <div class="summary-cards">
        <div class="summary-card">
          <h3>🏢 Projeler</h3>
          <h2>{{ totalProjects }}</h2>
          <p>Toplam proje sayısı</p>
        </div>

        <div class="summary-card">
          <h3>👥 Kişiler</h3>
          <h2>{{ totalPersons }}</h2>
          <p>Toplam kişi sayısı</p>
        </div>

        </div>
        <div class="summary-card">
          <h3>💰 Toplam Gelir</h3>
          <h2>{{ formatCurrency(totalIncome) }}</h2>
          <p>Aylık toplam gelir</p>
        </div>
      </div>



      <div class="status-card">
        <h3>🔗 Sistem Durumu</h3>
        <p><strong>Backend Bağlantısı:</strong> {{ backendStatus }}</p>
        <p><strong>Son Güncelleme:</strong> {{ lastUpdate }}</p>
        <button class="refresh-btn" (click)="refreshData()">
          🔄 Verileri Yenile
        </button>
      </div>
      <div class="navigation-links">
        <a routerLink="/persons" class="nav-btn">👤 Kişileri Yönet</a>
        <a routerLink="/projects" class="nav-btn">🏢 Projeleri Yönet</a>
        <a routerLink="/assignments" class="nav-btn">🔗 Atamaları Yönet</a>
        <a routerLink="/project-profit-chart" class="nav-btn">📊 Kar-Zarar Grafiği</a>

      </div>
      <!-- Debug Info -->
      <div class="debug-info" [hidden]="!showDebug">
        <h4>🐛 Debug Bilgisi:</h4>
        <p>Projeler: {{ projects.length }}</p>
        <p>Kişiler: {{ persons.length }}</p>
        <pre>{{ debugData | json }}</pre>
      </div>

  `,
  styles: [`

    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    h1 {
      text-align: center;
      margin-bottom: 40px;
      color: #2c3e50;
    }

    .summary-cards {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 40px;
    }

    .summary-card {
      flex: 1 1 calc(33.3% - 20px);
      background: linear-gradient(145deg, #ffffff, #f0f0f0);
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 6px 12px rgba(0,0,0,0.08);
      text-align: center;
      transition: transform 0.2s ease;
    }

    .summary-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 18px rgba(0,0,0,0.12);
    }

    .summary-card h2 {
      font-size: 2.6rem;
      color: #0077cc;
      margin: 12px 0;
    }


    .summary-card h3 {
      font-size: 1.2rem;
      color: #555;
    }

    .summary-card p {
      color: #888;
      margin: 0;
    }

    .status-card {
      background: #ffffff;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.06);
      max-width: 600px;
      margin: 0 auto 30px auto;
      text-align: center;
    }

    .refresh-btn {
      margin-top: 14px;
      background: #0077cc;
      color: white;
      border: none;
      padding: 10px 22px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 15px;
    }

    .refresh-btn:hover {
      background: #005fa3;
    }

    .debug-info {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 15px;
      margin-top: 20px;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .debug-info pre {
      background: #343a40;
      color: #f8f9fa;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 12px;
    }

    @media (max-width: 768px) {
      .summary-card {
        flex: 1 1 100%;
      }
      .dashboard-container {
        padding: 12px;
      }
    }
    .navigation-links {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 14px;
      margin-top: 30px;
    }

    .nav-btn {
      background: #2196F3;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 15px;
      transition: background 0.2s ease;
    }

    .nav-btn:hover {
      background: #1976D2;
    }

  `]
})
export class DashboardComponent implements OnInit {
  private dataService = inject(DataService);

  // Tip-safe properties
  totalProjects: number = 0;
  totalPersons: number = 0;
  totalIncome: number = 0;
  backendStatus: string = 'Bağlanıyor...';
  lastUpdate: string = new Date().toLocaleString('tr-TR');

  // Debug için
  showDebug: boolean = false;
  projects: Project[] = [];
  persons: Person[] = [];
  debugData: any = {};

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Projeleri yükle
    this.dataService.projects$.subscribe({
      next: (projects: any[]) => {
        this.projects = projects || [];
        this.totalProjects = this.projects.length;

        // Basit income hesaplama
        this.totalIncome = 0;
        this.projects.forEach((project: any) => {
          if (project?.monthlyIncome) {
            this.totalIncome += Number(project.monthlyIncome);
          }
        });

        this.backendStatus = 'Bağlı ✅';
        this.updateDebugData();
      },
      error: (error: any) => {
        console.error('Projects error:', error);
        this.backendStatus = 'Bağlantı Hatası ❌';
        this.showDebug = true;
        this.debugData.projectsError = error;
      }
    });

    // Kişileri yükle
    this.dataService.persons$.subscribe({
      next: (persons: any[]) => {
        this.persons = persons || [];
        this.totalPersons = this.persons.length;
        this.updateDebugData();
      },
      error: (error: any) => {
        console.error('Persons error:', error);
        this.showDebug = true;
        this.debugData.personsError = error;
      }
    });
  }

  refreshData(): void {
    this.lastUpdate = new Date().toLocaleString('tr-TR');
    this.loadData();
  }

  formatCurrency(amount: number): string {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '₺0,00';
    }
    return this.dataService.formatCurrency(amount);
  }

  private updateDebugData(): void {
    this.debugData = {
      projectsCount: this.projects.length,
      personsCount: this.persons.length,
      projectsExample: this.projects[0] || null,
      personsExample: this.persons[0] || null,
      timestamp: new Date().toISOString()
    };
  }

  // Debug toggle (konsol'dan çağırabilirsiniz)
  toggleDebug(): void {
    this.showDebug = !this.showDebug;
  }
}
