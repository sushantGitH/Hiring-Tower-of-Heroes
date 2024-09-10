import { _decorator, Button, Color, Component, EventHandler, instantiate, JsonAsset, Label, Node, ProgressBar, resources, Sprite, UITransform, Vec3 } from 'cc';
import { fromEvent } from 'rxjs';
import { TowerViewModel } from './TowerViewModel';
import { Tower } from './Tower';
import { Hero } from './hero';

const { ccclass, property } = _decorator;

@ccclass('TowerUI')
export class TowerUI extends Component {
  @property(Label)
  currencyLabel: Label | null = null;

  @property(ProgressBar)
  summonProgress: ProgressBar | null = null;

  @property(Node)
  summonIcon: Node | null = null; // Icon indicating summoning

  @property(Node)
  heroListContainer: Node | null = null;  // Container where hero UI elements will be displayed

  @property(Node)
  renderNode: Node | null = null;  // Container where hero UI elements will be displayed

  private viewModel!: TowerViewModel;

  onLoad() {
    // Initialize the Tower model and ViewModel here
    const towerModel = new Tower();  // Create the Tower model instance
    this.viewModel = new TowerViewModel(towerModel);  // Initialize the ViewModel with the model

    
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
            this.viewModel.setAvailableHeroes(heroesList);
        }
      });
  }

  start() {
    // Subscribe to hero list updates and render heroes
    this.viewModel.availableHeroes$.subscribe((heroes: Hero[]) => {
      this.renderHeroList(heroes);
    });

    // Subscribe to currency updates
    this.viewModel.currentCurrency$.subscribe((currency) => {
        if(this.currencyLabel !== null)
            this.currencyLabel.string = currency.toString();
    });

    // Subscribe to summon progress and update the progress bar
    this.viewModel.summonProgress$.subscribe((progress) => {
        if(this.summonProgress !== null)
            this.summonProgress.progress = progress;
    });

    // Subscribe to summon progress
    this.viewModel.isSummoning$.subscribe((isSummoning) => {
        if(this.summonIcon !== null && this.summonProgress !== null){
            this.summonIcon.active = isSummoning;
            this.summonProgress.node.active = isSummoning;
            if (isSummoning) {
              // Update progress bar based on the current hero's cooldown time
            } else {
              this.summonProgress.progress = 0;
            }
        }
    });
  }

  renderHeroList(heroes: Hero[]) {
    if(this.heroListContainer !== null && this.renderNode !== null)
    {
        // Clear existing list
        this.heroListContainer.removeAllChildren();
    
        heroes.forEach(hero => {
            // Create a new node for each hero
            const heroNode = instantiate(this.renderNode)

            if(heroNode){
                const heroLabel = heroNode.getChildByName("Label")
                if(heroLabel){
                    const heroLabelComp = heroLabel.getComponent(Label)
                    if(heroLabelComp !== null)
                        heroLabelComp.string = `${hero.name} (\nCost: ${hero.cost})`
                }
            
                // Add this hero node to the list container
                if(this.heroListContainer !== null)
                    this.heroListContainer.addChild(heroNode);
                        
                    // Add Button component for click events
                    const button = heroNode.addComponent(Button);

                    // Set up the click event using EventHandler
                    const clickEventHandler = new EventHandler();
                    clickEventHandler.target = this.node;  // The node with the callback function
                    clickEventHandler.component = 'TowerUI';  // Script name where the callback exists
                    clickEventHandler.handler = 'onHeroSelected';  // Method to call on click
                    clickEventHandler.customEventData = hero.id;  // Pass hero ID as custom data

                    // Register the event handler to the button's click events
                    button.clickEvents.push(clickEventHandler);
            }
        });
    }
  }
  onHeroSelected(ref: any, heroId: string) {
    const selectedHero = this.viewModel.availableHeroes$.value.find(hero => hero.id === heroId);
    if (selectedHero) {
      this.viewModel.selectHero(selectedHero);
    }
  }
}
