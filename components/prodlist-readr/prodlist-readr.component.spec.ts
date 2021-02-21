import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdlistReadrComponent } from './prodlist-readr.component';

describe('ProdlistReadrComponent', () => {
  let component: ProdlistReadrComponent;
  let fixture: ComponentFixture<ProdlistReadrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdlistReadrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdlistReadrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
