import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcebergComponent } from './iceberg.component';

describe('IcebergComponent', () => {
  let component: IcebergComponent;
  let fixture: ComponentFixture<IcebergComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IcebergComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IcebergComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
