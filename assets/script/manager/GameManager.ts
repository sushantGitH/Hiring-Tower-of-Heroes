import { Coin } from "../model/Coin";
import { Hero } from "../model/Hero";
import { HeroSelection } from "../model/HeroSelection";
import { Signpost } from "../model/SignPost";
import { Summon } from "../model/Summon";
import { Tower } from "../model/Tower";
import { CoinViewModel } from "../viewModel/CoinViewModel";
import { SignpostViewModel } from "../viewModel/SignPostViewModel";
import { SummonViewModel } from "../viewModel/SummonViewModel";
import { TowerViewModel } from "../viewModel/TowerViewModel";

class GameManager {
  private static _instance: GameManager;

  // Models
  public coinModel: Coin;
  public towerModel: Tower;
  public summonModel: Summon;
  public signpost: Signpost;

  // ViewModels
  public coinViewModel: CoinViewModel;
  public towerViewModel: TowerViewModel;
  public summonViewModel: SummonViewModel;
  public heroSelection: HeroSelection;
  public signpostViewModel: SignpostViewModel;

  private constructor() {
    // Initialize the models
    this.coinModel = new Coin();
    this.towerModel = new Tower();
    this.summonModel = new Summon();
    this.signpost = new Signpost();

    // Initialize the ViewModels
    this.coinViewModel = new CoinViewModel(this.coinModel);
    this.towerViewModel = new TowerViewModel(this.towerModel, this.coinViewModel);
    this.summonViewModel = new SummonViewModel(this.summonModel);
    this.heroSelection = new HeroSelection();
    this.signpostViewModel = new SignpostViewModel(this.signpost);

    // Subscribe to hero summoned event and forward it to signpostViewModel
    this.towerModel.heroSummoned$.subscribe((hero: Hero) => {
      this.signpostViewModel.addHeroToSignpost(hero);
    });
  }

  // Singleton pattern to ensure only one instance of GameManager exists
  public static getInstance(): GameManager {
    if (!this._instance) {
      this._instance = new GameManager();
    }
    return this._instance;
  }

  // Reset the game state (if needed)
  public resetGameState() {
    this.coinModel = new Coin();
    this.towerModel = new Tower();
    this.coinViewModel = new CoinViewModel(this.coinModel);
    this.towerViewModel = new TowerViewModel(this.towerModel, this.coinViewModel);
    this.summonViewModel = new SummonViewModel(this.summonModel);
  }
}

export const gameManager = GameManager.getInstance();
