import { TestBed } from '@angular/core/testing';

import { ModificacionesServiceService } from './modificaciones-service.service';

describe('ModificacionesServiceService', () => {
  let service: ModificacionesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModificacionesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
