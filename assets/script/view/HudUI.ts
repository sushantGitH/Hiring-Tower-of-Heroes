import { _decorator, Component, Label } from 'cc';
import { CoinViewModel } from '../viewModel/CoinViewModel';
import { Coin } from '../model/Coin';
import { Subscription } from 'rxjs';
import { gameManager } from '../manager/GameManager';
import { Nullable } from '../misc/types';

const { ccclass, property } = _decorator;

@ccclass('HudUI')
export class HudUI extends Component {
  @property(Label)
  currencyLabel: Nullable<Label> = null;

  private coinViewModel!: CoinViewModel;
  private subscription!: Subscription;

  onLoad() {
    // Access CoinViewModel from GameManager
    this.coinViewModel = gameManager.coinViewModel;

    // Subscribe to the currency stream
    this.subscription = this.coinViewModel.currentCurrency$.subscribe((currency) => {
      if(this.currencyLabel)
        this.currencyLabel.string = currency.toString();
    });
  }

  onDestroy() {
    // Clean up subscription
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
