import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-selesai',
  templateUrl: './selesai.component.html',
  styleUrls: ['./selesai.component.scss'],
  standalone: false, 
})
export class SelesaiComponent  implements OnInit {

  daftarKasus = [
    {
      tanggal : '10 Oktober 2025',
      id: 'H001',
      penyakit: 'Flu Sapi',
      foto : 'assets/icon/penyakit1.jpg'
    },

    {
      
      tanggal : '11 Oktober 2025',
      id: 'H002',
      penyakit: 'Cacingan',
      foto : 'assets/icon/penyakit1.jpg'
    }
  ]
  constructor() { }

  ngOnInit() {}

  updateKasus(kasus: any){
    console.log('Update kasus:', kasus);
  }

  tambahKasus(){
    console.log('Tambah kasus baru di klik');
  }

  @Output() close = new EventEmitter<void>();

  closeComponent(){
    this.close.emit();
  }

}

