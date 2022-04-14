import { Component, Input, OnInit, ViewChild, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ScrollbarComponent } from '../scrollbar/scrollbar.component';
import icSend from '@iconify/icons-ic/twotone-send';

@Component({
  selector: 'app-emoji-gif-uploadFile',
  templateUrl: './emoji-gif-uploadFile.component.html',
  styleUrls: ['./emoji-gif-uploadFile.component.scss']
})
export class EmojiGifUploadFileComponent implements OnInit , OnChanges{
  @Input() hide: boolean;
  @Input() _toggle: boolean;
  @Output() emojiPick: EventEmitter<string> = new EventEmitter();

  lang: string;

  form = new FormGroup({
    message: new FormControl()
  });

  icSend = icSend;
  @ViewChild(ScrollbarComponent, { static: true }) scrollbar: ScrollbarComponent;
  toggled: boolean = false;
  gifSearch: boolean = false;


  constructor() {
    this.lang = localStorage.getItem('lang');
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.toggled= this._toggle;
  }

  ngOnInit() {
  }

  

  scrollToBottom() {
    this.scrollbar.scrollbarRef.getScrollElement().scrollTo({
      behavior: 'smooth',
      top: this.scrollbar.scrollbarRef.getContentElement().clientHeight
    });
  }

  

  

  upload(files){
    this.form.get('message').value ?
    this.form.get('message').setValue(`${this.form.get('message').value} ${files[0].name}`) :
    this.form.get('message').setValue(`${files[0].name}`);
  }

  addEmoji(evt){
      this.emojiPick.emit(evt.emoji.native);
  }

}
