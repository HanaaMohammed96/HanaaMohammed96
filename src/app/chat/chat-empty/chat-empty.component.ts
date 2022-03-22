import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChatService } from '@core/services/caht.service';
import icMenu from '@iconify/icons-ic/twotone-menu';
import { scaleFadeIn400ms } from '@shared/animations/scale-fade-in.animation';

@Component({
  selector: 'app-chat-empty',
  templateUrl: './chat-empty.component.html',
  animations: [scaleFadeIn400ms]
})
export class ChatEmptyComponent implements OnInit {

  icMenu = icMenu;

  constructor(private chatService: ChatService,
              private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  openDrawer() {
    this.chatService.drawerOpen.next(true);
    this.cd.markForCheck();
  }

  closeDrawer() {
    this.chatService.drawerOpen.next(false);
    this.cd.markForCheck();
  }

}
