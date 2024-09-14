import { _decorator, Component, instantiate, Label, Node, UIOpacity, Vec3 } from 'cc';
import { CoinViewModel } from '../viewModel/CoinViewModel';
import { Coin } from '../model/Coin';
import { Subscription } from 'rxjs';
import { gameManager } from '../manager/GameManager';
import { Nullable } from '../misc/types';
import {gsap, Linear} from "gsap-cc3";
import { getVec3 } from '../misc/temporary';
import { GsapUtils } from '../utils/gsap-utils';

const { ccclass, property } = _decorator;

@ccclass('HudUI')
export class HudUI extends Component {
  @property(Label)
  currencyLabel: Nullable<Label> = null;

  private currencyDupLabel: Nullable<Node> = null;

  private coinViewModel!: CoinViewModel;
  private subscriptions: Subscription[] = [];
  private tWinNode: Nullable<gsap.core.Timeline> = null

  onLoad() {
    // Access CoinViewModel from GameManager
    this.coinViewModel = gameManager.coinViewModel;

    // Subscribe to the currency stream
    const isCurrenySub = this.coinViewModel.currentCurrency$.subscribe((currency) => {
      if(this.currencyLabel !== null)
        this.currencyLabel.string = currency.toString();
    });
    this.subscriptions.push(isCurrenySub)

    // Subscribe to the deductCurrency stream
    const isCurrenyDupSub = this.coinViewModel.deductCoinCurrency$.subscribe((currency) => {
      if(this.currencyDupLabel === null && this.currencyLabel !== null){
        this.currencyDupLabel = instantiate(this.currencyLabel?.node)
        this.currencyDupLabel.setParent(this.currencyLabel?.node)
      }

      if(this.currencyDupLabel !== null){
        const labelComponent = this.currencyDupLabel.getComponent(Label)
        if(labelComponent !== null){
          labelComponent.string = currency.toString();
          this.animateDupLabel(currency)
        }
      }
    });
    this.subscriptions.push(isCurrenyDupSub)
  }

  animateDupLabel(currencyDiff : number = 0){
    if(this.currencyDupLabel !== null && this.currencyLabel !== null){

      this.currencyDupLabel.setPosition(new Vec3(100,0,0))
      let labelOpabityComponent = this.currencyDupLabel.getComponent(UIOpacity)
      if(labelOpabityComponent == null)
        labelOpabityComponent = this.currencyDupLabel.addComponent(UIOpacity)
      // Set initial opacity to 0
      labelOpabityComponent.opacity = 0;

      if(currencyDiff === 0) return
      

      if (this.tWinNode === null) {
            this.tWinNode = gsap.timeline({})

            const from = getVec3().set(this.currencyDupLabel.position)
            const endPos = getVec3().set(new Vec3(from.x+100, from.y ,0))

            this.tWinNode.add(GsapUtils.ToVec3(from, endPos, this.currencyDupLabel.setPosition, this.currencyDupLabel, {
                duration: 0.5,
                ease: Linear.easeNone
            }))

            this.tWinNode.add(gsap.to(labelOpabityComponent, {
                opacity: 255,
                duration: 0.1
            }), 0)

            this.tWinNode.add(gsap.to(labelOpabityComponent, {
                opacity: 0,
                duration: 0.1
            }), 0.4)
      } else {
          this.tWinNode.restart()
      }
    }
  }

  onDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
