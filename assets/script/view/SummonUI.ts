import { _decorator, Button, Color, Component, EventHandler, instantiate, JsonAsset, Label, Node, ProgressBar, resources, Sprite, UITransform, Vec3 } from 'cc';
import { TowerViewModel } from '../viewModel/TowerViewModel';
import { CoinViewModel } from '../viewModel/CoinViewModel';
import { Hero } from '../model/Hero';
import { Subscription } from 'rxjs';
import { gameManager } from '../manager/GameManager';
import { Nullable } from '../misc/types';
import { HeroSummonUI } from './HeroSummonUI';
const { ccclass, property } = _decorator;

@ccclass('SummonUI')
export class SummonUI extends Component {
    
    @property(Node)
    hireButton: Nullable<Node> = null; // The hire button

    @property(Label)
    priceCostLabel: Nullable<Label> = null; // The hire button

    @property(Node)
    heroListContainer: Nullable<Node> = null;  // Container where hero UI elements will be displayed

    @property(ProgressBar)
    summonProgress: Nullable<ProgressBar> = null;

    @property(Node)
    heroSummonNode: Nullable<Node> = null;  // Container where hero UI elements will be displayed

    private towerViewModel!: TowerViewModel;
    private coinViewModel!: CoinViewModel;

    private selectedHero: Nullable<Hero> = null;

    private subscriptions: Subscription[] = [];

    onLoad() {
        // Access Tower and Coin ViewModels from GameManager
        this.coinViewModel = gameManager.coinViewModel;
        this.towerViewModel = gameManager.towerViewModel;

        this.fetchHeroList()

        // Subscribe to hero list updates and render heroes
        const renderAvailableHerosSub = this.towerViewModel.availableHeroes$.subscribe((heroes: Hero[]) => {
          this.renderHeroList(heroes);
        });
        this.subscriptions.push(renderAvailableHerosSub);


        if(this.hireButton !== null){
            // Set up hire button interaction
            const hireButtonComponent = this.hireButton.getComponent(Button);
            if (hireButtonComponent) {
                hireButtonComponent.interactable = false; // Initially disabled
            } else {
                console.warn('Hire button does not have a Button component.');
            }
        }

        // Subscribe to summon progress and update the progress bar
        const summonProgressSub = this.towerViewModel.summonProgress$.subscribe((progress) => {
            if(this.summonProgress !== null)
                this.summonProgress.progress = progress;
        });
        this.subscriptions.push(summonProgressSub);


        // Subscribe to summoning status (display or hide progress bar and icon)
        const isSummoningSub = this.towerViewModel.isSummoning$.subscribe((isSummoning) => {
            if(this.summonProgress !== null){
                this.summonProgress.node.active = isSummoning;
                if (!isSummoning) 
                    this.summonProgress.progress = 0;
            }
        });
        this.subscriptions.push(isSummoningSub);
    }

    fetchHeroList(){
        // Fetch heroes.json from resources and load heroes into ViewModel
        resources.load('/settings/heroes', JsonAsset, (err, jsonAsset) => {
            if (err) {
              console.error("Failed to load heroes.json:", err);
              return;
            }
      
            if(jsonAsset && jsonAsset.json){
                const heroesData = jsonAsset.json['heroes'];
                const heroesList = heroesData.map((heroData: any) => new Hero(
                  heroData.id,
                  heroData.name,
                  heroData.description,
                  heroData.cost,
                  heroData.summonCooldown,
                  heroData.type,
                  heroData.rank
                ));
      
                // Assign the heroes list to the ViewModel
                this.towerViewModel.loadAvailableHeroes(heroesList);
            }
        });
    }

    renderHeroList(heroes: Hero[]) {
      if(this.heroListContainer !== null && this.heroSummonNode !== null)
      {
          // Clear existing list
          this.heroListContainer.removeAllChildren();
      
          heroes.forEach(hero => {
              // Create a new node for each hero
              const heroNode = instantiate(this.heroSummonNode)
              const heroNodeCom = heroNode?.getComponent(HeroSummonUI)
              if(heroNodeCom != null){
                heroNodeCom.initialiseHero(hero)
                heroNodeCom.setRank()
                heroNodeCom.setType()
            }
  
              if(heroNode){
                  // Add this hero node to the list container
                  if(this.heroListContainer !== null)
                    this.heroListContainer.addChild(heroNode);
                      
                  // Add Button component for click events
                  const button = heroNode.addComponent(Button);

                  if(button !== null){
                    // Set up the click event using EventHandler
                    const clickEventHandler = new EventHandler();
                    clickEventHandler.target = this.node;  // The node with the callback function
                    clickEventHandler.component = 'SummonUI';  // Script name where the callback exists
                    clickEventHandler.handler = 'onHeroSelected';  // Method to call on click
                    clickEventHandler.customEventData = hero.id;  // Pass hero ID as custom data
    
                    // Register the event handler to the button's click events
                    button.clickEvents.push(clickEventHandler);
                  }
              }
          });
      }
    }
  
    onHeroSelected(ref: any, heroId: string) {
  
      // Update selectedHero
      const selectedHero = this.towerViewModel.availableHeroes$.value.find(hero => hero.id === heroId);
  
      if(selectedHero){
        this.selectedHero = selectedHero 
  
        // Activate the hire button and update the price cost label
        if(this.hireButton !== null && this.priceCostLabel !== null){
          this.hireButton.active = true;
  
          this.priceCostLabel.string = this.selectedHero.cost.toString();
      
          // Determine if the player has enough currency and queue availability
          const hasEnoughCurrency = this.coinViewModel.hasEnoughCoins(this.selectedHero.cost);
          const hasQueueSpace = this.towerViewModel.summonQueue$.value.length < 5;
      
  
          const hireButtonComponent = this.hireButton.getComponent(Button);
          if (hireButtonComponent) {
            if (hasEnoughCurrency && hasQueueSpace) {
              // this.priceCostLabel.node.color = new Color(0, 255, 0); // Green color
              hireButtonComponent.interactable = true;
            } else {
              // this.priceCostLabel.node.color = new Color(255, 0, 0); // Red color
              hireButtonComponent.interactable = false;
            }
          }
  
        }
  
      }
    }
  
    private highlightSelectedHero(hero: Hero) {
      // Implement highlighting logic
      // For example, iterate through all hero buttons and set highlight on selected one
      if(this.heroListContainer !== null){
        this.heroListContainer.children.forEach(child => {
          const spriteNode = child.getComponent(Sprite)
          if(spriteNode !== null){
            if (child.name === `Hero${hero.id}`) {
              // Add highlight (e.g., change background color or show a border)
              spriteNode.color = new Color(255, 255, 0); // Example: yellow highlight
            } else {
              // Remove highlight
              spriteNode.color = new Color(255, 255, 255); // Default color
            }
          }
        });
      }
    }

    private onHireButtonClicked() {
      if (this.selectedHero) {
        this.towerViewModel.selectHero(this.selectedHero);
        // Optionally, reset selection and UI
        this.resetHeroSelection();
      }
    }
  
    private resetHeroSelection() {
      this.selectedHero = null;
      if(this.hireButton !== null)
        this.hireButton.active = false;
      // this.priceCostLabel.string = '';
  
      if(this.heroListContainer !== null){
        this.heroListContainer.children.forEach(child => {
          const spriteNode = child.getComponent(Sprite)
          if(spriteNode !== null)
              spriteNode.color = new Color(255, 255, 255); // Remove highlight
        });
      }
    }

    onDestroy() {
      // Clean up subscriptions
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}

