import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


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
  standalone: false
})
export class LahirPage implements OnInit {

  lahirForm: FormGroup;
  hewanInduk: HewanInduk | null = null;
  fotoFileName: string = '';

  // Dummy data induk untuk testing
  hewanIndukList: HewanInduk[] = [
    {
      id: '1',
      eartagBetina: 'ID-001-2024',
      jenisTernak: 'Sapi',
      rumpunTernak: 'Simental'
    },
    {
      id: '2',
      eartagBetina: 'ID-002-2024',
      jenisTernak: 'Kerbau',
      rumpunTernak: 'Kerbau Lumpur'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.lahirForm = this.fb.group({
      eartagAnak: ['', Validators.required],
      tanggalLahir: ['', Validators.required],
      jenisKelamin: ['', Validators.required],
      kondisi: ['', Validators.required],
      jenisTernakAnak: ['', Validators.required],
      rumpunTernakAnak: ['', Validators.required],
      beratBadan: ['', [Validators.required, Validators.min(0)]],
      panjangBadan: ['', [Validators.required, Validators.min(0)]],
      tinggiPundak: ['', [Validators.required, Validators.min(0)]],
      lingkarDada: ['', [Validators.required, Validators.min(0)]],
      catatan: ['']
    });
  }

  ngOnInit() {
    // Ambil ID dari query params
    this.route.queryParams.subscribe(params => {
      const hewanId = params['eartagId'];
      if (hewanId) {
        this.loadHewanInduk(hewanId);
      }
    });
  }

  loadHewanInduk(id: string) {
    // Cari hewan induk berdasarkan ID
    const found = this.hewanIndukList.find(h => h.id === id);
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
      fotoAnak: this.fotoFileName || undefined
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