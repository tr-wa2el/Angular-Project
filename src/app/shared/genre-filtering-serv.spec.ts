import { TestBed } from '@angular/core/testing';

import { GenreFilteringServ } from './genre-filtering-serv';

describe('GenreFilteringServ', () => {
  let service: GenreFilteringServ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenreFilteringServ);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
