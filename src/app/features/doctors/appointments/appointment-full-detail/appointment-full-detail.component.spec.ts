import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentFullDetailComponent } from './appointment-full-detail.component';

describe('AppointmentFullDetailComponent', () => {
  let component: AppointmentFullDetailComponent;
  let fixture: ComponentFixture<AppointmentFullDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentFullDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentFullDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
