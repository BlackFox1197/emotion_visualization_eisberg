import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorphingIcebergComponent } from './morphing-iceberg.component';

describe('MorphingIcebergComponent', () => {
  let component: MorphingIcebergComponent;
  let fixture: ComponentFixture<MorphingIcebergComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MorphingIcebergComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MorphingIcebergComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
