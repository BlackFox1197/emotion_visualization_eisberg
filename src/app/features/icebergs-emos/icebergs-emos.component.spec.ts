import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcebergsEmosComponent } from './icebergs-emos.component';

describe('IcebergsEmosComponent', () => {
  let component: IcebergsEmosComponent;
  let fixture: ComponentFixture<IcebergsEmosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IcebergsEmosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IcebergsEmosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
