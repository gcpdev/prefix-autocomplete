import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {HighlightPipe} from './autocomplete/autocomplete.pipe';

@NgModule({
  declarations: [HighlightPipe],
  imports: [CommonModule],
  exports: [HighlightPipe]
})

export class MainPipe {}
