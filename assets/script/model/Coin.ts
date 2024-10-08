import { JsonAsset, resources } from 'cc';
import { BehaviorSubject } from 'rxjs';

export class Coin {
  public currency$ = new BehaviorSubject<number>(0);
  public deductCoinCurrency$ = new BehaviorSubject<number>(0); // Initial currency
  
  constructor() {
    // Set the initial currency value from JSON
    // this.currency$ = new BehaviorSubject<number>(initialCurrency);
  }

  // Update coins
  updateCoins(amount: number) {
    this.currency$.next(amount);
  }

  // Add coins
  addCoins(amount: number) {
    const currentCurrency = this.currency$.value;
    this.currency$.next(currentCurrency + amount);
    this.deductCoinCurrency$.next(amount);
  }

  // Deduct coins
  deductCoins(amount: number) {
    const currentCurrency = this.currency$.value;
    if (currentCurrency >= amount) {
      this.currency$.next(currentCurrency - amount);
      this.deductCoinCurrency$.next(-1*amount);
    }
  }

  // Check if there are enough coins
  hasEnoughCoins(amount: number): boolean {
    return this.currency$.value >= amount;
  }
}
