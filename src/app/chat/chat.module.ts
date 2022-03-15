import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { ChatEmptyComponent } from './chat-empty/chat-empty.component';
import { ChatConversationComponent } from './chat-conversation/chat-conversation.component';
import { ChatRoutingModule } from './chat-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [ChatComponent, ChatEmptyComponent, ChatConversationComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    ReactiveFormsModule,
    ScrollingModule,
    SharedModule
  ],
})
export class ChatModule { }
