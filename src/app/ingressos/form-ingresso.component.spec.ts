import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormIngressoComponent } from './form-ingresso.component';

describe('FormIngressoComponent', () => {
  let component: FormIngressoComponent;
  let fixture: ComponentFixture<FormIngressoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormIngressoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormIngressoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
