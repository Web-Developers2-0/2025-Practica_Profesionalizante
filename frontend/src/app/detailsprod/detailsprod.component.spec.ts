import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsprodComponent } from './detailsprod.component';

describe('DetailsprodComponent', () => {
  let component: DetailsprodComponent;
  let fixture: ComponentFixture<DetailsprodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsprodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsprodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Aquí puedes agregar más pruebas unitarias según la lógica y el comportamiento de tu componente

});