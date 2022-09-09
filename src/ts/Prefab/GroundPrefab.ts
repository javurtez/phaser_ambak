import { Texture } from "../Managers/AssetManager";
import BaseSprite from "../Trebert/Base/BaseSprite";

export default class GroundPrefab extends Phaser.GameObjects.Container {

    private groundList: BaseSprite[] = [];
    private nextGround: GroundPrefab;
    private prevGround: GroundPrefab;

    private groundedIndexList: number[] = [];

    private toFinalY: number = 0;

    public isGrounded(index: number) {
        return this.groundedIndexList.includes(index);
    }

    constructor(scene: Phaser.Scene, x: number, y: number, index: number) {
        super(scene, x, y);

        this.name = "ground_" + index;

        for (var i = 0; i < 5; i++) {
            let ground = new BaseSprite(scene, -300 + (i * 150), 0, Texture.ground);
            this.groundList.push(ground);
        }

        this.add(this.groundList);

        scene.add.existing(this);
    }

    public initGround(): void {
        for (var i = 0; i < this.groundList.length; i++) {
            this.groundList[i].setImage(Texture.no_ground);
        }
        this.groundList[2].setImage(Texture.ground);
        this.groundedIndexList.length = 0;
        this.groundedIndexList.push(2);
    }
    public setNextGround(n_ground: GroundPrefab, p_ground: GroundPrefab, isAdjust: boolean = true): void {
        this.nextGround = n_ground;
        this.prevGround = p_ground;

        if (!isAdjust) return;
        this.nextGround.adjustGround(this);
    }
    private adjustGround(ground: GroundPrefab): void {
        for (var i = 0; i < this.groundList.length; i++) {
            this.groundList[i].setImage(Texture.no_ground);
        }
        this.groundedIndexList.length = 0;
        var wayPoint = Phaser.Math.Between(0, 100);
        var dir = "both";
        if (wayPoint < 45) {
            dir = "left";
        }
        else if (wayPoint >= 45 && wayPoint <= 55) {
            dir = "both";
        }
        else {
            dir = "right";
        }
        for (var i = 0; i < ground.groundedIndexList.length; i++) {
            const number = ground.groundedIndexList[i];
            if ((number - 1 >= 0 && !ground.groundedIndexList.includes(number - 1)) && (dir == "left" || dir == "both") || number == this.groundList.length - 1) {
                this.groundList[number - 1].setImage(Texture.ground);
                this.groundedIndexList.push(number - 1);
            }
            if (number + 1 < this.groundList.length && !ground.groundedIndexList.includes(number + 1) && (dir == "right" || dir == "both") || number == 0) {
                this.groundList[number + 1].setImage(Texture.ground);
                this.groundedIndexList.push(number + 1);
            }
        }
    }
    public moveGroundDown(): void {
        this.toFinalY = this.y + 200;
        this.scene.tweens.add({
            targets: this,
            y: this.toFinalY,
            duration: 100,
            ease: "Linear",
            onComplete: () => {
                console.log(this.name + "_" + this.y);
                if (this.y >= 700) {
                    this.y = this.prevGround.toFinalY - 200;
                    this.adjustGround(this.prevGround);
                }
            }
        });
    }
}
