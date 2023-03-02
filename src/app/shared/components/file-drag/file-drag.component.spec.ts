import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDragComponent } from './file-drag.component';

describe('FileDragComponent', () => {
  let component: FileDragComponent;
  let fixture: ComponentFixture<FileDragComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileDragComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
