import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteOrderFormComponent } from './site-order-form.component';

describe('SiteOrderFormComponent', () => {
  let component: SiteOrderFormComponent;
  let fixture: ComponentFixture<SiteOrderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteOrderFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
