import BaseBitmapText from "../Base/BaseBitmapText";
import BaseSlot from "../Base/BaseSlot";

export default class SlotWithText extends Phaser.GameObjects.Container {

    baseSlot: BaseSlot;
    baseText: BaseBitmapText;

    set pointerUp(func: Function) {
        this.baseSlot.pointerUp = func;
    }

    constructor(scene: Phaser.Scene, x: number, y: number, config: any) {
        super(scene, x, y);

        this.baseSlot = new BaseSlot(scene, 0, 0, { texture: config.texture });
        this.baseSlot.setOrigin(0.5);

        this.baseText = new BaseBitmapText(scene, 0, -10, { text: config.text, font: config.font, size: config.size, align: config.align });
        this.baseText.setOrigin(0.5);        
        this.baseText.setTint(config.color);

        this.add([this.baseSlot, this.baseText]);

        scene.add.existing(this);
    }
}
