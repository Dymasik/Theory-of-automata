import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomataComponent } from './automata.component';

describe('AutomataComponent', () => {
  let component: AutomataComponent;
  let fixture: ComponentFixture<AutomataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
