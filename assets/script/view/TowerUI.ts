import { _decorator, Button, Color, Component, EventHandler, instantiate, JsonAsset, Label, Node, ProgressBar, resources, Sprite, UITransform, Vec3 } from 'cc';
import { fromEvent, Subscription } from 'rxjs';
import { TowerViewModel } from '../viewModel/TowerViewModel';
import { Tower } from '../model/Tower';
import { Hero } from '../model/Hero';
import { CoinViewModel } from '../viewModel/CoinViewModel';
import { gameManager } from '../manager/GameManager';
import { Nullable } from '../misc/types';

const { ccclass, property } = _decorator;

@ccclass('TowerUI')
export class TowerUI extends Component {

  @property(Node)
  summonIcon: Nullable<Node> = null; // Icon indicating summoning

  private towerViewModel!: TowerViewModel;
  private subscriptions: Subscription[] = [];

  onLoad() {
      this.towerViewModel = gameManager.towerViewModel;

      // Subscribe to summoning status (display or hide progress bar and icon)
      const isSummoningSub = this.towerViewModel.isSummoning$.subscribe((isSummoning) => {
        if(this.summonIcon !== null){
              this.summonIcon.active = isSummoning;
          }
      });
      this.subscriptions.push(isSummoningSub);
  }

  onDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
