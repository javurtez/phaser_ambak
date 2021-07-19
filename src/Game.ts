// import './style.css'

// const app = document.querySelector<HTMLDivElement>('#app')!

// app.innerHTML = `
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
//   <div id="game"></div>
// `;

import 'phaser';
import MenuScene from './ts/Scene/MenuScene';
import Preloader from './ts/Scene/Preloader';
import GameScene from './ts/Scene/GameScene';

const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Ambak',
  version: '0.0.1',
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: 'app',
  input: {
    keyboard: true
  },
  // physics: {
  //   default: 'arcade',
  //   arcade: {
  //     gravity: { y: 0 },
  //     debug: false
  //   }
  // },
  backgroundColor: '#300000',
  render: { pixelArt: true, antialias: true },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    // `fullscreenTarget` must be defined for phones to not have
    // a small margin during fullscreen.
    fullscreenTarget: 'app',
    expandParent: false,
  },
};


export default class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);

    // this.scene.add(Boot.Name, Boot);
    this.scene.add(Preloader.Name, Preloader);
    // this.scene.add(SplashScreen.Name, SplashScreen);
    this.scene.add(MenuScene.Name, MenuScene);
    this.scene.add(GameScene.Name, GameScene);
    // this.scene.add(MainSettings.Name, MainSettings);

    this.scene.start(Preloader.Name);
  }
}

window.addEventListener('load', () => {
  // Expose `_game` to allow debugging, mute button and fullscreen button
  (window as any)._game = new Game(GameConfig);
});
