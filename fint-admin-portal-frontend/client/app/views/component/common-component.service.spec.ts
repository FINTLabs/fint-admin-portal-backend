/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CommonComponentService } from './common-component.service';

describe('CommonComponentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonComponentService]
    });
  });

  it('should ...', inject([CommonComponentService], (service: CommonComponentService) => {
    expect(service).toBeTruthy();
  }));
});
