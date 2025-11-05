import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-riwayat-perkembangan-penyakit',
  templateUrl: './riwayat-perkembangan-penyakit.page.html',
  styleUrls: ['./riwayat-perkembangan-penyakit.page.scss'],
  standalone: false,
})
export class RiwayatPerkembanganPenyakitPage implements OnInit {

  // showComponent = false;

  // toggleComponent(){
  //   this.showComponent = !this.showComponent;
  //   console.log('showComponent:', this.showComponent);
  // }

  // backToMain(){
  //   this.showComponent = false;
  // }

   selectedComponent: string | null = null;

  ngOnInit() {
    // otomatis tampilkan komponen 'terdiagnosa' saat halaman dibuka
    this.selectedComponent = 'terdiagnosa';
  }

  openComponent(componentName: string) {
    this.selectedComponent = componentName;
  }

  backToMain() {
    this.selectedComponent = null;
  }


  constructor() { }

 

}
