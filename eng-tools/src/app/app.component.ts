import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FoundationCalculatorComponent } from './components/foundation-calculator/foundation-calculator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FoundationCalculatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'eng-tools';
}
