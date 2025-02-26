import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as tableData from '../../../assets/tables.json';

@Component({
  selector: 'app-foundation-calculator',
  standalone: true,  
  templateUrl: './foundation-calculator.component.html',
  styleUrls: ['./foundation-calculator.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class FoundationCalculatorComponent {
  foundationForm: FormGroup;
  area: number = 0;
  inercia: number = 0;
  fckValidationMessage: string = '';
  nrbMessage: string = '';

  fckValue: number = 0;
  fykValue: number = 0;
  eciValue: number = 0;
  fcdValue: number = 0;
  fydValue: number = 0;
  eckValue: number = 0;

  showCalculatedValues: boolean = false;

  tables = tableData;

  constructor(private fb: FormBuilder) {
    this.foundationForm = this.fb.group({
      tipoEstaca: [''],
      concreto: [''],
      tipoBrita: [''],
      diametro: [''],
      area: [{ value: '', disabled: true }],
      inercia: [{ value: '', disabled: true }],
      comprimento: [''],
      fck: [''],
      aco: ['CA-50']
    });
  }

  calculateFck(): number {
    const concreto = this.foundationForm.get('concreto')?.value;
    return this.tables.concreteTable[concreto as keyof typeof this.tables.concreteTable] || 0;
  }

  calculateFyk(): number {
    const aco = this.foundationForm.get('aco')?.value;
    return (this.tables.steelTable as { [key: string]: number })[aco] || 0;
  }

  calculateEci(): number {
    const fck = this.calculateFck();
    const tipoBrita = this.foundationForm.get('tipoBrita')?.value;
    const alphaE = this.tables.aggregateTable[tipoBrita as keyof typeof this.tables.aggregateTable] || 1;
    if (fck <= 50) {
      return alphaE * 5600 * Math.sqrt(fck);
    } else {
      return 21500 * alphaE * Math.pow((fck / 10 + 1.25), 1 / 3);
    }
  }

  calculateFcd(): number {
    const fck = this.calculateFck();
    const tipoEstaca = this.foundationForm.get('tipoEstaca')?.value;
    const estaca = this.tables.pileTable.find((item: any) => item.Estaca === tipoEstaca);
    return estaca ? fck / estaca.fck_max : 0;
  }

  calculateFyd(): number {
    const fyk = this.calculateFyk();
    const tipoEstaca = this.foundationForm.get('tipoEstaca')?.value;
    const estaca = this.tables.pileTable.find((item: any) => item.Estaca === tipoEstaca);
    return estaca ? fyk / estaca.fck_max : 0;
  }

  calculateEck(): number {
    const fck = this.calculateFck();
    const eci = this.calculateEci();
    const factor = 0.8 + (0.2 * (fck / 80));
    return factor <= 1 ? factor * eci : eci;
  }

  calculateProperties(): void {
    const diametro = this.foundationForm.get('diametro')?.value;
    if (diametro) {
      this.area = Math.PI * 0.25 * Math.pow(diametro, 2);
      this.inercia = (Math.PI * Math.pow(diametro, 4)) / 64;
    } else {
      this.area = 0;
      this.inercia = 0;
    }
  }

  validateFck() {
    const tipoEstaca = this.foundationForm.get('tipoEstaca')?.value;
    const fck = this.calculateFck();
    const fyk = this.calculateFyk();
    const eci = this.calculateEci();
    const fcd = this.calculateFcd();
    const fyd = this.calculateFyd();
    const eck = this.calculateEck();

    this.fckValue = fck;
    this.fykValue = fyk;
    this.eciValue = eci;
    this.fcdValue = fcd;
    this.fydValue = fyd;
    this.eckValue = eck;

    this.showCalculatedValues = true;

    if (
      (['Broca (Escavada sem fluido)', 'Strauss'].includes(tipoEstaca) && fck <= 15) ||
      (['Escavada com fluido', 'Franki', 'Raiz', 'Hélice'].includes(tipoEstaca) && fck <= 20)
    ) {
      this.fckValidationMessage = 'OK!';
    } else {
      this.fckValidationMessage = 'Diminuir fck';
    }

    this.nrbMessage = ['Broca (Escavada sem fluido)', 'Strauss'].includes(tipoEstaca)
      ? 'fck máximo de 15 MPa - Tabela 4 da NBR 6122:2010'
      : 'fck máximo de 20 MPa - Tabela 4 da NBR 6122:2010';
  }
}
