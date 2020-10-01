import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewleagueFormComponent } from './newleague-form.component';

describe('NewleagueFormComponent', () => {
  let component: NewleagueFormComponent;
  let fixture: ComponentFixture<NewleagueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewleagueFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewleagueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
