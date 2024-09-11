import { BehaviorSubject } from 'rxjs';
import { Tower } from '../model/Tower';
import { Hero } from '../model/Hero';
import { CoinViewModel } from './CoinViewModel';

export class TowerViewModel {
    public availableHeroes$: BehaviorSubject<Hero[]>;
    public summonQueue$: BehaviorSubject<Hero[]>;
    public isSummoning$: BehaviorSubject<boolean>;
    public summonProgress$: BehaviorSubject<number>;

  constructor(private tower: Tower, private coinViewModel: CoinViewModel) {
        // Assign the subjects from the Tower model to the ViewModel
        this.summonQueue$ = tower.summonQueue$;
        this.isSummoning$ = tower.isSummoning$;
        this.summonProgress$ = tower.summonProgress$; // Progress stream for the progress bar

        this.availableHeroes$ = new BehaviorSubject<Hero[]>([]); // Load available heroes later    
  }

  // Method to set available heroes
  loadAvailableHeroes(heroes: Hero[]) {
    this.availableHeroes$.next(heroes);
  }

  // Select a hero and attempt to hire
  selectHero(hero: Hero) {
    const heroPrice = hero.cost;
    
    // Check if the player has enough coins and space in the queue
    if (this.coinViewModel.hasEnoughCoins(heroPrice) && this.summonQueue$.value.length < 5) {
      this.coinViewModel.deductCoins(heroPrice);  // Deduct the hero's price from currency
      this.tower.addHeroToQueue(hero);  // Add hero to the queue
    }
  }
}
