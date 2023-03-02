import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorphingSingleIcebergComponent } from './morphing-single-iceberg.component';

describe('MorphingSingleIcebergComponent', () => {
  let component: MorphingSingleIcebergComponent;
  let fixture: ComponentFixture<MorphingSingleIcebergComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MorphingSingleIcebergComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MorphingSingleIcebergComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
