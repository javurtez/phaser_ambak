export default class BaseBitmapText extends Phaser.GameObjects.BitmapText {
    constructor(scene: Phaser.Scene, x: number, y: number, config: any) {
        super(scene, x, y, config.font.path, config.text, config.size, config.align);

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

    public open(): void {
        this.setActive(true);
        this.setVisible(true);
    }
    public close(): void {
        this.setActive(false);
        this.setVisible(false);
    }
}
