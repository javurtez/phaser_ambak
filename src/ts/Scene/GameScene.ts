import Constants from "../../Constants";
import Utilities from "../../Utilities";
import AudioManager from "../Managers/AudioManager";
import GroundPrefab from "../Prefab/GroundPrefab";
import GameOverPanel from "../UI/GameOverPanel";
import ScorePanel from "../UI/ScorePanel";

const maxTimer = 20;
export default class GameScene extends Phaser.Scene {
    /**
     * Unique name of the scene.
     */
    public static Name = "MainGame";

    groundPrefabList: GroundPrefab[] = [];
    playerObject: Phaser.GameObjects.Sprite;

    currentGroundGroupIndex: number = 0;
    currentGroundIndex: number = 0;
    isGameOver: boolean = false;
    isMoving: boolean = false;
    startMoving: boolean = false;

    gameOverPanel: GameOverPanel;
    scorePanel: ScorePanel;

    score: number;
    timer: number = maxTimer;

    public create(): void {
        Utilities.LogSceneMethodEntry("MainGame", "create");

        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor(Constants.BackgroundHex);

        AudioManager.Instance.PlayBGM(this, "gameplaybgm");

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.groundPrefabList.push(new GroundPrefab(this, centerX, centerY + 200, 0));
        this.groundPrefabList.push(new GroundPrefab(this, centerX, centerY, 1));
        this.groundPrefabList.push(new GroundPrefab(this, centerX, centerY - 200, 2));
        this.groundPrefabList.push(new GroundPrefab(this, centerX, centerY - 400, 3));
        this.groundPrefabList.push(new GroundPrefab(this, centerX, centerY - 600, 4));

        this.groundPrefabList[0].InitGround();
        this.groundPrefabList[0].SetNextGround(this.groundPrefabList[1], this.groundPrefabList[4]);
        this.groundPrefabList[1].SetNextGround(this.groundPrefabList[2], this.groundPrefabList[0]);
        this.groundPrefabList[2].SetNextGround(this.groundPrefabList[3], this.groundPrefabList[1]);
        this.groundPrefabList[3].SetNextGround(this.groundPrefabList[4], this.groundPrefabList[2]);
        this.groundPrefabList[4].SetNextGround(this.groundPrefabList[0], this.groundPrefabList[3], false);

        this.playerObject = this.add.sprite(centerX, centerY + 140, "player").setOrigin(.5);

        this.currentGroundIndex = 2;
        this.score = 0;
        this.timer = maxTimer;

        this.input.keyboard.addKey("A").on('down', () => this.PlayerMove("left"), this);
        this.input.keyboard.addKey("D").on('down', () => this.PlayerMove("right"), this);

        this.gameOverPanel = new GameOverPanel(this, centerX, centerY);
        this.scorePanel = new ScorePanel(this, centerX, 20);

        this.scorePanel.SetTimer(this.timer);
        this.scorePanel.SetScore(this.score);
    }

    public update(): void {
        if (this.isGameOver) return;
        if (!this.startMoving) return;
        this.timer -= .02;
        if (this.timer <= 0) {
            this.GameOver();
            this.timer = 0;
        }
        this.scorePanel.SetTimer(this.timer);
    }

    public ResetLevel(): void {
        const centerY = this.cameras.main.centerY;
        const centerX = this.cameras.main.centerX;

        this.groundPrefabList[0].y = centerY + 200;
        this.groundPrefabList[1].y = centerY;
        this.groundPrefabList[2].y = centerY - 200;
        this.groundPrefabList[3].y = centerY - 400;
        this.groundPrefabList[4].y = centerY - 600;

        this.groundPrefabList[0].InitGround();
        this.groundPrefabList[0].SetNextGround(this.groundPrefabList[1], this.groundPrefabList[4]);
        this.groundPrefabList[1].SetNextGround(this.groundPrefabList[2], this.groundPrefabList[0]);
        this.groundPrefabList[2].SetNextGround(this.groundPrefabList[3], this.groundPrefabList[1]);
        this.groundPrefabList[3].SetNextGround(this.groundPrefabList[4], this.groundPrefabList[2]);
        this.groundPrefabList[4].SetNextGround(this.groundPrefabList[0], this.groundPrefabList[3], false);

        this.playerObject.x = centerX;
        this.playerObject.y = centerY + 140;

        this.isGameOver = false;
        this.isMoving = false;

        this.gameOverPanel.Close();

        this.currentGroundGroupIndex = 0;
        this.currentGroundIndex = 2;

        this.score = 0;
        this.timer = maxTimer;
        this.startMoving = false;

        this.scorePanel.SetTimer(this.timer);
        this.scorePanel.SetScore(this.score);
        
        AudioManager.Instance.PlayBGM(this, "gameplaybgm");

        this.tweens.pauseAll();
    }

    private PlayerMove(dir: string): void {
        if (this.isGameOver) return;
        if (this.isMoving) return;
        if (this.currentGroundIndex == 0 && dir == "left") return;
        if (this.currentGroundIndex == 4 && dir == "right") return;

        AudioManager.Instance.PlaySFXOneShot(this, "jump", .2);

        this.isMoving = true;
        this.startMoving = true;
        this.groundPrefabList.forEach((groundPrefab) => {
            groundPrefab.MoveDown();
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
                if (this.groundPrefabList[this.currentGroundGroupIndex % this.groundPrefabList.length].IsGrounded(this.currentGroundIndex)) {
                    Utilities.Log("Grounded");

                    this.score++;
                    this.timer += .4;
                    this.scorePanel.SetScore(this.score);
                }
                else {
                    Utilities.Log("Not Grounded");

                    this.GameOver();
                }
            }
        });
    }

    private GameOver(): void {
        this.isGameOver = true;
        this.tweens.add({
            targets: this.playerObject,
            y: this.playerObject.y + 1000,
            duration: 2150,
            ease: "Linear"
        });

        AudioManager.Instance.PauseBGM(this, "gameplaybgm");
        AudioManager.Instance.PlaySFXOneShot(this, "gameover", .4);

        this.time.delayedCall(100, () => {
            var isHighScore = false;
            var localHighScore = parseInt(localStorage.getItem(Constants.ScoreKey)) || 0;
            if (localHighScore < this.score) {
                localHighScore = this.score;
                localStorage.setItem(Constants.ScoreKey, localHighScore.toString());
                isHighScore = true;
            }
            this.gameOverPanel.Open();
            this.gameOverPanel.SetScore(this.score, localHighScore, isHighScore);
        });
    }
}