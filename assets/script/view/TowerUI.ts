import { _decorator, Button, Color, Component, EventHandler, instantiate, JsonAsset, Label, Node, ProgressBar, resources, Sprite, UITransform, Vec3 } from 'cc';
import { combineLatest, fromEvent, Subscription } from 'rxjs';
import { TowerViewModel } from '../viewModel/TowerViewModel';
import { Tower } from '../model/Tower';
import { Hero } from '../model/Hero';
import { CoinViewModel } from '../viewModel/CoinViewModel';
import { gameManager } from '../manager/GameManager';
import { Nullable } from '../misc/types';
import { SummonViewModel } from '../viewModel/SummonViewModel';

const { ccclass, property } = _decorator;

@ccclass('TowerUI')
export class TowerUI extends Component {

  @property(Node)
  summonIcon: Nullable<Node> = null; // Icon indicating summoning

  private towerViewModel!: TowerViewModel;
  private summonViewModel!: SummonViewModel;
  private subscriptions: Subscription[] = [];

  onLoad() {
      this.towerViewModel = gameManager.towerViewModel;
      this.summonViewModel = gameManager.summonViewModel;

      // Spread the observables as individual arguments
      const combinedSubscription = combineLatest(
        this.towerViewModel.isSummoning$,
        this.summonViewModel.popupVisibility$
      ).subscribe(([isSummoning, isPopupVisible]) => {
        this.updateSummonIcon(isSummoning, isPopupVisible);
      });

      // Add the combined subscription to the list of subscriptions
      this.subscriptions.push(combinedSubscription);
  }

  // A method to handle both conditions for showing the summon icon
  updateSummonIcon(isSummoning: boolean, isPopupVisible: boolean) {
    if (this.summonIcon !== null) {
      this.summonIcon.active = isSummoning && !isPopupVisible; // Only activate if both are true
    }
  }

  onTowerClicked(){
    this.summonViewModel.showPopup()
  }

  onDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
