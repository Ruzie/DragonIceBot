# DragonIceBot
An Open Source Discord Music bot written with Eris as Discord API library

# Features
- [x] Fast and nicer
- [x] Slash commands

# Transpile to CommonJS
Clone the repository and type `tsc` on cloned folder, it should compile output in `dist` folder. (Make sure you've installed typescript with `-g` param using `npm`)

Note: If you rename `dist` folder to any other, make sure you've update `dist` folder name in InteractionManager to your newly updated output folder name.

# Bugs
For any reason if bot didn't disconnect from voice channel after 5 seconds it probably having issues when setTimeout proceed but previous function yet not being completed.

For other bugs, feel free to move on [issues](https://github.com/Ruzie/DragonIceBot/issues)
