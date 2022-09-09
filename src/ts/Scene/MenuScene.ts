import AnimationManager from "../Managers/AnimationManager";
import { Audio, Font, Texture } from "../Managers/AssetManager";
import { TBAsset } from "../Trebert/TBAsset";
import { TBUtils } from "../Trebert/TBUtils";
import BaseBitmapText from "../Trebert/Base/BaseBitmapText";
import BaseScene from "./BaseScene";
import GameScene from "./GameScene";
import SceneManager from "../Managers/SceneManager";
import BaseSprite from "../Trebert/Base/BaseSprite";
import BaseImage from "../Trebert/Base/BaseImage";
import SlotWithText from "../Trebert/UI/SlotWithText";
import AudioManager from "../Managers/AudioManager";

export default class MenuScene extends BaseScene {
    /**
     * Unique name of the scene.
     */
    public static Name = "MainMenu";

    cloudList: BaseSprite[] = [];
    cloudSpeed: number[] = [];
    menuGroup: Phaser.GameObjects.Group;

    public init(): void {
        super.init();
        
        AudioManager.Instance.playBGM(Audio.bgm);
    }
    public update(): void {
        var index = 0;
        this.cloudList.forEach((cloud) => {
            cloud.x += this.cloudSpeed[index];

            if (cloud.x >= 1000) {
                cloud.x = -300;
            }
            index++;
        });
    }

    protected initProperty(): void {
        this.cloudList = [];
    }
    protected initGraphics(): void {
        const centerX = TBUtils.config.world.centerX;
        const centerY = TBUtils.config.world.centerY;

        this.menuGroup = this.add.group();

        let title = new BaseImage(this, centerX, 100, Texture.title)
        title.setOrigin(.5);
        title.setDepth(1);
        this.menuGroup.add(title);

        let play = new SlotWithText(this, centerX, centerY + 30, { texture: Texture.button, font: Font.kenney_pixel, size: 75, align: 1, text: "PLAY", color: 0x000000 });
        play.pointerUp = this.onPlay.bind(this);
        play.setDepth(1);
        this.menuGroup.add(play);

        let playerImg = new BaseImage(this, centerX, centerY + 212, Texture.player);
        playerImg.setOrigin(0.5);

        let startX = centerX - (TBUtils.config.world.width / 2);
        let limit = TBUtils.config.world.width / 64;
        limit = Math.ceil(limit);
        for (var i = 0; i <= limit; i++) {
            if ((i >= 2 && i <= 4) || i == 12) {
                new BaseImage(this, startX + (i * 64), centerY + 270, Texture.no_ground).setOrigin(.5);
            }
            else {
                new BaseImage(this, startX + (i * 64), centerY + 270, Texture.ground).setOrigin(.5);
            }
        }

        this.cloudList.push(new BaseSprite(this, -100, centerY - 100, Texture.cloud_1).setOrigin(.5).setScale(3, 1.5));
        this.cloudList.push(new BaseSprite(this, centerX, centerY - 250, Texture.cloud_1).setOrigin(.5).setScale(4.4, 2));
        this.cloudList.push(new BaseSprite(this, -600, centerY, Texture.cloud_1).setOrigin(.5).setScale(4.4, 2));
        this.cloudSpeed.push(.4);
        this.cloudSpeed.push(.2);
        this.cloudSpeed.push(.2);
    }

    protected onPlay(): void {
        this.menuGroup.setVisible(false);

        let progressText = new BaseBitmapText(this, TBUtils.config.world.centerX, TBUtils.config.world.centerY, { font: Font.kenney_pixel, align: 1 });
        progressText.setFontSize(55);
        progressText.setOrigin(0.5);
        TBAsset.loadAssets(this, false, true,
            () => {
                AnimationManager.init(this);
                SceneManager.Instance.transitionToScene(this, GameScene.Name);
            },
            (value: number) => {
                let percent = Phaser.Math.RoundTo(value * 100, 0).toString();
                progressText.setText(`LOADING...\n${percent}%`);
            });
    }

    protected rescale(): void {
        super.rescale();
    }
    protected destroy(): void {
        super.destroy();
    }
}
