import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAccessFormComponent } from './client-account-form.component';

describe('ClientAccessFormComponent', () => {
  let component: ClientAccessFormComponent;
  let fixture: ComponentFixture<ClientAccessFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAccessFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAccessFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
