import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcebergManualPreviewComponent } from './iceberg-manual-preview.component';

describe('IcebergManualPreviewComponent', () => {
  let component: IcebergManualPreviewComponent;
  let fixture: ComponentFixture<IcebergManualPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IcebergManualPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IcebergManualPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
