import { Component, OnInit, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="project-list-container">
      <h2>📋 Proje Ekle</h2>

      <div class="form-container">
        <input #nameInput type="text" placeholder="Proje Adı" />
        <input #startInput type="date" />
        <input #endInput type="date" />
        <input #incomeInput type="number" placeholder="Aylık Gelir" />
        <button (click)="addProject(nameInput, startInput, endInput, incomeInput)">➕ Ekle</button>
      </div>

      <input type="text" [(ngModel)]="searchTerm" placeholder="Proje adına göre ara..." class="search-input" />

      <h3>📌 Projeler</h3>
      <ul>
        <li *ngFor="let p of filteredProjects()">
          <strong>{{ p.name }}</strong> | {{ p.startDate }} → {{ p.endDate }} | ₺{{ p.monthlyIncome }}
          <button class="delete-btn" *ngIf="p.id !== undefined" (click)="deleteProject(p.id!)">❌ Sil</button>
        </li>
      </ul>

      <a routerLink="/" class="back-button">⬅️ Ana Sayfaya Dön</a>
    </div>
  `,
  styles: [`
    .project-list-container {
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .form-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 24px;
    }

    .search-input {
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #ccc;
      width: 100%;
      margin-bottom: 16px;
    }

    input {
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #ccc;
    }

    button {
      background-color: #4CAF50;
      color: white;
      padding: 12px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }

    button:hover {
      background-color: #45a049;
    }

    .delete-btn {
      background-color: #f44336;
      margin-left: 12px;
      padding: 8px 12px;
      font-size: 14px;
    }

    .delete-btn:hover {
      background-color: #d32f2f;
    }

    ul {
      list-style: none;
      padding-left: 0;
    }

    li {
      background: #f1f1f1;
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 6px;
    }

    .back-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background-color: #2196f3;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      text-decoration: none;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }

    .back-button:hover {
      background-color: #1976d2;
    }
  `]
})
export class ProjectListComponent implements OnInit {
  private dataService = inject(DataService);
  projects: any[] = [];
  searchTerm: string = '';

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.dataService.projects$.subscribe((data: any[]) => {
      this.projects = data;
    });
  }

  addProject(nameInput: HTMLInputElement, startInput: HTMLInputElement, endInput: HTMLInputElement, incomeInput: HTMLInputElement): void {
    const newProject = {
      name: nameInput.value,
      startDate: startInput.value,
      endDate: endInput.value,
      monthlyIncome: Number(incomeInput.value)
    };

    this.dataService.createProject(newProject).subscribe(() => {
      alert('Proje başarıyla eklendi ✅');
      nameInput.value = '';
      startInput.value = '';
      endInput.value = '';
      incomeInput.value = '';
      this.loadProjects();
    });
  }

  deleteProject(id: number): void {
    if (!confirm('Bu projeyi silmek istediğinize emin misiniz?')) return;

    this.dataService.deleteProject(id).subscribe(() => {
      alert('Proje silindi 🗑️');
      this.loadProjects();
    });
  }

  filteredProjects(): any[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.projects.filter(project =>
      project.name.toLowerCase().includes(term)
    );
  }
}
