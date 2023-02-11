import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasjsCancerComponent } from './canvasjs-cancer.component';

describe('CanvasjsCancerComponent', () => {
  let component: CanvasjsCancerComponent;
  let fixture: ComponentFixture<CanvasjsCancerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasjsCancerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasjsCancerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
