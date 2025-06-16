import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  Person,
  Project,
  ProjectPerson,
  ProjectPersonDTO,
  ProjectSummaryDTO,
  ProjectWithPersonsDTO,
  AssignmentResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly API_BASE = 'http://localhost:8081/api';
  private baseUrl = 'http://localhost:8081/api';
  private http = inject(HttpClient);

  // State Subjects
  private personsSubject = new BehaviorSubject<Person[]>([]);
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  private projectPersonsSubject = new BehaviorSubject<ProjectPerson[]>([]);

  // Observables
  public persons$ = this.personsSubject.asObservable();
  public projects$ = this.projectsSubject.asObservable();
  public projectPersons$ = this.projectPersonsSubject.asObservable();

  constructor() {
    this.loadInitialData();
  }

  public loadInitialData(): void {
    this.http.get<Project[]>(this.baseUrl + '/projects').subscribe(data => this.projectsSubject.next(data));
    this.http.get<Person[]>(this.baseUrl + '/persons').subscribe(data => this.personsSubject.next(data));
    this.http.get<ProjectPerson[]>(this.baseUrl + '/project-persons').subscribe(data => this.projectPersonsSubject.next(data));
  }

  // ----------------------------
  // Person CRUD
  // ----------------------------
  getAllPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.API_BASE}/persons`).pipe(
      tap((persons: Person[]) => {
        console.log('👥 Persons loaded:', persons?.length || 0);
        this.personsSubject.next(persons || []);
      })
    );
  }

  getPersonById(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.API_BASE}/persons/${id}`);
  }

  createPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(`${this.API_BASE}/persons`, person).pipe(
      tap(() => this.getAllPersons().subscribe())
    );
  }

  updatePerson(id: number, person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.API_BASE}/persons/${id}`, person).pipe(
      tap(() => this.getAllPersons().subscribe())
    );
  }

  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE}/persons/${id}`).pipe(
      tap(() => this.getAllPersons().subscribe())
    );
  }

  // ----------------------------
  // Project CRUD
  // ----------------------------
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.API_BASE}/projects`).pipe(
      tap((projects: Project[]) => {
        console.log('📋 Projects loaded:', projects?.length || 0);
        this.projectsSubject.next(projects || []);
      })
    );
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.API_BASE}/projects/${id}`);
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.API_BASE}/projects`, project).pipe(
      tap(() => this.getAllProjects().subscribe())
    );
  }

  updateProject(id: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.API_BASE}/projects/${id}`, project).pipe(
      tap(() => this.getAllProjects().subscribe())
    );
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE}/projects/${id}`).pipe(
      tap(() => this.getAllProjects().subscribe())
    );
  }

  // ----------------------------
  // Project-Person Assignments
  // ----------------------------
  getAllProjectPersons(): Observable<ProjectPerson[]> {
    return this.http.get<ProjectPerson[]>(`${this.API_BASE}/project-persons`).pipe(
      tap((assignments: ProjectPerson[]) => {
        console.log('🔗 Project-Person assignments loaded:', assignments.length);
        this.projectPersonsSubject.next(assignments || []);
      })
    );
  }

  getAssignments(): Observable<ProjectPerson[]> {
    return this.http.get<ProjectPerson[]>(`${this.API_BASE}/project-persons`);
  }

  assignPersonToProject(dto: ProjectPersonDTO): Observable<AssignmentResponse> {
    return this.http.post<AssignmentResponse>(`${this.API_BASE}/project-persons`, dto).pipe(
      tap(() => this.getAllProjectPersons().subscribe())
    );
  }

  removeAssignment(id: number): Observable<any> {
    return this.http.delete(`${this.API_BASE}/project-persons/${id}`).pipe(
      tap(() => this.getAllProjectPersons().subscribe())
    );
  }

  // ----------------------------
  // Analytics & Helpers
  // ----------------------------
  getProjectProfit(id: number): Observable<number> {
    return this.http.get<number>(`${this.API_BASE}/projects/${id}/profit`);
  }

  getProjectPersons(id: number): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.API_BASE}/projects/${id}/persons`);
  }

  getProjectTotalCost(id: number): Observable<number> {
    return this.http.get<number>(`${this.API_BASE}/projects/${id}/total-cost`);
  }

  getProjectDuration(id: number): Observable<number> {
    return this.http.get<number>(`${this.API_BASE}/projects/${id}/duration`);
  }

  getProjectsByDateRange(startDate: string, endDate: string): Observable<Project[]> {
    const params = new HttpParams().set('start', startDate).set('end', endDate);
    return this.http.get<Project[]>(`${this.API_BASE}/projects/filter`, { params });
  }

  getProjectSummaries(): Observable<ProjectSummaryDTO[]> {
    return this.http.get<ProjectSummaryDTO[]>(`${this.API_BASE}/projects/summary`);
  }

  getProjectsWithPersons(): Observable<ProjectWithPersonsDTO[]> {
    return this.http.get<ProjectWithPersonsDTO[]>(`${this.API_BASE}/projects/with-persons`);
  }

  // ----------------------------
  // Utility Methods
  // ----------------------------
  getCurrentPersons(): Person[] {
    return this.personsSubject.value;
  }

  getCurrentProjects(): Project[] {
    return this.projectsSubject.value;
  }

  getCurrentProjectPersons(): ProjectPerson[] {
    return this.projectPersonsSubject.value;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('tr-TR');
  }
}
