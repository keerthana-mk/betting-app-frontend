import { TestBed } from '@angular/core/testing';

import { BettingGameServiceService } from './betting-game-service.service';

describe('BettingGameServiceService', () => {
  let service: BettingGameServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BettingGameServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
