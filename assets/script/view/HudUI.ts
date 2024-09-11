import { _decorator, Component, Label } from 'cc';
import { CoinViewModel } from '../viewModel/CoinViewModel';
import { Coin } from '../model/Coin';
import { Subscription } from 'rxjs';

const { ccclass, property } = _decorator;

@ccclass('HudUI')
export class HudUI extends Component {
  @property(Label)
  currencyLabel: Label | null = null;

  private viewModel!: CoinViewModel;
  private subscription!: Subscription;

  // Method to set the ViewModel
  setViewModel(viewModel: CoinViewModel) {
    this.viewModel = viewModel;
    this.subscribeToViewModel();
  }

  private subscribeToViewModel() {
    if (this.viewModel) {
      this.subscription = this.viewModel.currentCurrency$.subscribe((currency) => {
        if(this.currencyLabel !== null)
          this.currencyLabel.string = currency.toString();
      });
    }
  }

  onDestroy() {
    // Clean up subscription
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
