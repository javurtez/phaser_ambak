import { Font } from "../../Managers/AssetManager";
import { EventManager } from "../../Managers/EventManager";
import LocalizationManager from "../../Managers/LocalizationManager";
import BaseBitmapText from "../Base/BaseBitmapText";

export default class LocalizationBitmapText extends BaseBitmapText {

    localKey: string;

    constructor(scene: Phaser.Scene, x: number, y: number, config: any) {
        let locale = LocalizationManager.Instance.getLocalizedTextObject(config.key);

        super(scene, x, y, { font: Font[locale.font], text: locale.text, size: locale.size, align: locale.align, key: config.key });
        this.setTint(locale.color);
    }

    protected initProperty(config: any): void {
        this.localKey = config.key;
    }
    protected initListeners(): void {
        EventManager.CHANGE_LANGUAGE.addListener(() => {
            let locale = LocalizationManager.Instance.getLocalizedTextObject(this.localKey);

            this.align = locale.align;
            this.setFont(Font[locale.font]);
            this.setFontSize(locale.size);
            this.setText(locale.text);
            this.setTint(locale.color);

            if (this.input?.enabled) {
                this.removeInteractive();
                this.scene.time.delayedCall(10, () => {
                    this.setInteractive();
                });
            }
        }, this);
    }
}
