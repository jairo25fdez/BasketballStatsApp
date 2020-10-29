import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersStatsComponent } from './players-stats.component';

describe('PlayersStatsComponent', () => {
  let component: PlayersStatsComponent;
  let fixture: ComponentFixture<PlayersStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayersStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
