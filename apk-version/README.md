# 📱 NihongoTR - Android APK Derleme & Kurulum Rehberi

Bu klasör, **NihongoTR** uygulamasını Capacitor veya Cordova / PWA kullanarak doğrudan Android akıllı telefonlara yüklenebilir bir **`.apk`** dosyasına dönüştürmek için gerekli tüm ayarları, izinleri ve yapılandırmaları içerir.

---

## 🚀 Hızlı APK Oluşturma (Adım Adım)

### Yöntem 1: Capacitor ile Android Studio üzerinden APK Derleme (En Kararlı Yöntem)

1. **Bağımlılıkları Yükleyin:**
   ```bash
   cd apk-version
   npm install
   ```

2. **Web Dağıtımını Derleyin ve Android Projesine Eşitleyin:**
   ```bash
   # Ana web uygulamasını derleyin (dist klasörü üretilir)
   npm run build

   # Android platformunu ekleyin ve senkronize edin
   npx cap add android
   npx cap sync
   ```

3. **Android Studio ile Açın:**
   ```bash
   npx cap open android
   ```

4. **APK Çıktısı Alın:**
   * Android Studio üst menüsünden: **Build > Build Bundle(s) / APK(s) > Build APK(s)** seçeneğine tıklayın.
   * Derleme tamamlandığında `android/app/build/outputs/apk/debug/app-debug.apk` dosyanız hazır olacaktır!

---

## 🛠️ Gerekli Android İzinleri (Otomatik Yapılandırılmıştır)

Uygulamanın sesli telaffuz kaydı, AI ses analizi ve çevrimdışı önbellekleme yapabilmesi için `AndroidManifest.xml` içinde tanımlanması gereken izinler:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.nihongotr.travelapp">

    <!-- İnternet ve AI API Bağlantısı -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <!-- AI Ses & Telaffuz Değerlendirmesi İçin Mikrofon İzni -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="NihongoTR"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:launchMode="singleTask">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

---

## 🌐 Yöntem 2: APK Oluşturmadan Telefonda Yerel Uygulama Olarak Çalıştırma (PWA)

1. `web-version` veya `standalone-html-version` içerisindeki dosyayı telefonunuzun Chrome / Safari tarayıcısında açın.
2. Tarayıcı menüsünden (üç nokta veya paylaş butonu) **"Ana Ekrana Ekle" (Add to Home Screen)** seçeneğini seçin.
3. Uygulama tıpkı yerel bir APK gibi tam ekran, adres çubuğu olmadan ve çevrimdışı çalışacaktır.
