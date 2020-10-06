import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubsMenuComponent } from './clubs-menu.component';

describe('ClubsMenuComponent', () => {
  let component: ClubsMenuComponent;
  let fixture: ComponentFixture<ClubsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClubsMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
