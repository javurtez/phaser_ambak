import { Texture } from "./AssetManager";

export default class AnimationManager {
    static initialized = false;

    static init(scene: Phaser.Scene) {
        if (this.initialized) return;
        this.initialized = true;
    }
    static getFrames(prefix: string, count: number = 4) {
        let array = [];
        for (var i = 1; i <= count; i++) {
            let texture = Texture[prefix + "_" + i];
            array.push({ key: texture.path, frame: texture.frame });
        }
        return array;
    }
}
