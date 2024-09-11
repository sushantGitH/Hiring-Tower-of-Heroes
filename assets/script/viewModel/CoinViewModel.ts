import { BehaviorSubject } from 'rxjs';
import { Coin } from '../model/Coin';

export class CoinViewModel {
    public currentCurrency$: BehaviorSubject<number>;

    constructor(private coin: Coin) {
        // Initialize the currentCurrency$ after coin is initialized
        this.currentCurrency$ = this.coin.currency$;
    }

    // Add coins
    addCoins(amount: number) {
        this.coin.addCoins(amount);
    }

    // Deduct coins
    deductCoins(amount: number) {
        if (this.coin.hasEnoughCoins(amount)) {
        this.coin.deductCoins(amount);
        }
    }

    // Check if enough coins
    hasEnoughCoins(amount: number): boolean {
        return this.coin.hasEnoughCoins(amount);
    }
}
