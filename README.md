Version 1.5

Latest stable release: 1.4.9

For [Fuelrat](https://fuelrats.com/) IRC Use. If you don't know what the [fuelrats](https://fuelrats.com/) are, you most likely don't need this.



This extension injects sctime in messages, It won't work on the regular Kiwi IRC without modifying the manifest file first and changing the URL. After doing that however it does work :)

Another note: The Firefox version is not regularly tested if it works or not, although it _should_.

If any issues arises feel free to open an issue :)

Example image: 
![image](https://github.com/user-attachments/assets/ba3f2873-91ec-44d7-b6a7-91444a6ed45c)





Explanation:

((13m29s|19m1s|2m12s))

The first entry assumes no gravity well, the second does and the third is for the mandalay with SCO

How to install:

Chrome:(may not work anymore after manifest v2 deprecation. switch to a different browser)

To install, simply download the latest release, unzip the file and then in chrome://extensions enable programmer mode, click import uncompressed extension and then select the unzipped folder.

Opera:

Download the latest release, unzip it and in opera://extensions enable Developer Mode in the top right corner and then click on "Load unpacked" and select the unzipped folder.

Brave:

Download the latest release, unzip it and in brave://extensions enable Developer Mode in the top right corner, click on "Load unpacked" on the left side and then select the unzipped folder.

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

* Fix sctime not being calculated when a period(.) is after the distance unit

* Abort sctime injection when commands are used. example: !command 3 something something(maybe idk)

* Clean up the code

* add extension to firefox extension store?
