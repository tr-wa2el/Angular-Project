import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredMovies } from './filtered-movies';

describe('FilteredMovies', () => {
  let component: FilteredMovies;
  let fixture: ComponentFixture<FilteredMovies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilteredMovies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilteredMovies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
