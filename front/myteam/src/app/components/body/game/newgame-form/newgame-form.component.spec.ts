import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewgameFormComponent } from './newgame-form.component';

describe('NewgameFormComponent', () => {
  let component: NewgameFormComponent;
  let fixture: ComponentFixture<NewgameFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewgameFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewgameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
