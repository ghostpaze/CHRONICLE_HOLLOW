import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { GameComponent } from './game.component';
import { ChatbotComponent } from './chatbot.component';
import { TypewriterTextComponent } from './typewriter-text.component';
import { UiBlipDirective } from './ui-blip.directive';

@NgModule({
  declarations: [AppComponent, GameComponent, ChatbotComponent, TypewriterTextComponent, UiBlipDirective],
  imports: [BrowserModule, FormsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
