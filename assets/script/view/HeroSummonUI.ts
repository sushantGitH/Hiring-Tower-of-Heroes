import { _decorator, Color, Component, Enum, Node, Sprite, SpriteFrame, Tween, tween } from 'cc';
import { Nullable } from '../misc/types';
import { HERO_IMG, HERO_RANK, HERO_TYPE } from '../data/GameData';
import { Hero } from '../model/Hero';
import {gsap, Linear} from "gsap-cc3";
import { getVec3 } from '../misc/temporary';
import { GsapUtils } from '../utils/gsap-utils';

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
@ccclass('HeroImg')
class HeroImg {
    @property({ type: Enum(HERO_IMG) })
    heroImg: Nullable<HERO_IMG> = HERO_IMG.hero_1;  // Allow selecting HERO_RANK values in the editor

    @property(SpriteFrame)
    typeFrame: Nullable<SpriteFrame> = null
}

@ccclass('HeroSummonUI')
export class HeroSummonUI extends Component {
    @property(HeroRank)
    rankList: HeroRank[] = []; 

    @property(HeroType)
    typeList: HeroType[] = []; 

    @property(HeroImg)
    heroList: HeroImg[] = []; 

    @property(Sprite)
    heroSprite: Nullable<Sprite> = null

    @property(Sprite)
    rankSprite: Nullable<Sprite> = null

    @property(Sprite)
    typeSprite: Nullable<Sprite> = null

    @property(Sprite)
    bgFrame: Nullable<Sprite> = null

    private colorTween: Nullable<gsap.core.Timeline> = null
    private myData: Nullable<Hero> = null;

    initialiseHero(heroData : Hero){
        this.myData = heroData

        this.node.name = `Hero${this.myData.id}`
        
        this.setHeroImg()
        this.setRank()
        this.setType()
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
    setHeroImg(){
        if(this.heroSprite !== null){
            this.heroSprite.spriteFrame = this.getHeroFrame()
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
    private getHeroFrame(): SpriteFrame | null {
        if(this.myData){
            for (const data of this.heroList) {
                if (HERO_IMG[data.heroImg!] === this.myData.id) {
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
        if (this.bgFrame) {
            if (this.colorTween === null) {
                // Create a GSAP timeline
                this.colorTween = gsap.timeline({ repeat: -1, yoyo: true });
    
                this.colorTween
                    .add(() => {
                        // Generate a random color
                        const randomColor = this.getRandomColor();
                        if(this.bgFrame !== null)
                            this.bgFrame.color = randomColor;
                    })
                    .to(this.bgFrame, {
                        duration: 0.1,
                        onUpdate: () => {
                            if(this.bgFrame !== null)
                                this.bgFrame.color = this.bgFrame.color;
                        }
                    });
            } else {
                this.colorTween.restart()
            }
        }
    }

    private stopColorTween() {
        // Stop the running tween if it exists
        if (this.colorTween) {
            this.colorTween.pause();
            this.bgFrame!.color = Color.WHITE
        }
    }
}

