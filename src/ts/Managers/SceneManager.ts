export default class SceneManager {
    private static sceneManagerSingleton: SceneManager;

    public static init(): void {
        if (!SceneManager.sceneManagerSingleton) {
            this.sceneManagerSingleton = new SceneManager();
        }
        else {
            throw new Error('You can only initialize one manager instance');
        }
    }

    static get Instance() {
        if (!SceneManager.sceneManagerSingleton) {
            throw new Error('initialize Instantiator First!');
        }

        return SceneManager.sceneManagerSingleton;
    }

    fadeOutIn(currentScene: Phaser.Scene, callback: Function, duration: number = 250) {
        currentScene.cameras.main.fadeOut(duration);
        currentScene.time.addEvent({
            delay: 250,
            callback: function () {
                currentScene.cameras.main.fadeIn(duration);
                callback(currentScene);
            },
            callbackScope: currentScene
        });
    }
    fadeOutSceneTo(currentScene: Phaser.Scene, newSceneName: string, duration: number = 250) {
        currentScene.cameras.main.fadeOut(duration);
        currentScene.time.addEvent({
            delay: 250,
            callback: function () {
                currentScene.scene.start(newSceneName);
            },
            callbackScope: currentScene
        });
    }

    transitionToScene(currentScene: Phaser.Scene, newSceneName: string) {
        var tDuration = 0;

        if (typeof currentScene["outTransition"] != 'function') {
            console.warn("[SceneManager] (transitionToScene) Out-going scene '" + currentScene.scene.key + "' missing function 'outTransition'");
        }
        else {
            tDuration = currentScene["outTransition"](); //get duration and run outgoing transition

            if (!Number.isFinite(tDuration)) {
                console.warn("[SceneManager] (transitionToScene) Duration returned from outgoing scene '" + currentScene.scene.key + "' transition is not a number. Changing to: 0 seconds");
                tDuration = 0;
            }
        }

        //on delay provided by transition out
        currentScene.time.addEvent({
            delay: tDuration,
            callback: function () {
                var newScene = currentScene.scene.start(newSceneName).get(newSceneName);

                //verify new scene has the proper transition method
                newScene.events.once('create', function () {
                    if (typeof newScene["inTransition"] != 'function') {
                        console.warn("[SceneManager] (transitionToScene) new scene '" + newScene.scene.key + "' missing function 'inTransition'");
                    }
                    else {
                        //run incoming transition
                        newScene["inTransition"]();
                    }
                }, newScene);
            },
            callbackScope: currentScene
        });
    }
}
