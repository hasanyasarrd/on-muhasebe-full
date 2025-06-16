import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Project, Person, ProjectPerson } from '../models';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {
  constructor(private dataService: DataService) {}

  exportAssignments(): void {
    const assignments = this.dataService.getCurrentProjectPersons();
    const persons = this.dataService.getCurrentPersons();
    const projects = this.dataService.getCurrentProjects();

    const exportData = assignments.map(assignment => {
      const person = persons.find(p => p.id === assignment.personId);
      const project = projects.find(p => p.id === assignment.projectId);

      return {
        'Proje Adı': project?.name || 'Bilinmiyor',
        'Kişi Adı': person?.name || 'Bilinmiyor',
        'Kişi Maliyeti': person?.monthlyCost || 0,
        'Proje Geliri': project?.monthlyIncome || 0,
        'Kâr/Zarar': (project?.monthlyIncome || 0) - (person?.monthlyCost || 0)
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = { Sheets: { 'Atamalar': worksheet }, SheetNames: ['Atamalar'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, 'proje-atamalari');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }
  exportProfitLoss(): void {
    const projects = this.dataService.getCurrentProjects();
    const persons = this.dataService.getCurrentPersons();
    const assignments = this.dataService.getCurrentProjectPersons();

    const exportData = projects.map(project => {
      const assignedPersons = assignments.filter(a => a.projectId === project.id);
      const totalCost = assignedPersons.reduce((sum, assignment) => {
        const person = persons.find(p => p.id === assignment.personId);
        return sum + (person?.monthlyCost || 0);
      }, 0);

      const income = project.monthlyIncome || 0;
      const profit = income - totalCost;

      return {
        'Proje Adı': project.name,
        'Gelir': income,
        'Gider': totalCost,
        'Kâr/Zarar': profit
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = { Sheets: { 'KarZarar': worksheet }, SheetNames: ['KarZarar'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, 'kar-zarar');
  }

}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
