import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewclubFormComponent } from './newclub-form.component';

describe('NewclubFormComponent', () => {
  let component: NewclubFormComponent;
  let fixture: ComponentFixture<NewclubFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewclubFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewclubFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
