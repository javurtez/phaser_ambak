import 'phaser';
declare var __PKG_NAME__: string;
declare var __PKG_VERSION__: string;

import MenuScene from './Scene/MenuScene';
import Preloader from './Scene/Preloader';
import GameScene from './Scene/GameScene';
import SplashScreen from './Scene/SplashScreen';
import BootScene from './Scene/BootScene';
import GameUI from './Scene/GameUI';
import { Constants } from './Trebert/TBConst';
import { TBUtils } from './Trebert/TBUtils';
import GameOverScene from './Scene/GameOverScene';

const GameConfig: Phaser.Types.Core.GameConfig = {
    scale: {
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1212,
        height: 560,
        parent: 'content',
    },
    backgroundColor: Constants.BackgroundHex,
    type: Phaser.AUTO,
    input: {
        keyboard: true
    },
    render: {
        pixelArt: true
    },
	title: __PKG_NAME__,
    version: __PKG_VERSION__
};


export default class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);

        this.scene.add(BootScene.Name, BootScene);
        this.scene.add(Preloader.Name, Preloader);
        this.scene.add(SplashScreen.Name, SplashScreen);
        this.scene.add(MenuScene.Name, MenuScene);
        this.scene.add(GameScene.Name, GameScene);
        this.scene.add(GameUI.Name, GameUI);
        this.scene.add(GameOverScene.Name, GameOverScene);

        this.scene.start(BootScene.Name);
    }
}

var game = new Game(GameConfig);
TBUtils.config.game = game;
