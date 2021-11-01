import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicActivationFormComponent } from './music-activation-form.component';

describe('MusicActivationFormComponent', () => {
  let component: MusicActivationFormComponent;
  let fixture: ComponentFixture<MusicActivationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MusicActivationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicActivationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
