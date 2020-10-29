import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsStatsComponent } from './teams-stats.component';

describe('TeamsStatsComponent', () => {
  let component: TeamsStatsComponent;
  let fixture: ComponentFixture<TeamsStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamsStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
