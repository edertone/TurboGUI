import { TestBed } from '@angular/core/testing';

import { TurboguiAngularService } from './turbogui-angular.service';

describe('TurboguiAngularService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TurboguiAngularService = TestBed.get(TurboguiAngularService);
    expect(service).toBeTruthy();
  });
});
