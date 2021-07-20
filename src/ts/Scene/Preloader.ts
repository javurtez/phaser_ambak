import Constants from "../../Constants";
import Utilities from "../../Utilities";
import AudioManager from "../Managers/AudioManager";
import MenuScene from "./MenuScene";

import mainmenubgm from '../../assets/Audio/goofy_mischief.mp3';
import gameplaybgm from '../../assets/Audio/insane_gameplay.mp3';
import gameover from '../../assets/Audio/gameover.mp3';
import jump from '../../assets/Audio/jump.wav';

import game_title from '../../assets/UI/Title.png';
import button from '../../assets/UI/Button.png';
import panel from '../../assets/UI/Panel.png';

import player from '../../assets/Player.png';
import cloud from '../../assets/Cloud_1.png';
import ground from '../../assets/PGround.png';
import null_ground from '../../assets/PNull.png';

export default class Preloader extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name = "Preloader";

	public preload(): void {
		this.addProgressBar();

		this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor(Constants.BackgroundHex);

		// this.load.path = "src/assets/";

		this.load.image("game_title", game_title);
		this.load.image("button", button);
		this.load.image("panel", panel);

		this.load.image("player", player);
		this.load.image("cloud", cloud);
		this.load.image("ground", ground);
		this.load.image("null_ground", null_ground);

		this.load.audio("gameover", gameover);
		this.load.audio("jump", jump);

		this.load.audio("mainmenubgm", mainmenubgm);
		this.load.audio("gameplaybgm", gameplaybgm);
	}

	public create(): void {
		Utilities.LogSceneMethodEntry("Preloader", "create");

		AudioManager.Init();

		this.scene.start(MenuScene.Name);
	}

	/**
	 * Adds a progress bar to the display, showing the percentage of assets loaded and their name.
	 */
	private addProgressBar(): void {
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;
		/** Customizable. This text color will be used around the progress bar. */
		const outerTextColor = '#ffffff';

		const progressBar = this.add.graphics();
		const progressBox = this.add.graphics();
		progressBox.fillStyle(0x222222, 0.8);
		progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);

		const loadingText = this.make.text({
			x: width / 2,
			y: height / 2 - 50,
			//text: "Loading...",
			style: {
				font: "20px monospace",
				color: outerTextColor
			}
		});
		loadingText.setOrigin(0.5, 0.5);

		const percentText = this.make.text({
			x: width / 2,
			y: height / 2 - 5,
			text: "0%",
			style: {
				color: "#ffffff"
			}
		}).setFontFamily("kenney_pixel");
		percentText.setOrigin(0.5, 0.5);

		const assetText = this.make.text({
			x: width / 2,
			y: height / 2 + 50,
			text: "",
			style: {
				color: outerTextColor
			}
		}).setFontFamily("kenney_pixel");

		assetText.setOrigin(0.5, 0.5);

		this.load.on("progress", (value: number) => {
			percentText.setText(parseInt(value * 100 + "", 10) + "%");
			progressBar.clear();
			progressBar.fillStyle(0xffffff, 1);
			progressBar.fillRect((width / 4) + 10, (height / 2) - 30 + 10, (width / 2 - 10 - 10) * value, 30);
		});

		this.load.on("fileprogress", (file: Phaser.Loader.File) => {
			assetText.setText("Loading asset: " + file.key);
		});

		this.load.on("complete", () => {
			progressBar.destroy();
			progressBox.destroy();
			loadingText.destroy();
			percentText.destroy();
			assetText.destroy();
		});
	}
}