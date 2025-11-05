import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-pemilik',
  templateUrl: './pemilik.page.html',
  styleUrls: ['./pemilik.page.scss'],
  standalone: false,
})
export class PemilikPage implements OnInit {

  query: string = '';
  pemilikList: any[] = [];
  filteredPemilik: any[] = [];

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
    //contoh data dummy
    this.pemilikList = [
      { name: 'Budi Santoso', village: 'Desa Sukamaju', count: 12, color: '#f4a261', initials: 'BS' },
      { name: 'Siti Aminah', village: 'Desa Karanganyar', count: 8, color: '#2a9d8f', initials: 'SA' },
      { name: 'Ahmad Fauzi', village: 'Desa Mekarsari', count: 15, color: '#e76f51', initials: 'AF' },
      { name: 'Dewi Lestari', village: 'Desa Ciptasari', count: 6, color: '#264653', initials: 'DL' },
    ];
    this.filteredPemilik = [...this.pemilikList];

  }

  filterPemilik() {
    const q = this.query.toLowerCase();
    this.filteredPemilik = this.pemilikList.filter(
      (p) =>
      p.name.toLowerCase().includes(q) ||
      p.village.toLowerCase().includes(q)
    );
  }

  openPemilik(pemilik:any) {
    //navigasi ke halaman detail pemmilik (nanti) 
    console.log('Buka detail Pemilik:', pemilik);
  }

}
