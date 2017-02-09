#!/bin/sh
cd project
if [ ! -d platforms/android ]; then
    cordova platform add android
fi
cordova build android
~/Android/Sdk/platform-tools/adb install -r platforms/android/build/outputs/apk/android-debug.apk