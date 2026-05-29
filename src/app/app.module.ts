import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { GameComponent } from './game.component';
import { ChatbotComponent } from './chatbot.component';
import { TypewriterTextComponent } from './typewriter-text.component';
import { UiBlipDirective } from './ui-blip.directive';

@NgModule({
  declarations: [AppComponent, GameComponent, ChatbotComponent, TypewriterTextComponent, UiBlipDirective],
  imports: [BrowserModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
