import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersMenuComponent } from './players-menu.component';

describe('PlayersMenuComponent', () => {
  let component: PlayersMenuComponent;
  let fixture: ComponentFixture<PlayersMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayersMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
