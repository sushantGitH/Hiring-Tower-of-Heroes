import { _decorator, Color, Component, Enum, Node, Sprite, SpriteFrame, Tween, tween } from 'cc';
import { Nullable } from '../misc/types';
import { HERO_RANK, HERO_TYPE } from '../data/GameData';
import { Hero } from '../model/Hero';

const { ccclass, property } = _decorator;


@ccclass('HeroRank')
class HeroRank {
    @property({ type: Enum(HERO_RANK) })
    rankType: Nullable<HERO_RANK> = HERO_RANK.s;  // Allow selecting HERO_RANK values in the editor

    @property(SpriteFrame)
    rankFrame: Nullable<SpriteFrame> = null
}
@ccclass('HeroType')
class HeroType {
    @property({ type: Enum(HERO_TYPE) })
    heroType: Nullable<HERO_TYPE> = HERO_TYPE.wind;  // Allow selecting HERO_RANK values in the editor

    @property(SpriteFrame)
    typeFrame: Nullable<SpriteFrame> = null
}

@ccclass('HeroSummonUI')
export class HeroSummonUI extends Component {
    @property(HeroRank)
    rankList: HeroRank[] = []; 

    @property(HeroType)
    typeList: HeroType[] = []; 

    @property(Sprite)
    heroSprite: Nullable<Sprite> = null

    @property(Sprite)
    rankSprite: Nullable<Sprite> = null

    @property(Sprite)
    typeSprite: Nullable<Sprite> = null

    @property(Sprite)
    bgFrame: Nullable<Sprite> = null

    private colorTween: Tween<Node> | null = null;  // Store reference to the running tween
    private myData: Nullable<Hero> = null;

    initialiseHero(heroData : Hero){
        this.myData = heroData

        this.node.name = `Hero${this.myData.id}`
    }

    highLightHero(isHighLight : boolean = false){
        if (isHighLight) 
            this.startRandomColorTween()
        else
            this.stopColorTween()
    }
    

    setRank(){
        if(this.rankSprite !== null){
            this.rankSprite.spriteFrame = this.getRankFrame()
        }
    }
    setType(){
        if(this.typeSprite !== null){
            this.typeSprite.spriteFrame = this.getTypeFrame()
        }
    }

    getHeroId(){
        if(this.myData)
            return this.myData.id
        return null
    }

    private getRankFrame(): SpriteFrame | null {
        if(this.myData){
            for (const data of this.rankList) {
                if (HERO_RANK[data.rankType!] === this.myData.rank) {
                    return data.rankFrame;
                }
            }
        }
        return null;
    }
    private getTypeFrame(): SpriteFrame | null {
        if(this.myData){
            for (const data of this.typeList) {
                if (HERO_TYPE[data.heroType!] === this.myData.type) {
                    return data.typeFrame;
                }
            }
        }
        return null;
    }

    private getRandomColor(): Color {
        return new Color(
            Math.floor(Math.random() * 256),  // Random R (0-255)
            Math.floor(Math.random() * 256),  // Random G (0-255)
            Math.floor(Math.random() * 256),  // Random B (0-255)
            255  // Full opacity
        );
    }
    
    private startRandomColorTween() {
        this.stopColorTween()
        // Create and store the tween reference
        if(this.bgFrame !== null){
            this.colorTween = tween(this.bgFrame.node)
                .repeatForever(
                    tween()
                        .call(() => {
                            // Generate a random color at each step
                            const randomColor = this.getRandomColor();
                            this.bgFrame!.color = randomColor;
                        })
                        .to(0.1, { }) // Let the tween happen over 1 second
                )
                .start();
        }
    }

    private stopColorTween() {
        // Stop the running tween if it exists
        if (this.colorTween) {
            this.colorTween.stop();
            this.colorTween = null;  // Optionally set to null after stopping
            this.bgFrame!.color = Color.WHITE
        }
    }
}

