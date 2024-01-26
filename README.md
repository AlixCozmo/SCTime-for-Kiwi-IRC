Version 1.4.1

This extension injects sctime in messages, It won't work on the regular Kiwi IRC without modifying the manifest file first and changing the URL.

Please note that this extension currently uses ManifestV2 and not V3.

Example image:
![image](https://github.com/DavidByggerBilar/SCTime-for-Kiwi-IRC/assets/66059104/fe3f2c02-8c2c-4069-a370-59fba5d222a6)


How to install:

Chrome:
To install, simply download the latest release, unzip the file and then in chrome://extensions enable programmer mode, click import uncompressed extension and then select the unzipped folder.

Firefox:

Method 1:

To install, simply download the latest release, unzip the file. Go to about:debugging in the address bar, then click on "this firefox". After that click on "load temporary extension" then choose any file inside the unzipped folder.

NOTE: The extension will disappear after restarting the browser using this method.

Method 2:

You can also install the extension with the .xpi file, though this may not work on regular firefox installations as it is not signed. It should however work on firefox developer edition.

Go into about:addons in firefox, click on the cogwheel and select install addon from file, then choose the .xpi file.

Most of the calculation stuff is ported to javascript from this: https://github.com/Delrynn/inline-sctime

Things to do:

* Remove seconds showing when sctime is over 1 hour
