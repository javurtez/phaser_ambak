export default class BaseSprite extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, config: any) {
        super(scene, x, y, 
            config.texture != undefined ? config.texture.path : config.path, 
            config.texture != undefined ? config.texture.frame : config.frame);
        
        if (config.pixelize == true) {
            this.texture.setFilter(Phaser.Textures.NEAREST);
        }
        scene.add.existing(this);

        this.initProperty(config);
        this.initListeners();
        this.initGraphics();
    }

    protected initProperty(config: any): void {

    }
    protected initListeners(): void {

    }
    protected initGraphics(): void {

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
