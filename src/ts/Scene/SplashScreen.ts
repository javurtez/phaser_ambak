import BaseScene from "./BaseScene";
import Preloader from "./Preloader";

export default class SplashScreen extends BaseScene {
    /**
     * Unique name of the scene.
     */
    public static Name = "SplashScreen";

    public init(): void {
        super.init();
    }
    public create(): void {
        super.create();

        this.nextScene();
    }

    nextScene(): void {
        this.scene.start(Preloader.Name);
    }

    protected rescale(): void {
        super.rescale();
    }
    protected destroy(): void {
        super.destroy();
    }
}
