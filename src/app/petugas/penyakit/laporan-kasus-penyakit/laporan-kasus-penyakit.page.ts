import { Component, OnInit } from '@angular/core';
import { PopulasiService } from '../../../services/populasi.service';
import { PeternakService } from '../../../services/peternak.service';

@Component({
  selector: 'app-laporan-kasus-penyakit',
  templateUrl: './laporan-kasus-penyakit.page.html',
  styleUrls: ['./laporan-kasus-penyakit.page.scss'],
  standalone: false,
})
export class LaporanKasusPenyakitPage implements OnInit {
  masterJenisHewan: any[] = [];
  jenisTernakOptions: any[] = [];
  peternakList: any[] = [];
  populasiList: any[] = []; // Menampung daftar hewan / populasi milih peternak terpilih

  formData = {
    peternakan_id: '',
    namaPemilik: '',
    jenisTernak: '',
    kategoriHewan: '', // misal: Ruminansia, Unggas
    usia: '',
    populasi_id: '',
    idHewan: '', // diambil dari populasi Eartag/Code
    jenisKelamin: '',
    tanggal: '',
    gejala: '',
  };

  constructor(
    private populasiService: PopulasiService,
    private peternakService: PeternakService,
  ) {}

  ngOnInit() {
    this.loadDataMaster();
  }

  loadDataMaster() {
    // Ambil Master Jenis Hewan
    this.populasiService.getJenisHewan().subscribe((res: any) => {
      if (res.success || res.status === 'success') {
        const data = res.data || [];
        this.masterJenisHewan = data;

        // Ambil kategori unik
        const uniqueKategori = Array.from(
          new Set(data.map((item: any) => item.kategori)),
        );
        this.jenisTernakOptions = uniqueKategori.map((k) => ({
          label: k,
          value: k,
        }));
      }
    });

    // Ambil Peternak
    this.peternakService.getAll().subscribe((res: any) => {
      if (res.success || res.status === 'success') {
        this.peternakList = res.data || [];
      } else if (Array.isArray(res)) {
        this.peternakList = res;
      }
    });
  }

  onPemilikChange(event: any) {
    const selectedId = event.detail.value;
    if (!selectedId) return;

    const peternak = this.peternakList.find((p) => p.id == selectedId);
    if (peternak) {
      this.formData.peternakan_id = peternak.id;
      this.formData.namaPemilik = peternak.nama_peternak;

      // Ambil populasi hewan milik peternak ini (filter via API)
      this.populasiList = [];
      this.populasiService
        .getPopulasi({ peternakan_id: peternak.id })
        .subscribe((res: any) => {
          if (res.success && res.data) {
            // Asumsi struktur API paginate (data direturn di array property index data)
            this.populasiList = res.data;
          }
        });
    }
  }

  onHewanChange(event: any) {
    const selectedPopulasiId = event.detail.value;
    if (!selectedPopulasiId) return;

    const hewan = this.populasiList.find((h) => h.id == selectedPopulasiId);
    if (hewan) {
      this.formData.populasi_id = hewan.id;
      this.formData.idHewan = hewan.code || hewan.eartag;
      this.formData.kategoriHewan = hewan.kategori;
      this.formData.jenisTernak = hewan.jenis_hewan;
      this.formData.jenisKelamin = hewan.jenis_kelamin;
      this.formData.usia = hewan.umur;
    }
  }
}
