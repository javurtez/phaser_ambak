import Constants from "../../Constants";
import GameScene from "../Scene/GameScene";
import BasePanel from "./BasePanel";

export default class GameOverPanel extends BasePanel {

    scoreContainer: Phaser.GameObjects.Container;
    scoreTxt: Phaser.GameObjects.Text;
    highScoreTxt: Phaser.GameObjects.Text;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        var bg = scene.add.sprite(0, 0, "panel").setOrigin(.5).setScale(17).setAlpha(.2);
        var panel = scene.add.sprite(0, 0, "panel").setOrigin(.5).setScale(1.7);
        var retryBtn = scene.add.sprite(0, 100, "button").setOrigin(.5).setScale(1.2);
        var retryTxt = scene.add.text(retryBtn.x, retryBtn.y, "Retry", {
            fontFamily: "kenney_pixel",
            align: "center",
            color: Constants.FontColor
        }).setOrigin(.5).setScale(1.5).setFontSize(30);

        var scoreNameTxt = scene.add.text(-120, -80, "Score: ", {
            fontFamily: "kenney_pixel",
            color: Constants.FontColor
        }).setOrigin(0, .5).setFontSize(40);
        var highScoreNameTxt = scene.add.text(-120, 0, "High Score: ", {
            fontFamily: "kenney_pixel",
            color: Constants.FontColor
        }).setOrigin(0, .5).setFontSize(40);

        this.scoreTxt = scene.add.text(60, -80, "1", {
            fontFamily: "kenney_pixel",
            color: Constants.FontColor
        }).setOrigin(0, .5).setFontSize(33).setFontStyle("bold");
        this.highScoreTxt = scene.add.text(60, 0, "1", {
            fontFamily: "kenney_pixel",
            color: Constants.FontColor
        }).setOrigin(0, .5).setFontSize(33).setFontStyle("bold");

        this.scoreContainer = new Phaser.GameObjects.Container(scene, 0, 0, [panel, retryBtn, retryTxt, scoreNameTxt, highScoreNameTxt, this.scoreTxt, this.highScoreTxt]);

        this.add([bg, this.scoreContainer]);

        retryBtn.setInteractive().on('pointerdown', () => {
            (this.scene as GameScene).ResetLevel();
        }, this);

        super.Close();

        scene.add.existing(this);
    }

    public Open(): void {
        this.scoreContainer.scale = 0;
        super.Open();
        this.scene.tweens.add({
            targets: this.scoreContainer,
            scale: {
                from: 0,
                to: 1
            },
            duration: 200,
            onComplete: () => {
            }
        });
    }
    public Close(): void {
        super.Open();
        this.scene.tweens.add({
            targets: this.scoreContainer,
            scale: {
                from: 1,
                to: 0
            },
            duration: 200,
            onComplete: () => {
                super.Close();
            }
        });
    }

    public SetScore(score: number, highScore: number, isHighScore: boolean = false): void {
        this.scoreTxt.setText(score + "");
        this.highScoreTxt.setText(highScore + "");
        this.highScoreTxt.setColor(isHighScore ? "#FF0000" : Constants.FontColor)
    }
}