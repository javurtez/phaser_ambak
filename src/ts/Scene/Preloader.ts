import { Font, Texture } from "../Managers/AssetManager";
import SceneManager from "../Managers/SceneManager";
import { TBAsset } from "../Trebert/TBAsset";
import { TBUtils } from "../Trebert/TBUtils";
import SlotWithText from "../Trebert/UI/SlotWithText";
import BaseScene from "./BaseScene";
import MenuScene from "./MenuScene";

export default class Preloader extends BaseScene {
    /**
     * Unique name of the scene.
     */
    public static Name = "Preloader";

    public preload(): void {
        TBAsset.loadAssets(this, true, false);
    }
    public create(): void {
        const centerX = TBUtils.config.world.centerX;
        const centerY = TBUtils.config.world.centerY;

        let continueBtn = new SlotWithText(this, centerX, centerY + 30, { texture: Texture.button, font: Font.kenney_pixel, size: 75, align: 1, text: "CONTINUE", color: 0x000000 });
        continueBtn.pointerUp = this.nextScene.bind(this);
    }

    private nextScene() {
        SceneManager.Instance.transitionToScene(this, MenuScene.Name);
    }

    protected rescale(): void {
        super.rescale();
    }
    protected destroy(): void {
        super.destroy();
    }
}
