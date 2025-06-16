import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Person, Project, ProjectPerson } from '../../models/index';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExcelExportService } from '../../services/excel-export.service';

@Component({
  selector: 'app-project-person',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h2>📌 Projeye Kişi Atama</h2>

      <form (submit)="assignPerson($event)" class="assign-form">
        <select #projectRef required>
          <option value="">Proje Seçin</option>
          <option *ngFor="let p of projects" [value]="p.id">{{ p.name }}</option>
        </select>

        <select #personRef required>
          <option value="">Kişi Seçin</option>
          <option *ngFor="let p of persons" [value]="p.id">{{ p.name }}</option>
        </select>

        <button type="submit">➕ Ata</button>
      </form>

      <div *ngIf="assignments.length > 0" class="assignment-list">
        <h3>🔗 Atanmış Kişiler</h3>
        <ul>
          <li *ngFor="let item of assignments">
            {{ item['personName'] }} → {{ item['projectName'] }}
            <button (click)="removeAssignment(item.id)">❌</button>
          </li>
        </ul>
      </div>

      <div class="summary-box" *ngIf="projects.length > 0 && persons.length > 0">
        <h3>💰 Proje Bazlı Kar/Zarar</h3>
        <!-- ÖNCEKİ YERİ DEĞİŞTİR -->
        <div *ngFor="let project of projects" class="summary-item">
          <strong (click)="toggleProject(project.id!)" style="cursor:pointer;">
            <span [innerHTML]="expandedProjectId === project.id ? '🔽' : '▶️'"></span>
            {{ project.name }}
          </strong>
          <p>
            Gelir: ₺{{ project.monthlyIncome }}<br />
            Gider: ₺{{ calculateProjectCost(project.id!) }}<br />
            Kâr/Zarar:
            <span [style.color]="calculateProfit(project.id!) >= 0 ? 'green' : 'red'">
      ₺{{ calculateProfit(project.id!) }}
    </span>
          </p>

          <!-- Kişi listesi -->
          <ul
            *ngIf="expandedProjectId === project.id"
            class="fade-in person-detail-list"
          >
            <li *ngFor="let assignment of getAssignmentsFor(project.id!)">
              <span class="person-icon">👤</span>
              <strong>{{ getPersonName(assignment.personId) }}</strong>
              <span class="person-role">
        ({{ getPersonRole(assignment.personId) }}, ₺{{ getPersonCost(assignment.personId) }})
      </span>
            </li>
          </ul>
        </div>

      </div>
      <button (click)="exportAssignments()">📤 Excel'e Aktar (Atamalar)</button>

      <a routerLink="/" class="back-home">⬅️ Ana Sayfa</a>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 24px;
      font-family: Arial, sans-serif;
    }

    h2, h3 {
      text-align: center;
      color: #333;
    }

    .assign-form {
      display: flex;
      gap: 10px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    select, button {
      padding: 10px;
      font-size: 14px;
      border-radius: 6px;
      border: 1px solid #ccc;
    }

    button {
      background: #2196F3;
      color: white;
      cursor: pointer;
    }

    button:hover {
      background: #1976D2;
    }

    .assignment-list ul {
      list-style: none;
      padding: 0;
    }

    .assignment-list li {
      padding: 8px 12px;
      background: #f0f0f0;
      margin-bottom: 8px;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .assignment-list button {
      background: #ff5252;
      color: white;
      border: none;
      padding: 6px 10px;
      border-radius: 4px;
      cursor: pointer;
    }

    .summary-box {
      margin-top: 30px;
      background: #f9f9f9;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    }

    .summary-item {
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #ccc;
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
    }

    .back-home:hover {
      background: #ddd;
    }
    .fade-in {
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .person-detail-list {
      margin-top: 8px;
      padding-left: 18px;
      list-style-type: none;
    }

    .person-detail-list li {
      background: #eef3ff;
      padding: 8px;
      margin-bottom: 6px;
      border-radius: 6px;
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .person-icon {
      font-size: 18px;
    }

    .person-role {
      font-size: 13px;
      color: #555;
    }

  `]
})
export class ProjectPersonComponent implements OnInit {
  private dataService = inject(DataService);

  persons: Person[] = [];
  projects: Project[] = [];
  assignments: ProjectPerson[] = [];
  expandedProjectId: number | null = null;

  @ViewChild('projectRef') projectRef!: ElementRef;
  @ViewChild('personRef') personRef!: ElementRef;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.dataService.persons$.subscribe(p => this.persons = p);
    this.dataService.projects$.subscribe(p => this.projects = p);
    this.loadAssignments();
  }

  toggleProject(projectId: number): void {
    this.expandedProjectId = this.expandedProjectId === projectId ? null : projectId;
  }

  loadAssignments(): void {
    this.dataService.getAssignments().subscribe((a: ProjectPerson[]) => {
      this.assignments = a;
    });
  }

  assignPerson(event: Event): void {
    event.preventDefault();
    const personId = parseInt(this.personRef.nativeElement.value);
    const projectId = parseInt(this.projectRef.nativeElement.value);

    if (!personId || !projectId) {
      alert('Lütfen her iki seçim kutusunu da doldurun.');
      return;
    }

    this.dataService.assignPersonToProject({ personId, projectId }).subscribe((res: any) => {
      alert(res.message);
      this.loadAssignments();
    });
  }

  removeAssignment(id: number): void {
    if (!confirm("Bu atamayı silmek istediğinize emin misiniz?")) return;

    this.dataService.removeAssignment(id).subscribe(() => {
      alert('Atama silindi');
      this.loadAssignments();
    });
  }

  calculateProjectCost(projectId: number): number {
    const assignments = this.dataService.getCurrentProjectPersons().filter(pp => pp.projectId === projectId);
    let total = 0;

    assignments.forEach(pp => {
      const person = this.dataService.getCurrentPersons().find(p => p.id === pp.personId);
      if (person?.monthlyCost) {
        total += person.monthlyCost;
      }
    });

    return total;
  }

  calculateProfit(projectId: number): number {
    const project = this.dataService.getCurrentProjects().find(p => p.id === projectId);
    const income = project?.monthlyIncome || 0;
    const cost = this.calculateProjectCost(projectId);
    return income - cost;
  }

  getAssignmentsFor(projectId: number): ProjectPerson[] {
    return this.assignments.filter(a => a.projectId === projectId);
  }

  getPersonName(personId: number): string {
    return this.persons.find(p => p.id === personId)?.name || 'Bilinmeyen Kişi';
  }
  getPersonRole(personId: number): string {
    return this.persons.find(p => p.id === personId)?.role || '-';
  }
  constructor(private excelExportService: ExcelExportService) {}

  exportAssignments(): void {
    this.excelExportService.exportAssignments();
  }

  getPersonCost(personId: number): number {
    return this.persons.find(p => p.id === personId)?.monthlyCost || 0;
  }

}
