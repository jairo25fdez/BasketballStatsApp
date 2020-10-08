import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateteamFormComponent } from './updateteam-form.component';

describe('UpdateteamFormComponent', () => {
  let component: UpdateteamFormComponent;
  let fixture: ComponentFixture<UpdateteamFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateteamFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateteamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
