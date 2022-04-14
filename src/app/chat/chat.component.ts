import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ChatService } from '@core/services/caht.service';
import { fadeInUp400ms } from '@shared/animations/fade-in-up.animation';
import { stagger80ms } from '@shared/animations/stagger.animation';
import { Observable, of } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { chats } from 'src/static-data/chats';
import icSearch from '@iconify/icons-ic/twotone-search';
import icChat from '@iconify/icons-ic/twotone-chat';
import icCheckCircle from '@iconify/icons-ic/twotone-check-circle';
import icAccessTime from '@iconify/icons-ic/twotone-access-time';
import icDoNotDisturb from '@iconify/icons-ic/twotone-do-not-disturb';
import icOfflineBolt from '@iconify/icons-ic/twotone-offline-bolt';
import { trackById } from '@core/utils/track-by';
import { OnlineStatus } from '../dashboard/toolbar/toolbar-user/toolbar-user-dropdown/toolbar-user-dropdown.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { ChatsClient, ChatVm } from './../@core/api';

export interface Chat {
  id: number;
  imageSrc: string;
  from: string;
  status: string;
  message: string;
  unreadCount: number;
  timestamp: string;
}

export interface ChatMessage {
  id: number;
  from: 'me' | 'partner';
  message: string;
}

@UntilDestroy()
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ChatComponent implements OnInit, OnDestroy{
  // chats$: Observable<Chat[]> = of(chats).pipe(
  //   // Fix to allow stagger animations with static data
  //   delay(0)
  // );
  chats$: Observable<ChatVm[]>
  chats: ChatVm[];

  mobileQuery = this.mediaMatcher.matchMedia('(max-width: 959px)');
  drawerOpen$ = this.chatService.drawerOpen$;

  statuses: OnlineStatus[] ;

  activeStatus: OnlineStatus;

  icCheckCircle = icCheckCircle;
  icSearch = icSearch;
  icChat = icChat;
  trackById = trackById;
  private _mobileQueryListener: () => void;

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private mediaMatcher: MediaMatcher,
    private chatService: ChatService,
    private _translateService: TranslateService,
    private _chatsClient: ChatsClient
  ) {
    this.getStatus().then(statuses=>{
      this.statuses = statuses;
      this.activeStatus = statuses[0];
    });
  }

  ngOnInit() {
    this.mobileQuery.matches ? this.closeDrawer() : this.openDrawer();
    this._mobileQueryListener = () => {
      this.mobileQuery.matches ? this.closeDrawer() : this.openDrawer();
      this.cd.detectChanges();
    };
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      filter(() => this.mobileQuery.matches),
      untilDestroyed(this)
    ).subscribe(() => this.closeDrawer());


    this._chatsClient.get()
    .subscribe(chats=>{
      this.chats$= of(chats).pipe(
        // Fix to allow stagger animations with static data
        delay(0)
      );
    })
  }

  setStatus(status: OnlineStatus) {
    this.activeStatus = status;
    this.cd.markForCheck();
  }
  
  async getStatus(): Promise<OnlineStatus[]>{
    const statuses: OnlineStatus[] = [
      {
        id: 'online',
        label: await this.translate('chat.statuses.online'),
        icon: icCheckCircle,
        colorClass: 'text-green'
      },
      {
        id: 'away',
        label: await this.translate('chat.statuses.away'),
        icon: icAccessTime,
        colorClass: 'text-orange'
      },
      {
        id: 'dnd',
        label: await this.translate('chat.statuses.disturb'),
        icon: icDoNotDisturb,
        colorClass: 'text-red'
      },
      {
        id: 'offline',
        label: await this.translate('chat.statuses.off'),
        icon: icOfflineBolt,
        colorClass: 'text-gray'
      }
    ];
    return statuses;
  }

  drawerChange(drawerOpen: boolean) {
    this.chatService.drawerOpen.next(drawerOpen);
  }

  openDrawer() {
    this.chatService.drawerOpen.next(true);
    this.cd.markForCheck();
  }

  closeDrawer() {
    this.chatService.drawerOpen.next(false);
    this.cd.markForCheck();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  private translate(key: string): Promise<string> {
    return this._translateService.get(key).toPromise();
  }
}
