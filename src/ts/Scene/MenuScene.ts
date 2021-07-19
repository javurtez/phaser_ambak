import Constants from "../../Constants";
import Utilities from "../../Utilities";
import AudioManager from "../Managers/AudioManager";
import GameScene from "./GameScene";

export default class MenuScene extends Phaser.Scene {
    /**
     * Unique name of the scene.
     */
    public static Name = "MainMenu";

    cloudList: Phaser.GameObjects.Sprite[] = [];
    cloudSpeed: number[] = [];

    public create(): void {
        Utilities.LogSceneMethodEntry("MainMenu", "create");

        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor(Constants.BackgroundHex);

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        //this.scene.start(GameScene.Name);
        
        AudioManager.Instance.PlayBGM(this, "mainmenubgm");

        this.add.sprite(centerX, 100, "game_title").setOrigin(.5).setScale(9).setDepth(1);

        this.add.sprite(centerX, centerY, "button").setOrigin(.5).setScale(2).setInteractive().setDepth(1).
            on("pointerdown", this.OnStart, this);
        this.add.text(centerX, centerY, "Play", {
            fontFamily: "kenney_pixel",
            align: "center",
            color: Constants.FontColor
        }).setOrigin(.5).setFontSize(75).setDepth(1);

        this.add.sprite(155, centerY + 212, "player").setOrigin(.5).setScale(1.1);
        for (var i = 0; i <= 12; i++) {
            if (i == 0 || (i >= 6 && i <= 8) || i == 12) {
                this.add.sprite(i * 64, centerY + 270, "null_ground").setOrigin(.5);
            }
            else {
                this.add.sprite(i * 64, centerY + 270, "ground").setOrigin(.5);
            }
        }

        this.cloudList.push(this.add.sprite(-100, centerY - 100, "cloud").setOrigin(.5).setScale(3, 1.5));
        this.cloudList.push(this.add.sprite(centerX, centerY - 250, "cloud").setOrigin(.5).setScale(4.4, 2));
        this.cloudList.push(this.add.sprite(-600, centerY, "cloud").setOrigin(.5).setScale(4.4, 2));
        this.cloudSpeed.push(.4);
        this.cloudSpeed.push(.2);
        this.cloudSpeed.push(.2);
    }

    public update(): void {
        var index = 0;
        this.cloudList.forEach((cloud) => {
            cloud.x += this.cloudSpeed[index];

            if (cloud.x >= 1000) {
                cloud.x = -300;
            }
            index++;
        })
    }

    private OnStart(): void {
        AudioManager.Instance.PauseBGM(this, "mainmenubgm");
        this.scene.start(GameScene.Name);
    }
}