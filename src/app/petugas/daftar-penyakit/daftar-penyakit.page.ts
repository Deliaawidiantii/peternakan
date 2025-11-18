import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-daftar-penyakit',
  templateUrl: './daftar-penyakit.page.html',
  styleUrls: ['./daftar-penyakit.page.scss'],
  standalone: false,
})
export class DaftarPenyakitPage implements OnInit {
  status: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Ambil query param "status" kalau ada
    this.route.queryParamMap.subscribe((params) => {
      this.status = params.get('status');
    });
  }

  // Opsional: fungsi navigasi ke halaman detail
  goToDetail(status: string) {
    this.router.navigate(['/petugas/detail-penyakit'], { queryParams: { status } });
  }
}
