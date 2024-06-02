import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLeassonComponent } from './new-leasson.component';

describe('NewLeassonComponent', () => {
  let component: NewLeassonComponent;
  let fixture: ComponentFixture<NewLeassonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewLeassonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewLeassonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
