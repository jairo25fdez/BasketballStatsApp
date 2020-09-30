import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewplayerFormComponent } from './newplayer-form.component';

describe('NewplayerFormComponent', () => {
  let component: NewplayerFormComponent;
  let fixture: ComponentFixture<NewplayerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewplayerFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewplayerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
