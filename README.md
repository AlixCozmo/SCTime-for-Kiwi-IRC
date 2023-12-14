Version 1.3.9.2

This extension injects sctime in messages, It won't work on the regular Kiwi IRC without modifying the manifest file first and changing the URL.

Please note that this extension currently uses ManifestV2 and not V3.

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


Example image:
![example3](https://user-images.githubusercontent.com/66059104/210634984-cfb3b8f5-482a-4119-8955-32c4fff5499b.PNG)


Most of the calculation stuff is ported to javascript from this: https://github.com/Delrynn/inline-sctime
