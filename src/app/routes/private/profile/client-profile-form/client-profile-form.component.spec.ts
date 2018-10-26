import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProfileFormComponent } from './client-profile-form.component';

describe('ClientProfileFormComponent', () => {
  let component: ClientProfileFormComponent;
  let fixture: ComponentFixture<ClientProfileFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProfileFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
