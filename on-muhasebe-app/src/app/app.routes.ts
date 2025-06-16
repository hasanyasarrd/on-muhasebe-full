import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PersonListComponent } from './components/person-list/person-list.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectPersonComponent } from './components/project-person/project-person.component';
import { ProjectProfitChartComponent } from './components/project-profit-chart/project-profit-chart.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent }, // ⬅️ Anasayfa dashboard
  { path: 'persons', component: PersonListComponent },
  { path: 'projects', component: ProjectListComponent },
  { path: 'assignments', component: ProjectPersonComponent },
  { path: 'project-profit-chart', component: ProjectProfitChartComponent },

];
