import { TBCloud } from "../Trebert/TBCloud";
import { CLOUD } from "./SaveManager";

export default class AudioManager {
    private static audioManagerSingleton: AudioManager;

    private sceneSoundManager: Phaser.Sound.BaseSoundManager;

    private currentBGMAudio: Phaser.Sound.BaseSound;

    private isMute: boolean;

    private bgmVolume: number = .5;
    private sfxVolume: number = .5;

    public static init(scene: Phaser.Scene, config: any): void {
        if (!AudioManager.audioManagerSingleton) {
            this.audioManagerSingleton = new AudioManager();

            this.audioManagerSingleton.isMute = TBCloud.getValue(CLOUD.IS_MUTED);
            this.audioManagerSingleton.bgmVolume = config.bgmVolume;
            this.audioManagerSingleton.sfxVolume = config.sfxVolume;

            this.audioManagerSingleton.setMute(this.audioManagerSingleton.isMute);

            this.audioManagerSingleton.sceneSoundManager = scene.sound;
        }
        else {
            throw new Error('You can only initialize one manager instance');
        }
    }

    static get Instance() {
        if (!AudioManager.audioManagerSingleton) {
            throw new Error('initialize Instantiator First!');
        }

        return AudioManager.audioManagerSingleton;
    }

    get IsMuted() {
        return this.isMute;
    }

    public setBGMVolume(vol: number): void {
        this.bgmVolume = vol;
    }
    public setSFXVolume(vol: number): void {
        this.sfxVolume = vol;
    }

    public setMute(isMute: boolean, isSave: boolean = true): void {
        this.isMute = isMute;

        if (this.isMute) {
            this.currentBGMAudio?.pause();
        }
        else if (this.isBGMPause()) {
            this.currentBGMAudio?.resume();
        }

        if (isSave == false) return;
        TBCloud.setValue(CLOUD.IS_MUTED, this.isMute);
    }
    public playSFX(key: any, volumeSfx: number = -1, completeFunc: Function = undefined, context: any = undefined): void {
        let sfx: Phaser.Sound.BaseSound = this.sceneSoundManager.get(key.path);

        if (!sfx) {
            sfx = this.sceneSoundManager.add(key.path, {
                volume: volumeSfx == -1 ? this.sfxVolume : volumeSfx,
                loop: false
            });
        }

        let sfxContext = context == undefined ? this.sceneSoundManager : context;

        if (!this.isMute) {
            sfx.play();

            if (completeFunc != undefined) {
                sfx.on("complete", completeFunc, sfxContext);
            }
        }
        else {
            if (completeFunc != undefined) {
                setTimeout(function () { completeFunc.call(sfxContext); }, sfx.duration * 1000);
            }
        }
    }
    public stopSFX(key: any) {
        let sound = this.sceneSoundManager.get(key.path);
        if (sound != undefined) {
            this.sceneSoundManager.stopByKey(key.path);
        }
    }

    public isBGMPause(): boolean {
        if (!this.currentBGMAudio) return false;
        return this.currentBGMAudio.isPaused;
    }
    public playBGM(key: any, volume: number = -1, replayIfSame: boolean = false): void {
        let bgm: Phaser.Sound.BaseSound = this.sceneSoundManager.get(key.path);

        if (replayIfSame && bgm != undefined) {
            bgm.pause();
        }

        if (volume != -1) {
            this.setBGMVolume(volume);
        }
        if (!bgm || replayIfSame == true) {
            bgm = this.sceneSoundManager.add(key.path, {
                loop: true,
                volume: volume == -1 ? this.bgmVolume : volume
            });
            if (replayIfSame == false) {
                this.currentBGMAudio?.stop();
            }
            this.currentBGMAudio = bgm;
            bgm.play();
        }
        else {
            if (this.currentBGMAudio != bgm) {
                this.currentBGMAudio.pause();
                bgm.play();
                this.currentBGMAudio = bgm;
            }
        }

        if (this.isMute) {
            bgm.pause();
        }
        else if (this.isBGMPause() && this.isMute == false) {
            bgm.resume();
        }
    }
    public pauseBGM(): void {
        if (!this.currentBGMAudio) return;
        this.currentBGMAudio.pause();
    }
}
