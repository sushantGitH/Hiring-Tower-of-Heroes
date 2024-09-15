import { _decorator, Button, Color, Component, EventHandler, instantiate, JsonAsset, Label, Node, Prefab, ProgressBar, resources, Sprite, UITransform, Vec3 } from 'cc';
import { combineLatest, fromEvent, Subscription } from 'rxjs';
import { TowerViewModel } from '../viewModel/TowerViewModel';
import { Tower } from '../model/Tower';
import { Hero } from '../model/Hero';
import { CoinViewModel } from '../viewModel/CoinViewModel';
import { gameManager } from '../manager/GameManager';
import { Nullable } from '../misc/types';
import { SummonViewModel } from '../viewModel/SummonViewModel';
import { HeroDescriptionUI } from './HeroDescriptionUI';
import { HeroSelection } from '../model/HeroSelection';

const { ccclass, property } = _decorator;

@ccclass('TowerUI')
export class TowerUI extends Component {

  @property(Node)
  summonIcon: Nullable<Node> = null; // Icon indicating summoning

  @property(Prefab)
  herDesc: Nullable<Prefab> = null; 


  private herDescUi: Nullable<Node> = null;

  private towerViewModel!: TowerViewModel;
  private summonViewModel!: SummonViewModel;
  private heroselectionModel!: HeroSelection;
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

      this.loadHeroDesc()
  }

  loadHeroDesc(){
      if(this.herDesc !== null){
        this.herDescUi = instantiate(this.herDesc)
        this.herDescUi.parent = this.node
        this.herDescUi.setPosition(new Vec3(0,900,0))
        this.herDescUi.setScale(new Vec3(2,2,2))
        this.herDescUi.active = true
      }

      this.heroselectionModel = gameManager.heroSelection;

      // Subscribe to the popup data observable
      const herSelectionSub = this.heroselectionModel.popupData$.subscribe((heroData) => {
        if(this.herDescUi !== null){
          if (heroData) {
              this.herDescUi.active = true;  // Activate popup

              const heroSelComp = this.herDescUi.getComponent(HeroDescriptionUI)
              if(heroSelComp !== null)
                heroSelComp.setHero(heroData)
          } else {
              this.herDescUi.active = false;  // Deactivate popup
          }
        }
      });
      this.subscriptions.push(herSelectionSub);
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
