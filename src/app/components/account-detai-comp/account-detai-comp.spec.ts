import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDetaiComp } from './account-detai-comp';

describe('AccountDetaiComp', () => {
  let component: AccountDetaiComp;
  let fixture: ComponentFixture<AccountDetaiComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDetaiComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountDetaiComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
