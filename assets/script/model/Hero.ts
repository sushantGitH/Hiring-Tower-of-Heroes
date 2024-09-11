export class Hero {
    constructor(
      public id: string,
      public name: string,
      public description: string,
      public cost: number,
      public summonCooldown: number,
      public type: string,
      public rank: string
    ) {}
  }
  