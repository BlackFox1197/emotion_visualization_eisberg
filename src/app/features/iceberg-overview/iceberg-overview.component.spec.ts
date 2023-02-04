import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcebergOverviewComponent } from './iceberg-overview.component';

describe('IcebergOverviewComponent', () => {
  let component: IcebergOverviewComponent;
  let fixture: ComponentFixture<IcebergOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IcebergOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IcebergOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
