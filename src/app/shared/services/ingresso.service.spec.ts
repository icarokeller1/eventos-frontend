import { TestBed } from '@angular/core/testing';

import { IngressoService } from './ingresso.service';

describe('IngressoService', () => {
  let service: IngressoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngressoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
