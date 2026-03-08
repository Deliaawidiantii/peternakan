import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit, OnDestroy {
  constructor(private websocketService: WebsocketService) {}

  ngOnInit() {
    this.websocketService.connect();
  }

  ngOnDestroy() {
    this.websocketService.disconnect();
  }
}
