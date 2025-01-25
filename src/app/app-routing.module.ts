import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameGuard } from './shared/guards/game.guard';
import { PlayerComponent } from './components/player/player.component';
import { GameComponent } from './components/game/game.component';

const routes: Routes = [
  {
    path: '',
    component: PlayerComponent,
  },
  {
    path: 'new-game',
    component: GameComponent,
    canActivate: [GameGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
