import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaguesMenuComponent } from './leagues-menu.component';

describe('MenuComponent', () => {
  let component: LeaguesMenuComponent;
  let fixture: ComponentFixture<LeaguesMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaguesMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaguesMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
