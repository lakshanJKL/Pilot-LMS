import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAssignmentsComponent } from './update-assignments.component';

describe('UpdateAssignmentsComponent', () => {
  let component: UpdateAssignmentsComponent;
  let fixture: ComponentFixture<UpdateAssignmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAssignmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
