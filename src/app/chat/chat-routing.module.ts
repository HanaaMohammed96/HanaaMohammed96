import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { QuicklinkModule } from 'ngx-quicklink';
import { ChatComponent } from './chat.component';
import { ChatConversationComponent } from './chat-conversation/chat-conversation.component';
import { ChatEmptyComponent } from './chat-empty/chat-empty.component';
import { QuicklinkModule } from 'ngx-quicklink';


const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    data: {
      scrollDisabled: true
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ChatEmptyComponent
      },
      {
        path: ':chatId',
        component: ChatConversationComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, QuicklinkModule]
})
export class ChatRoutingModule {
}
