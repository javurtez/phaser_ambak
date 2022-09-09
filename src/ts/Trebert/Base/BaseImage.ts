export default class BaseImage extends Phaser.GameObjects.Image {
    constructor(scene: Phaser.Scene, x: number, y: number, config: any) {
        super(scene, x, y, 
            config.texture != undefined ? config.texture.path : config.path, 
            config.texture != undefined ? config.texture.frame : config.frame);

        scene.add.existing(this);
    }

    public setImage(texture: any) {
        this.setTexture(texture.path, texture.frame);
    }

    public open(): void {
        this.setActive(true);
        this.setVisible(true);
    }
    public close(): void {
        this.setActive(false);
        this.setVisible(false);
    }
}
