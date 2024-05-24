import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BettingGamePageComponent } from './betting-game-page.component';

describe('BettingGamePageComponent', () => {
  let component: BettingGamePageComponent;
  let fixture: ComponentFixture<BettingGamePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BettingGamePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BettingGamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
