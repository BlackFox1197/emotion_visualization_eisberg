import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmoChartComponent } from './emo-chart.component';

describe('EmoChartComponent', () => {
  let component: EmoChartComponent;
  let fixture: ComponentFixture<EmoChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmoChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmoChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
