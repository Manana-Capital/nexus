import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAccountFormComponent } from './client-account-form.component';

describe('ClientAccountFormComponent', () => {
  let component: ClientAccountFormComponent;
  let fixture: ComponentFixture<ClientAccountFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAccountFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
