import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVitalsModalComponent } from './add-vitals-modal.component';

describe('AddVitalsModalComponent', () => {
  let component: AddVitalsModalComponent;
  let fixture: ComponentFixture<AddVitalsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVitalsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVitalsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
