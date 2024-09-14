import { BehaviorSubject } from 'rxjs';
import { Coin } from '../model/Coin';
import { JsonAsset, resources } from 'cc';

export class CoinViewModel {
    public currentCurrency$: BehaviorSubject<number>;
    public deductCoinCurrency$: BehaviorSubject<number>;

    constructor(private coin: Coin) {
        // Initialize the currentCurrency$ after coin is initialized
        this.currentCurrency$ = this.coin.currency$;
        this.deductCoinCurrency$ = this.coin.deductCoinCurrency$;

        this.fetchInitialData()
    }


    private fetchInitialData(){
        // Fetch heroes.json from resources and load heroes into ViewModel
        resources.load('/settings/initial_state', JsonAsset, (err, jsonAsset) => {
            if (err) {
            console.error("Failed to load initial_state.json:", err);
            return;
            }
    
            if(jsonAsset && jsonAsset.json){
                const heroesData = jsonAsset.json['state'];
                if(heroesData.currency)
                    this.coin.updateCoins(heroesData.currency)
            }
        });
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
