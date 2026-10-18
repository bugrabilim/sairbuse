#!/usr/bin/env bash
# Android emülatöründe uygulamayı kurar, açar ve WebView'e hata ayıklama bağlantısıyla (yalnız debug yapıda açık)
# bağlanıp scripts/uygulama/android-dene.mjs denemelerini çalıştırır; ekran görüntüleri ekran/ klasörüne.
# GitHub Actions'ta android.yml çalıştırır (emülatörün içinde).
set -euo pipefail
PAKET=tr.bumba.duygularinpesinde
adb install -r uygulama/android/app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n "$PAKET/.MainActivity"
sleep 15
mkdir -p ekran
adb exec-out screencap -p > ekran/1-ana-sayfa.png
PID=$(adb shell pidof "$PAKET" | tr -d '\r')
adb forward tcp:9222 "localabstract:webview_devtools_remote_$PID"
node scripts/uygulama/android-dene.mjs
adb exec-out screencap -p > ekran/2-siir.png
