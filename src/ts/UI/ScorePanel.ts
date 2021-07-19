import BasePanel from "./BasePanel";

export default class ScorePanel extends BasePanel {

    scoreTxt: Phaser.GameObjects.Text;
    timerTxt: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this.scoreTxt = scene.add.text(-350, 0, "0", {
            fontFamily: "kenney_pixel"
        }).setOrigin(.5).setFontSize(36).setFontStyle("bold");
        this.timerTxt = scene.add.text(0, 0, "10.0", {
            fontFamily: "kenney_pixel"
        }).setOrigin(.5).setFontSize(44).setFontStyle("bold");

        this.add([this.scoreTxt, this.timerTxt]);

        scene.add.existing(this);
    }

    public SetScore(score: number): void {
        this.scoreTxt.setText(score + "");
    }
    public SetTimer(time: number): void {
        this.timerTxt.setText(time.toFixed(1) + "");
    }
}