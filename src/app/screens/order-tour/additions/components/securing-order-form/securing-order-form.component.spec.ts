import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuringOrderFormComponent } from './securing-order-form.component';

describe('SecuringOrderFormComponent', () => {
  let component: SecuringOrderFormComponent;
  let fixture: ComponentFixture<SecuringOrderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecuringOrderFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecuringOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
