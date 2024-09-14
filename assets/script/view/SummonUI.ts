import { _decorator, Button, Color, Component, EventHandler, instantiate, JsonAsset, Label, Node, Prefab, ProgressBar, resources, Sprite, UITransform, Vec3, view, View } from 'cc';
import { TowerViewModel } from '../viewModel/TowerViewModel';
import { CoinViewModel } from '../viewModel/CoinViewModel';
import { Hero } from '../model/Hero';
import { Subscription } from 'rxjs';
import { gameManager } from '../manager/GameManager';
import { HeroSummonUI } from './HeroSummonUI';
import { HeroSummoningPanel } from './HeroSummoningPanel';
import { SummonViewModel } from '../viewModel/SummonViewModel';
import { Nullable } from '../misc/types';
import {gsap, Linear} from "gsap-cc3";
import { getVec3 } from '../misc/temporary';
import { GsapUtils } from '../utils/gsap-utils';

const { ccclass, property } = _decorator;

@ccclass('SummonUI')
export class SummonUI extends Component {

    @property(Node)
    touchLayer: Nullable<Node> = null; 
    
    @property(Node)
    hireButton: Nullable<Node> = null; // The hire button
    @property(Label)
    priceCostLabel: Nullable<Label> = null; // The hire button
    @property(Node)
    priceLayout: Nullable<Node> = null; // The hire button

    @property(Node)
    heroListContainer: Nullable<Node> = null;  // Container where hero UI elements will be displayed

    @property(ProgressBar)
    summonProgress: Nullable<ProgressBar> = null;

    @property(Prefab)
    heroSummonNode: Nullable<Prefab> = null; 

    @property(Node)
    summonPanelNode: Nullable<Node> = null; 

    @property(Node)
    summonQueuePanelNode: Nullable<Node[]> = []; 

    private showPosition = Vec3.ZERO.clone()
    private hidePosition = Vec3.ZERO.clone()

    private towerViewModel!: TowerViewModel;
    private coinViewModel!: CoinViewModel;
    private summonViewModel!: SummonViewModel;

    private selectedHero: Nullable<Hero> = null;

    private subscriptions: Subscription[] = [];

    private tWinNode: Nullable<gsap.core.Timeline> = null

    onLoad() {

        // Get the visible screen height
        const screenHeight = view.getVisibleSize().height;
        // Get the sprite's UITransform component to work with position
        const spriteTransform = this.node.getComponent(UITransform);
        if (spriteTransform) {
            // Set the y position to the negative half of the screen height (placing it at the bottom)
            const spriteHeight = spriteTransform.contentSize.height;

            this.showPosition = new Vec3(0, -(screenHeight / 2) + (spriteHeight / 2), 0);
            this.hidePosition = new Vec3(0, -(screenHeight / 2) - (spriteHeight / 2), 0);

            // Set the new position of the sprite
            this.node.setPosition(this.showPosition);
        }

        // Access Tower and Coin ViewModels from GameManager
        this.coinViewModel = gameManager.coinViewModel;
        this.towerViewModel = gameManager.towerViewModel;
        this.summonViewModel = gameManager.summonViewModel;

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


        // Subscribe to summoning queue
        const summoningQueueSub = this.towerViewModel.summonQueue$.subscribe((summonQueue) => {
            this.updateSummoningQueuUI(summonQueue)
        });
        this.subscriptions.push(summoningQueueSub);


        // Subscribe to hero list updates and render heroes
        const popupAvailabilitySub = this.summonViewModel.popupVisibility$.subscribe((popupVisibility) => {
            this.showPopup(popupVisibility)
          });
        this.subscriptions.push(popupAvailabilitySub);
    }

    private fetchHeroList(){
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

    private renderHeroList(heroes: Hero[]) {
      if(this.heroListContainer !== null && this.heroSummonNode !== null)
      {
          // Clear existing list
          this.heroListContainer.removeAllChildren();
      
          heroes.forEach(hero => {
              // Create a new node for each hero
                if (this.heroSummonNode !== null) {
                    const heroNode = instantiate(this.heroSummonNode)
                    const heroNodeCom = heroNode.getComponent(HeroSummonUI)
                    if(heroNodeCom != null){
                        heroNodeCom.initialiseHero(hero)
                        heroNodeCom.setRank()
                        heroNodeCom.setType()
                    }
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
  
    private onHeroSelected(ref: any, heroId: string) {
  
      // Update selectedHero
      const selectedHero = this.towerViewModel.availableHeroes$.value.find(hero => hero.id === heroId);
  
      if(selectedHero){
        this.highlightSelectedHero(selectedHero)

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
                    hireButtonComponent.interactable = true;
                    if(this.priceLayout)
                        this.priceLayout.active = true
                } else {
                    hireButtonComponent.interactable = false;
                    if(this.priceLayout)
                        this.priceLayout.active = false
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
                const heroNodeCom = child.getComponent(HeroSummonUI)
                if(heroNodeCom != null){
                    heroNodeCom.highLightHero(heroNodeCom.getHeroId() === hero.id)
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
        if(this.hireButton !== null){
            const hireButtonComponent = this.hireButton.getComponent(Button);
            if (hireButtonComponent)
                hireButtonComponent.interactable = false;
            if(this.priceLayout)
                this.priceLayout.active = false
        }
    
        if(this.heroListContainer !== null){
            this.heroListContainer.children.forEach(child => {
                const heroNodeCom = child.getComponent(HeroSummonUI)
                if(heroNodeCom != null){
                    heroNodeCom.highLightHero(false)
                }
            });
        }
    }

    private updateSummoningQueuUI(summonQueue : Hero[]){
        if(this.summonQueuePanelNode !== null){
            for (let i = 0; i < summonQueue.length; i++) {
                const summonNode = this.summonQueuePanelNode[i].getComponent(HeroSummoningPanel)
                if(summonNode){
                    summonNode.setHero(summonQueue[i])
                }
            }


            for (let i = 0; i < this.summonQueuePanelNode.length; i++) {
                const summonNode = this.summonQueuePanelNode[i].getComponent(HeroSummoningPanel)
                if(summonNode){
                    if(summonQueue[i])
                        summonNode.setHero(summonQueue[i])
                    else
                        summonNode.resetPanel(false)
                }
            }
        }
    }

    private onCloseClicked(){
        this.summonViewModel.showPopup()
    }

    private showPopup(toBeShown : boolean = false){
        this.resetHeroSelection()
        const t = gsap.timeline({})

        const from = getVec3().set(this.node.position)
        const endPos = toBeShown ? getVec3().set(this.showPosition) : getVec3().set(this.hidePosition) 
        t.add(GsapUtils.ToVec3(from, endPos, this.node.setPosition, this.node, {
            duration: 0.5,
            ease: Linear.easeNone,
            onComplete: () => {
                this.summonViewModel.resetPopupAnimating()
                if(this.touchLayer !== null)
                    this.touchLayer.active = toBeShown
            },
            callbackScope: this
        }))
    }

    onDestroy() {
      // Clean up subscriptions
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}

