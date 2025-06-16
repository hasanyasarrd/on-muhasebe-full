import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule], // ✅ FormsModule burada eklendi
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {}
