import { TBCloud } from "../Trebert/TBCloud";
import { JSON } from "./AssetManager";
import { EventManager } from "./EventManager";
import JSONManager from "./JSONManager";
import { CLOUD, SaveManager } from "./SaveManager";

export default class LocalizationManager {
    private static managerSingleton: LocalizationManager;

    private currentLanguage: string;
    private languageData: any;

    public static init(): void {
        if (!this.managerSingleton) {
            this.managerSingleton = new LocalizationManager();

            let lang = TBCloud.getValue(CLOUD.LOCALIZATION);

            this.managerSingleton.currentLanguage = lang;
            this.managerSingleton.languageData = JSON["locale_" + lang];
        }
        else {
            throw new Error('You can only initialize one manager instance');
        }
    }

    static get Instance() {
        if (!LocalizationManager.managerSingleton) {
            throw new Error('initialize Instantiator First!');
        }

        return LocalizationManager.managerSingleton;
    }

    get CurrentLanguage() {
        return this.currentLanguage;
    }

    public setLanguage(lang: string) {
        this.currentLanguage = lang;
        this.languageData = JSON["locale_" + lang];

        TBCloud.setValue(CLOUD.LOCALIZATION, lang);
        SaveManager.Instance.saveData();

        EventManager.CHANGE_LANGUAGE.emit();
    }

    public getLocalized() {
        return JSONManager.Instance.getJSON(this.languageData);
    }
    public getLocalizedTextObject(key: string) {
        return this.getLocalized()["localization"][key];
    }
}
