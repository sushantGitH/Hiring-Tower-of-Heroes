import { Coin } from "../model/Coin";
import { HeroSelection } from "../model/HeroSelection";
import { Summon } from "../model/Summon";
import { Tower } from "../model/Tower";
import { CoinViewModel } from "../viewModel/CoinViewModel";
import { SummonViewModel } from "../viewModel/SummonViewModel";
import { TowerViewModel } from "../viewModel/TowerViewModel";

class GameManager {
  private static _instance: GameManager;

  // Models
  public coinModel: Coin;
  public towerModel: Tower;
  public summonModel: Summon;

  // ViewModels
  public coinViewModel: CoinViewModel;
  public towerViewModel: TowerViewModel;
  public summonViewModel: SummonViewModel;
  public heroSelection: HeroSelection;

  private constructor() {
    // Initialize the models
    this.coinModel = new Coin();
    this.towerModel = new Tower();
    this.summonModel = new Summon();

    // Initialize the ViewModels
    this.coinViewModel = new CoinViewModel(this.coinModel);
    this.towerViewModel = new TowerViewModel(this.towerModel, this.coinViewModel);
    this.summonViewModel = new SummonViewModel(this.summonModel);
    this.heroSelection = new HeroSelection();
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
