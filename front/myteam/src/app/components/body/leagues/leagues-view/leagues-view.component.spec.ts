import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaguesViewComponent } from './leagues-view.component';

describe('LeaguesViewComponent', () => {
  let component: LeaguesViewComponent;
  let fixture: ComponentFixture<LeaguesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaguesViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaguesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
