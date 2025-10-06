import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComp } from './register-comp';

describe('RegisterComp', () => {
  let component: RegisterComp;
  let fixture: ComponentFixture<RegisterComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
