import LayerManager from "../Managers/LayerManager";
import { LAYER_KEYS } from "../Trebert/TBConst";

export default class BaseScene extends Phaser.Scene {

    private layerManager: LayerManager;

    get layer() {
        return this.layerManager;
    }

    public init(): void {
        this.initProperty();
        this.initListeners();

        this.layerManager = new LayerManager(this);
        this.layerManager.addLayer(LAYER_KEYS.LAYER_BACKGROUND);
        this.layerManager.addLayer(LAYER_KEYS.LAYER_FOREGROUND, true);
        this.layerManager.addLayer(LAYER_KEYS.LAYER_PLAYER);
        this.layerManager.addLayer(LAYER_KEYS.LAYER_UI);
    }

    public preload(): void {

    }

    public create(): void {
        this.initGraphics();
    }

    protected initProperty(): void {

    }
    protected initGraphics(): void {

    }
    protected initListeners(): void {
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.destroy, this);
        this.scale.on(Phaser.Scale.Events.RESIZE, this.rescale, this);
    }

    public inTransition(duration: number = 350) {
        this.cameras.main.fadeIn(duration);
    }

    public outTransition(duration: number = 350) {
        this.cameras.main.fadeOut(duration);
        return duration;
    }

    protected rescale(): void {

    }
    protected destroy(): void {
        this.scale.off(Phaser.Scale.Events.RESIZE, this.rescale, this);

        this.layerManager?.destroy();
        this.layerManager = undefined;
    }
}
