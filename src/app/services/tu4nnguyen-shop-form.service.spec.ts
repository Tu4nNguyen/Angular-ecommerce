import { TestBed } from '@angular/core/testing';

import { Tu4nnguyenShopFormService } from './tu4nnguyen-shop-form.service';

describe('Tu4nnguyenShopFormService', () => {
  let service: Tu4nnguyenShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tu4nnguyenShopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
