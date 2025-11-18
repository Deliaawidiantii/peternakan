import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-jadwal-kegiatan',
  templateUrl: './jadwal-kegiatan.page.html',
  styleUrls: ['./jadwal-kegiatan.page.scss'],
  standalone: false
})
export class JadwalKegiatanPage implements OnInit {

  selectedTab: string = 'semua';

  // DATA KEGIATAN (ganti sesuai data API / DB)
  kegiatanList = [
    {
      id: 1,
      nama: 'Vaksinasi Ternak',
      status: 'akan-datang',
      statusLabel: 'Akan Datang',
      tanggal: '2024-07-20',
      waktu: '10:00 AM - 12:00 PM',
      lokasi: 'Balai Desa',
    },
    {
      id: 2,
      nama: 'Pemeriksaan Kesehatan Hewan',
      status: 'selesai',
      statusLabel: 'Selesai',
      tanggal: '2024-06-15',
      waktu: '09:00 AM - 11:00 AM',
      lokasi: 'Klinik Hewan',
    },
    {
      id: 3,
      nama: 'Pengambilan Sampel Darah',
      status: 'berjalan',
      statusLabel: 'Sedang Berjalan',
      tanggal: '2024-08-05',
      waktu: '01:00 PM - 03:00 PM',
      lokasi: 'Klinik Hewan',
    },
    {
      id: 4,
      nama: 'Edukasi Pemilik Hewan',
      status: 'akan-datang',
      statusLabel: 'Akan Datang',
      tanggal: '2024-09-10',
      waktu: '02:00 PM - 04:00 PM',
      lokasi: 'Balai Desa',
    },
    {
      id: 5,
      nama: 'Sterilisasi Hewan',
      status: 'selesai',
      statusLabel: 'Selesai',
      tanggal: '2024-05-25',
      waktu: '08:00 AM - 10:00 AM',
      lokasi: 'Klinik Hewan',
    }
  ];

  constructor(
    private router: Router,
    private el : ElementRef,
    private renderer : Renderer2
  ) { }

  ngOnInit() {
    this.renderKegiatan();
  }

    goToDetail() {
    this.router.navigate(['/petugas/detail-kegiatan']);
  }

  ionViewWillEnter() {
    this.renderKegiatan();
  }

  // FUNGSI KETIKA TAB BERUBAH
  segmentChanged(event: any) {
    this.selectedTab = event.detail.value;
    this.renderKegiatan();
  }

  // FUNGSI RENDER LIST KEGIATAN
  renderKegiatan() {
    const listElement = document.getElementById('kegiatanList');
    const emptyState = document.getElementById('emptyState');
    const emptyMessage = document.getElementById('emptyMessage');

    if (!listElement || !emptyState || !emptyMessage) return;

    // Filter data berdasarkan tab yang dipilih
    const filteredData = this.selectedTab === 'semua'
      ? this.kegiatanList
      : this.kegiatanList.filter(kegiatan => kegiatan.status === this.selectedTab);

    // Jika data kosong, tampilkan empty state
    if (filteredData.length === 0) {
      listElement.style.display = 'none';
      emptyState.style.display = 'block';

      // Ubah pesan sesuai tab
      if (this.selectedTab === 'akan-datang') {
        emptyMessage.textContent = 'Tidak ada kegiatan yang akan datang';
      } else if (this.selectedTab === 'berjalan') {
        emptyMessage.textContent = 'Tidak ada kegiatan yang sedang berjalan';
      } else if (this.selectedTab === 'selesai') {
        emptyMessage.textContent = 'Tidak ada kegiatan yang selesai';
      } else {
        emptyMessage.textContent = 'Tidak ada kegiatan';
      }
      return;
    }

    // Tampilkan list dan sembunyikan empty state
    listElement.style.display = 'block';
    emptyState.style.display = 'none';

    // Clear isi list
    listElement.innerHTML = '';

    // Render setiap kegiatan
    filteredData.forEach(kegiatan => {
      const item = this.createKegiatanItem(kegiatan);
      listElement.appendChild(item);
    });
  }

  // FUNGSI MEMBUAT ELEMENT KEGIATAN
  createKegiatanItem(kegiatan: any): HTMLElement {
    const ionItem = document.createElement('ion-item');
    ionItem.className = `jadwal-item status-${kegiatan.status}`;
    ionItem.setAttribute('button', 'true');
    ionItem.setAttribute('detail', 'false');

    // Icon Box
    const iconBox = document.createElement('div');
    iconBox.className = 'icon-box';
    iconBox.setAttribute('slot', 'start');
    iconBox.innerHTML = '<ion-icon name="calendar-outline"></ion-icon>';

    // Label
    const label = document.createElement('ion-label');
    label.innerHTML = `
      <h2>${kegiatan.nama}</h2>
      <p>${kegiatan.statusLabel}</p>
      <p>${kegiatan.tanggal} | ${kegiatan.waktu}</p>
      <p>📍 ${kegiatan.lokasi}</p>
    `;

    // Chevron Icon
    const chevron = document.createElement('ion-icon');
    chevron.setAttribute('slot', 'end');
    chevron.setAttribute('name', 'chevron-forward-outline');

    // Gabungkan semua element
    ionItem.appendChild(iconBox);
    ionItem.appendChild(label);
    ionItem.appendChild(chevron);

    // Tambah event click
    this.renderer.listen(ionItem, 'click', () => {
  console.log('Kegiatan diklik:', kegiatan.nama, '- ID:', kegiatan.id);
  this.goToDetail();
});


    return ionItem;
  }

}