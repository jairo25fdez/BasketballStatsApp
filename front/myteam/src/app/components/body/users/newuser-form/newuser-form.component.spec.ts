import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewuserFormComponent } from './newuser-form.component';

describe('NewuserFormComponent', () => {
  let component: NewuserFormComponent;
  let fixture: ComponentFixture<NewuserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewuserFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewuserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
