import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewteamFormComponent } from './newteam-form.component';

describe('NewteamFormComponent', () => {
  let component: NewteamFormComponent;
  let fixture: ComponentFixture<NewteamFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewteamFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewteamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
