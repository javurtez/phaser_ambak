import { Audio, JSON, Texture } from "../Managers/AssetManager";
import AudioManager from "../Managers/AudioManager";
import { EventManager } from "../Managers/EventManager";
import JSONManager from "../Managers/JSONManager";
import { CLOUD, SaveManager } from "../Managers/SaveManager";
import GroundPrefab from "../Prefab/GroundPrefab";
import BaseSprite from "../Trebert/Base/BaseSprite";
import { TBCloud } from "../Trebert/TBCloud";
import { Constants } from "../Trebert/TBConst";
import { TBUtils } from "../Trebert/TBUtils";
import BaseScene from "./BaseScene";
import GameOverScene from "./GameOverScene";
import GameUI from "./GameUI";

export default class GameScene extends BaseScene {
    /**
     * Unique name of the scene.
     */
    public static Name = "MainGame";

    groundPrefabList: GroundPrefab[] = [];
    playerObject: BaseSprite;
    currentGroundIndex: number;
    timer: number;
    isGameOver: boolean = false;
    isMoving: boolean = false;
    startMoving: boolean = false;

    currentGroundGroupIndex: number = 0;
    divisibleBy: number;
    timerToAddDivisibleBy: number;

    public init(): void {
        super.init();
    }
    public create(): void {
        super.create();

        AudioManager.Instance.playBGM(Audio.Old_Game_Theater);
        this.scene.launch(GameUI.Name);
    }
    public update(): void {
        if (this.isGameOver) return;
        if (!this.startMoving) return;
        let rawDelta = this.game.loop.rawDelta / 1000;
        this.timer -= rawDelta;
        if (this.timer <= 0) {
            this.timer = 0;
            this.gameOver();
        }

        EventManager.UPDATE_UI.emit("TIMER", this.timer);
    }

    protected initProperty(): void {
        this.currentGroundIndex = 2;

        let gameSettings = JSONManager.Instance.getJSON(JSON.game_settings);
        this.divisibleBy = gameSettings.divisibleBy;
        this.timerToAddDivisibleBy = gameSettings.timerToAddDivisibleBy;
        this.timer = gameSettings.timer;

        this.currentGroundGroupIndex = 0;

        this.isGameOver = false;
        this.isMoving = false;
        this.startMoving = false;

        this.groundPrefabList = [];

        TBCloud.setValue("SCORE", 0);

        this.time.delayedCall(10, () => {
            EventManager.UPDATE_UI.emit("TIMER", this.timer);
        });
    }
    protected initGraphics(): void {
        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor(Constants.BackgroundHex);

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.groundPrefabList.push(new GroundPrefab(this, centerX, centerY + 200, 0));
        this.groundPrefabList.push(new GroundPrefab(this, centerX, centerY, 1));
        this.groundPrefabList.push(new GroundPrefab(this, centerX, centerY - 200, 2));
        this.groundPrefabList.push(new GroundPrefab(this, centerX, centerY - 400, 3));
        this.groundPrefabList.push(new GroundPrefab(this, centerX, centerY - 600, 4));

        this.groundPrefabList[0].initGround();
        this.groundPrefabList[0].setNextGround(this.groundPrefabList[1], this.groundPrefabList[4]);
        this.groundPrefabList[1].setNextGround(this.groundPrefabList[2], this.groundPrefabList[0]);
        this.groundPrefabList[2].setNextGround(this.groundPrefabList[3], this.groundPrefabList[1]);
        this.groundPrefabList[3].setNextGround(this.groundPrefabList[4], this.groundPrefabList[2]);
        this.groundPrefabList[4].setNextGround(this.groundPrefabList[0], this.groundPrefabList[3], false);

        this.playerObject = new BaseSprite(this, centerX, centerY + 140, Texture.player).setOrigin(.5);
    }
    protected initListeners(): void {
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).on(Phaser.Input.Keyboard.Events.DOWN, () => this.playerMove("left"), this);
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).on(Phaser.Input.Keyboard.Events.DOWN, () => this.playerMove("right"), this);

        this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer) => {
            var touchX = pointer.x;

            if (touchX < TBUtils.config.world.centerX) {
                this.playerMove("left");
            }
            else if (touchX > TBUtils.config.world.centerX) {
                this.playerMove("right");
            }
        }, this);
    }

    private playerMove(dir: string): void {
        if (this.isGameOver) return;
        if (this.isMoving) return;
        if (this.currentGroundIndex == 0 && dir == "left") return;
        if (this.currentGroundIndex == 4 && dir == "right") return;

        AudioManager.Instance.playSFX(Audio.jump, .3);

        this.isMoving = true;
        this.startMoving = true;
        this.groundPrefabList.forEach((groundPrefab) => {
            groundPrefab.moveGroundDown();
        });
        this.tweens.add({
            targets: this.playerObject,
            x: this.playerObject.x + (dir == "left" ? -150 : 150),
            duration: 150,
            ease: "Linear",
            onComplete: () => {
                this.currentGroundIndex += dir == "left" ? -1 : 1;
                this.currentGroundGroupIndex++;
                this.isMoving = false;
                if (this.groundPrefabList[this.currentGroundGroupIndex % this.groundPrefabList.length].isGrounded(this.currentGroundIndex)) {
                    console.log("Grounded");

                    TBCloud.modifyValue("SCORE", 1);
                    let score = TBCloud.getValue("SCORE");
                    if (score % this.divisibleBy == 0) {
                        this.timer += this.timerToAddDivisibleBy;
                    }
                    EventManager.UPDATE_UI.emit("SCORE", score);
                }
                else {
                    console.log("Not Grounded");
                    this.gameOver();
                }
            }
        });
    }
    private gameOver(): void {
        this.isGameOver = true;
        this.tweens.add({
            targets: this.playerObject,
            y: this.playerObject.y + 1000,
            duration: 2150,
            ease: "Linear"
        });

        AudioManager.Instance.pauseBGM();
        AudioManager.Instance.playSFX(Audio.gameover, .4);

        this.time.delayedCall(100, () => {
            var localHighScore = TBCloud.getValue(CLOUD.HIGHSCORE);
            let currentScore = TBCloud.getValue("SCORE");
            if (localHighScore < currentScore) {
                localHighScore = currentScore;
                TBCloud.setValue(CLOUD.HIGHSCORE, localHighScore);
                SaveManager.Instance.saveData();
            }

            this.scene.stop(GameUI.Name);
            this.scene.launch(GameOverScene.Name);
        });
    }

    protected rescale(): void {
        super.rescale();
    }
    protected destroy(): void {
        this.scene.stop(GameUI.Name);

        super.destroy();

        EventManager.ON_PAUSE.clear();
        EventManager.ON_UNPAUSE.clear();

        EventManager.CHANGE_LANGUAGE.clear();
    }
}
