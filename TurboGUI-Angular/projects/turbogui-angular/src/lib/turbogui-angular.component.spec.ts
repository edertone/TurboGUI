import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurboguiAngularComponent } from './turbogui-angular.component';

describe('TurboguiAngularComponent', () => {
  let component: TurboguiAngularComponent;
  let fixture: ComponentFixture<TurboguiAngularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurboguiAngularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurboguiAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
