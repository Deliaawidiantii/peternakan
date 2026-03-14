import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  standalone: false,
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() defaultHref = '/petugas/tabs/home';
  @Input() compact = true;
  @Input() showBackButton = true;
}
