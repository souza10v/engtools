import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundationCalculatorComponent } from './foundation-calculator.component';

describe('FoundationCalculatorComponent', () => {
  let component: FoundationCalculatorComponent;
  let fixture: ComponentFixture<FoundationCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoundationCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoundationCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
