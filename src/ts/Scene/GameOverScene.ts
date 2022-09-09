import { Font, Texture } from "../Managers/AssetManager";
import BaseBitmapText from "../Trebert/Base/BaseBitmapText";
import BaseImage from "../Trebert/Base/BaseImage";
import { TBCloud } from "../Trebert/TBCloud";
import { TBUtils } from "../Trebert/TBUtils";
import SlotWithText from "../Trebert/UI/SlotWithText";
import BaseScene from "./BaseScene";
import GameScene from "./GameScene";

export default class GameOverScene extends BaseScene {
    /**
     * Unique name of the scene.
     */
    public static Name = "GameOverScene";

    protected initGraphics(): void {
        let container = new BaseImage(this, TBUtils.config.world.centerX, TBUtils.config.world.centerY, Texture.panel);
        container.setOrigin(0.5);
        container.setScale(2);

        let scoreNameTxt = new BaseBitmapText(this, TBUtils.config.world.centerX, TBUtils.config.world.centerY - 150, { font: Font.kenney_pixel, size: 80, align: 1 });
        scoreNameTxt.setOrigin(0.5);
        scoreNameTxt.setText("SCORE");
        scoreNameTxt.setTint(0x000000);
        let scoreTxt = new BaseBitmapText(this, scoreNameTxt.x, scoreNameTxt.y + 50, { font: Font.kenney_pixel, size: 100, align: 1 });
        scoreTxt.setOrigin(0.5);
        scoreTxt.setText(TBCloud.getValue("SCORE"));
        scoreTxt.setTint(0x000000);

        let highscoreNameTxt = new BaseBitmapText(this, TBUtils.config.world.centerX, TBUtils.config.world.centerY - 20, { font: Font.kenney_pixel, size: 80, align: 1 });
        highscoreNameTxt.setOrigin(0.5);
        highscoreNameTxt.setText("HIGHSCORE");
        highscoreNameTxt.setTint(0x000000);
        let highscoreTxt = new BaseBitmapText(this, highscoreNameTxt.x, highscoreNameTxt.y + 50, { font: Font.kenney_pixel, size: 100, align: 1 });
        highscoreTxt.setOrigin(0.5);
        highscoreTxt.setText(TBCloud.getValue("HIGHSCORE"));
        highscoreTxt.setTint(0x000000);

        let retryBtn = new SlotWithText(this, TBUtils.config.world.centerX, TBUtils.config.world.centerY + 130, { texture: Texture.button, font: Font.kenney_pixel, size: 75, align: 1, text: "RETRY", color: 0x000000 });
        retryBtn.pointerUp = this.onRetry.bind(this);
    }

    private onRetry(): void {
        this.scene.stop(GameScene.Name);
        this.scene.start(GameScene.Name);
    }
}
