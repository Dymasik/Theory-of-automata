import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomataBuilderComponent } from './automata-builder.component';

describe('AutomataBuilderComponent', () => {
  let component: AutomataBuilderComponent;
  let fixture: ComponentFixture<AutomataBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomataBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomataBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
