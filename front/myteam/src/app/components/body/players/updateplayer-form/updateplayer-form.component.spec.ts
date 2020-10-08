import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateplayerFormComponent } from './updateplayer-form.component';

describe('UpdateplayerFormComponent', () => {
  let component: UpdateplayerFormComponent;
  let fixture: ComponentFixture<UpdateplayerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateplayerFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateplayerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
