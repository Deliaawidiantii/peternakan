import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { PopulasiService } from '../../../services/populasi.service';

interface HewanInduk {
  id: string;
  eartagBetina: string;
  jenisTernak: string;
  rumpunTernak: string;
}

interface DataLahir {
  eartagInduk: string;
  eartagAnak: string;
  tanggalLahir: string;
  jenisKelamin: 'Jantan' | 'Betina';
  kondisi: 'Sehat' | 'Cacat' | 'Mati' | 'Prematur';
  jenisTernakAnak: 'Sapi' | 'Kerbau';
  rumpunTernakAnak: string;
  beratBadan: number;
  panjangBadan: number;
  tinggiPundak: number;
  lingkarDada: number;
  fotoAnak?: string;
  catatan?: string;
}

@Component({
  selector: 'app-lahir',
  templateUrl: './lahir.page.html',
  styleUrls: ['./lahir.page.scss'],
  standalone: false,
})
export class LahirPage implements OnInit {
  lahirForm: FormGroup;
  hewanInduk: HewanInduk | null = null;
  fotoFileName: string = '';

  masterJenisHewan: any[] = [];
  jenisTernakOptions: any[] = [];
  rumpunTernakOptions: any[] = [];

  // Dummy data induk untuk testing
  hewanIndukList: HewanInduk[] = [
    {
      id: '1',
      eartagBetina: 'ID-001-2024',
      jenisTernak: 'Sapi',
      rumpunTernak: 'Simental',
    },
    {
      id: '2',
      eartagBetina: 'ID-002-2024',
      jenisTernak: 'Kerbau',
      rumpunTernak: 'Kerbau Lumpur',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private populasiService: PopulasiService,
  ) {
    this.lahirForm = this.fb.group({
      eartagAnak: [''],
      tanggalLahir: ['', Validators.required],
      jenisKelamin: ['', Validators.required],
      kondisi: ['', Validators.required],
      jenisTernakAnak: ['', Validators.required],
      rumpunTernakAnak: [''],
      beratBadan: [''],
      panjangBadan: [''],
      tinggiPundak: [''],
      lingkarDada: [''],
      catatan: [''],
    });
  }

  ngOnInit() {
    this.loadDataMaster();

    // Ambil ID dari query params
    this.route.queryParams.subscribe((params) => {
      const hewanId = params['eartagId'];
      if (hewanId) {
        this.loadHewanInduk(hewanId);
      }
    });

    // Listen to changes on jenisTernakAnak to filter rumpun
    this.lahirForm
      .get('jenisTernakAnak')
      ?.valueChanges.subscribe((selectedKategori) => {
        this.onJenisTernakChange(selectedKategori);
      });
  }

  loadDataMaster() {
    this.populasiService.getJenisHewan().subscribe((res: any) => {
      if (res.success || res.status === 'success') {
        const data = res.data || [];
        this.masterJenisHewan = data;

        const uniqueKategori = Array.from(
          new Set(data.map((item: any) => item.kategori)),
        );
        this.jenisTernakOptions = uniqueKategori.map((k) => ({
          label: k,
          value: k,
        }));
      }
    });
  }

  onJenisTernakChange(selectedKategori: string) {
    this.rumpunTernakOptions = [];
    if (!selectedKategori) return;

    // Reset rumpunTernakAnak form control
    if (this.lahirForm.get('jenisTernakAnak')?.value !== selectedKategori) {
      this.lahirForm.patchValue({ rumpunTernakAnak: '' });
    }

    const filteredRumpun = this.masterJenisHewan.filter(
      (item) => item.kategori === selectedKategori,
    );
    this.rumpunTernakOptions = filteredRumpun.map((item) => ({
      label: item.nama,
      value: item.nama,
    }));
  }

  loadHewanInduk(id: string) {
    // Cari hewan induk berdasarkan ID
    const found = this.hewanIndukList.find((h) => h.id === id);
    if (found) {
      this.hewanInduk = found;
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fotoFileName = file.name;
      console.log('File selected:', file);
      // TODO: Implement file upload
    }
  }

  simpanData() {
    if (!this.lahirForm.valid) {
      alert('Mohon isi semua field yang diperlukan!');
      return;
    }

    const dataLahir: DataLahir = {
      eartagInduk: this.hewanInduk?.eartagBetina || '',
      ...this.lahirForm.value,
      fotoAnak: this.fotoFileName || undefined,
    };

    console.log('Data Lahir yang disimpan:', dataLahir);
    alert('Data lahir berhasil disimpan!');

    // TODO: Kirim data ke backend API
    // await this.apiService.saveLahirData(dataLahir);

    // Navigate kembali ke riwayat
    this.router.navigate(['/petugas/perkawinan/riwayat-perkawinan']);
  }

  batal() {
    console.log('Input lahir dibatalkan');
    this.router.navigate(['/petugas/perkawinan/riwayat-perkawinan']);
  }
}
