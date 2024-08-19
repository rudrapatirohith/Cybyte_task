import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertDataFormComponent } from './insert-data-form.component';

describe('InsertDataFormComponent', () => {
  let component: InsertDataFormComponent;
  let fixture: ComponentFixture<InsertDataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsertDataFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsertDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
