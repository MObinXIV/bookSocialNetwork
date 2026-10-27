import { TestBed } from '@angular/core/testing';

import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
    service.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('stores and clears the authentication token', () => {
    service.token = 'test-token';
    expect(service.token).toBe('test-token');

    service.clear();
    expect(service.token).toBeNull();
  });
});
