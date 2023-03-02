import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllPage } from './controll-page.component';

describe('MorphingIcebergComponent', () => {
  let component: ControllPage;
  let fixture: ComponentFixture<ControllPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControllPage ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControllPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
