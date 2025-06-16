import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Person } from '../../models/index';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  template: `
    <div class="person-list-container">
      <h2>👤 Kişi Ekleme ve Listeleme</h2>

      <form (submit)="addPerson($event)" class="person-form">
        <input type="text" placeholder="İsim" #nameRef required />
        <input type="text" placeholder="Rol" #roleRef required />
        <input type="number" placeholder="Aylık Maliyet (₺)" #costRef required />
        <button type="submit">➕ Kişi Ekle</button>
      </form>

      <div class="filter-bar">
        <input type="text" [(ngModel)]="searchTerm" placeholder="Ad, Rol veya Maliyet ile ara..." class="search-input" />

        <select [(ngModel)]="selectedRole" class="role-select">
          <option *ngFor="let role of uniqueRoles" [value]="role">{{ role }}</option>
        </select>
      </div>

      <div class="person-list" *ngIf="filteredPersons().length > 0">
        <h3>📋 Ekli Kişiler</h3>

        <div class="person-card" *ngFor="let person of filteredPersons()">
          <strong>{{ person.name }}</strong><br />
          {{ person.role }}<br />
          💰 {{ person.monthlyCost }} ₺



          <div class="assigned-projects" *ngIf="getAssignedProjects(person.id!).length > 0">
            <small>🔗 Atandığı Projeler:</small>
            <ul>
              <li *ngFor="let proj of getAssignedProjects(person.id!)">
                • {{ proj }}
              </li>
            </ul>
          </div>

          <button class="delete-btn" (click)="deletePerson(person.id!)">❌ Sil</button>
        </div>
      </div>

      <a routerLink="/" class="back-home">⬅️ Ana Sayfa</a>
    </div>
  `,
  styles: [`
    .person-list-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    .filter-bar {
      display: flex;
      gap: 10px;
      margin: 12px 0 20px 0;
      flex-wrap: wrap;
    }

    .search-input {
      flex: 1;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #ccc;
      min-width: 200px;
    }

    .role-select {
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #ccc;
      min-width: 160px;
    }

    h2, h3 {
      text-align: center;
      color: #333;
    }

    .person-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 30px;
    }

    .person-form input {
      padding: 10px;
      font-size: 14px;
      border-radius: 6px;
      border: 1px solid #ccc;
    }

    .person-form button {
      background: #2196F3;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 6px;
      cursor: pointer;
    }

    .person-form button:hover {
      background: #1976D2;
    }

    .person-list {
      display: grid;
      gap: 12px;
    }

    .person-card {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 8px;
      border-left: 4px solid #2196F3;
      position: relative;
    }

    .delete-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #f44336;
      color: white;
      border: none;
      padding: 6px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }

    .delete-btn:hover {
      background: #d32f2f;
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
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }

    .back-home:hover {
      background: #ddd;
    }

    .assigned-projects {
      margin-top: 8px;
      font-size: 13px;
      color: #444;
    }

    .assigned-projects ul {
      padding-left: 16px;
      margin: 4px 0 0 0;
    }

    .assigned-projects li {
      list-style-type: disc;
    }
  `]
})
export class PersonListComponent implements OnInit {
  private dataService = inject(DataService);
  persons: Person[] = [];
  searchTerm: string = '';

  @ViewChild('nameRef') nameRef!: ElementRef;
  @ViewChild('roleRef') roleRef!: ElementRef;
  @ViewChild('costRef') costRef!: ElementRef;

  uniqueRoles: string[] = [];
  selectedRole: string = 'Hepsi';

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons(): void {
    this.dataService.persons$.subscribe((persons: Person[]) => {
      this.persons = persons;
      this.uniqueRoles = ['Hepsi', ...new Set(persons.map(p => p.role))];
    });
  }

  addPerson(event: Event): void {
    event.preventDefault();

    const name = this.nameRef.nativeElement.value.trim();
    const role = this.roleRef.nativeElement.value.trim();
    const monthlyCost = parseFloat(this.costRef.nativeElement.value);

    if (!name || !role || isNaN(monthlyCost)) {
      alert("Lütfen tüm alanları eksiksiz doldurun.");
      return;
    }

    const newPerson = { name, role, monthlyCost } as Person;

    this.dataService.createPerson(newPerson).subscribe(() => {
      alert("Kişi eklendi ✅");
      this.nameRef.nativeElement.value = '';
      this.roleRef.nativeElement.value = '';
      this.costRef.nativeElement.value = '';
      this.loadPersons();
    });
  }

  getAssignedProjects(personId: number): string[] {
    return this.dataService.getCurrentProjectPersons()
      .filter(pp => pp.personId === personId)
      .map(pp => {
        const project = this.dataService.getCurrentProjects().find(p => p.id === pp.projectId);
        return project?.name || 'Bilinmeyen Proje';
      });
  }

  deletePerson(id: number): void {
    if (confirm("Bu kişiyi silmek istediğinize emin misiniz?")) {
      this.dataService.deletePerson(id).subscribe(() => {
        alert("Kişi silindi ✅");
        this.loadPersons();
      });
    }
  }

  filteredPersons(): Person[] {
    return this.persons.filter(p => {
      const matchesSearch = this.searchTerm.trim() === '' ||
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.role.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.monthlyCost.toString().includes(this.searchTerm);

      const matchesRole = this.selectedRole === 'Hepsi' || p.role === this.selectedRole;

      return matchesSearch && matchesRole;
    });
  }

}
