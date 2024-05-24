import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGameModalComponent } from './create-game-modal.component';

describe('CreateGameModalComponent', () => {
  let component: CreateGameModalComponent;
  let fixture: ComponentFixture<CreateGameModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateGameModalComponent]
    });
    fixture = TestBed.createComponent(CreateGameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
