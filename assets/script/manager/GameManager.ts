import { Coin } from "../model/Coin";
import { Tower } from "../model/Tower";
import { CoinViewModel } from "../viewModel/CoinViewModel";
import { TowerViewModel } from "../viewModel/TowerViewModel";

class GameManager {
  private static _instance: GameManager;

  // Models
  public coinModel: Coin;
  public towerModel: Tower;

  // ViewModels
  public coinViewModel: CoinViewModel;
  public towerViewModel: TowerViewModel;

  private constructor() {
    // Initialize the models
    this.coinModel = new Coin();
    this.towerModel = new Tower();

    // Initialize the ViewModels
    this.coinViewModel = new CoinViewModel(this.coinModel);
    this.towerViewModel = new TowerViewModel(this.towerModel, this.coinViewModel);
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
  }
}

export const gameManager = GameManager.getInstance();
