import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Genremovies } from './genremovies';

describe('Genremovies', () => {
  let component: Genremovies;
  let fixture: ComponentFixture<Genremovies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Genremovies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Genremovies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
