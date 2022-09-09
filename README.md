# TrebertGames Project AMBAK
* A simple hyper casual game that player needs to jump onto the next ground.

### Version
* Phaser 3.55.2

### Maintainers
* Melbert Bolocon

### Setup
* Clone project into local directory
* npm install (This will install necessary nodes)
* npm run start (This will run the game locally; localhost:3000)
* npm run build (Builds files into 'public' folder)
* npm run prod (Builds files into 'public' folder. This build has no console logs. Good for final release!)

### Asset Folder
* Place the assets in Initial folder if it will be appearing only in MenuScene
* Place the assets in Gameplay folder if it will be used in the game when player is already playing
* #Audio - For Audio(mp3, ogg) files only
* #Font - For Bitmap Font files only
* #Sprites - For Sprites/Textures/Atlas(w/ JSON) only

### Automate Asset Manager
* Use BuildAssetManager.exe in order to automate and fill src/ts/Managers/AssetManager.ts for type-safe of using assets

### Texture Packer
* Free Texture Packer: https://free-tex-packer.com/

### Bitmap Font Generator
* Bitmap Font Generator Online: https://snowb.org/

### Image Compressor
* Online Image Compressor: https://imagecompressor.com/
* Tiny PNG: https://tinypng.com/
