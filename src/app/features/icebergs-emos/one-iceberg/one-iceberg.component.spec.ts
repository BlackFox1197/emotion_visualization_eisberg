import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneIcebergComponent } from './one-iceberg.component';

describe('OneIcebergComponent', () => {
  let component: OneIcebergComponent;
  let fixture: ComponentFixture<OneIcebergComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneIcebergComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneIcebergComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
