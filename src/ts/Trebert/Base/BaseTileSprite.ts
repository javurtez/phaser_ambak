export default class BaseTileSprite extends Phaser.GameObjects.TileSprite {
    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, config: any) {
        super(scene, x, y, width, height, config.texture.path, config.texture.frame);
        if (config.pixelize == true) {
            this.texture.setFilter(Phaser.Textures.NEAREST);
        }
        scene.add.existing(this);
    }

    public setImage(texture: any) {
        this.setTexture(texture.path, texture.frame);
    }

    public alive(): void {
        this.setActive(true);
        this.setVisible(true);
    }
    public dead(): void {
        this.setActive(false);
        this.setVisible(false);
    }
}
