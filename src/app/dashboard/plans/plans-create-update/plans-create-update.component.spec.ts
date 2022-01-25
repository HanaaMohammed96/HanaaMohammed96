import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansCreateUpdateComponent } from './plans-create-update.component';

describe('PlansCreateUpdateComponent', () => {
  let component: PlansCreateUpdateComponent;
  let fixture: ComponentFixture<PlansCreateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlansCreateUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlansCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
