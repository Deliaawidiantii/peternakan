import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-selesai',
  templateUrl: './selesai.component.html',
  styleUrls: ['./selesai.component.scss'],
  standalone: false, 
})
export class SelesaiComponent  implements OnInit {
  @Input() daftarKasus: any[] = [];
  private backendUrl = environment.apiUrl.replace('/api', '');

  getFotoUrl(path: string) {
    if (!path) return 'assets/icon/penyakit1.jpg';
    if(path.includes('assets/')) return path;
    return `${this.backendUrl}/storage/${path}`;
  }

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

