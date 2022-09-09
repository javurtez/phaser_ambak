import { Font, Texture } from "../Managers/AssetManager";
import { TBUtils } from "../Trebert/TBUtils";
import BaseBitmapText from "../Trebert/Base/BaseBitmapText";
import BaseScene from "./BaseScene";
import { EventManager } from "../Managers/EventManager";
import BaseSlot from "../Trebert/Base/BaseSlot";
import SceneManager from "../Managers/SceneManager";
import GameScene from "./GameScene";
import MenuScene from "./MenuScene";

export default class GameUI extends BaseScene {
    /**
     * Unique name of the scene.
     */
    public static Name = "GameUI";

    scoreText: BaseBitmapText;
    timerTxt: BaseBitmapText;
    exitBtn: BaseSlot;

    protected initGraphics(): void {
        this.scoreText = new BaseBitmapText(this, -350, 40, { font: Font.kenney_pixel, size: 100, align: 1 });
        this.scoreText.setOrigin(0, 0.5);
        this.scoreText.setText("0");

        this.timerTxt = new BaseBitmapText(this, 350, 40, { font: Font.kenney_pixel, size: 100, align: 1 });
        this.timerTxt.setOrigin(1, 0.5);
        this.timerTxt.setText("20.0");

        this.exitBtn = new BaseSlot(this, 350, 500, Texture.exit);
        this.exitBtn.setOrigin(1, 0.5);
        this.exitBtn.pointerUp = () => {
            this.scene.stop();
            SceneManager.Instance.transitionToScene(this.scene.get(GameScene.Name), MenuScene.Name);
        }

        this.rescale();
    }
    protected initListeners(): void {
        super.initListeners();

        EventManager.ON_BLUR.addListener(this.onBlur, this);
        EventManager.ON_FOCUS.addListener(this.onFocus, this);

        EventManager.UPDATE_UI.addListener(this.updateUI, this);
    }

    protected updateUI(type: string, value: any) {
        switch (type) {
            case "TIMER":
                this.timerTxt.setText(value.toFixed(1) + "");
                break;
            case "SCORE":
                this.scoreText.setText(value);
                break;
        }
    }

    onBlur(): void {
        console.log("BLUR");
    }
    onFocus(): void {
        console.log("FOCUS");
    }

    protected rescale(): void {
        this.scoreText.x = TBUtils.config.world.centerX - (TBUtils.config.world.width / 2) + 50;
        this.timerTxt.x = TBUtils.config.world.centerX + (TBUtils.config.world.width / 2) - 50;

        this.exitBtn.x = TBUtils.config.world.centerX + (TBUtils.config.world.width / 2) - 50;
    }
    protected destroy(): void {
        super.destroy();

        EventManager.ON_BLUR.clear(this);
        EventManager.ON_FOCUS.clear(this);
        EventManager.UPDATE_UI.clear(this);
    }
}
