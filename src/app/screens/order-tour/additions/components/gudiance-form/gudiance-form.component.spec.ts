import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GudianceFormComponent } from './gudiance-form.component';

describe('GudianceFormComponent', () => {
  let component: GudianceFormComponent;
  let fixture: ComponentFixture<GudianceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GudianceFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GudianceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
