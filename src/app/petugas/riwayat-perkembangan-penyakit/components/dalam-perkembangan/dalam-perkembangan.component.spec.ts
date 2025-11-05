import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DalamPerkembanganComponent } from './dalam-perkembangan.component';

describe('DalamPerkembanganComponent', () => {
  let component: DalamPerkembanganComponent;
  let fixture: ComponentFixture<DalamPerkembanganComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DalamPerkembanganComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DalamPerkembanganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
