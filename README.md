# 🇯🇵 NihongoTR - Japonya Seyahat, Pratik & Yapay Zeka Telaffuz Rehberi

<div align="center">

![NihongoTR Banner](https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80)

**Türk Gezginler İçin Kapsamlı Japonca İfadeler, Sesli Telaffuzlar, Kültürel Seyahat Adabı ve Google Gemini Destekli AI Telaffuz Koçu**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?style=flat&logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 🌟 Proje Hakkında

**NihongoTR**, Japonya'ya seyahat eden veya Japonca pratik yapmak isteyen Türk kullanıcılar için özel olarak tasarlanmış, durumsal mekan odaklı, sesli ve yapay zeka destekli bir seyahat & telaffuz asistanıdır.

Uygulama, hem **tam teşekküllü full-stack web sürümü**, hem **Android APK yapılandırması**, hem de internet/sunucu bağımsız **tek dosya (standalone HTML)** olarak 3 farklı kullanım formatında sunulmaktadır.

---

## 📁 Repository Klasör Yapısı (3 Sürüm)

Bu repository 3 ana kullanım biçimine göre modüler olarak düzenlenmiştir:

```
nihongotr/
├── 📁 web-version/                  # 🚀 1. Tam Teşekküllü Web Sürümü (React 19 + Vite + Express Backend)
│   ├── src/                         # React bileşenleri, veri setleri, hook'lar
│   ├── server.ts                    # Gemini API proxy & Express sunucusu
│   ├── package.json                 # Bağımlılıklar ve derleme scriptleri
│   └── README.md                    # Yerel kurulum ve çalıştırma adımları
│
├── 📁 apk-version/                  # 📱 2. Android APK & Mobil Paketleme Sürümü
│   ├── capacitor.config.json        # Capacitor mobil yapılandırması
│   ├── package.json                 # Android build scriptleri
│   └── README.md                    # Android Studio ile APK derleme rehberi
│
├── 📁 standalone-html-version/      # 🌸 3. Kendi API Anahtarını Girdiğin Tek Dosya Sürümü
│   ├── index.html                   # %100 Bağımsız, tek dosya (çift tıkla çalıştır)
│   └── README.md                    # Ücretsiz Gemini API anahtarı ekleme rehberi
│
└── README.md                        # Ana Tanıtım & Dokümantasyon Dosyası
```

---

## 🎯 Temel Özellikler

### 📍 1. Mekan & Durum Odaklı Japonca Rehberi (10 Temel Kategori)
* **Genel & Her Yerde:** Selamlaşma, teşekkür, soru kalıpları, acil durumlar.
* **Konbini & Market (7-Eleven / Lawson / FamilyMart):** Poşet isteme, bento ısıtma, çatal/kaşık ve ödeme diyalogları.
* **Restoran & Ramen & Suşi:** Masa bekleme, kişi sayısı belirtme, su isteme, alerji/domuz eti sorma ve hesap isteme.
* **Alışveriş & Tax-Free:** Don Quijote, Bic Camera, Uniqlo, %10 vergi muafiyeti ve beden sorma.
* **Tren & Metro & Shinkansen:** Peron bulma, Suica/Pasmo kartları, bilet otomatları ve hızlı tren rezervasyonları.
* **Otel & Ryokan & Onsen:** Giriş/çıkış, bavul emaneti, kaplıca (Onsen) adabı.
* **Kafe & Izakaya:** Sıcak/soğuk içecek seçimi, paket alma, kadeh kaldırma (Kanpai!).
* **Taksi & Yol Tarifi:** Otomatik kapı uyarısı, harita gösterme, sağ/sol yönler.
* **Tapınak & Turistik Gezi:** Şinto/Budist tapınak adabı (Temizuya arınma suyu, 2 eğilme 2 el çırpma kuralı), fotoğraf izinleri.
* **Eczane & Acil Durum:** Ağrı kesici, soğuk algınlığı, Kouban (polis noktası) ve acil hatlar (119 / 110).

### 🎙️ 2. AI Telaffuz Koçu (Google Gemini 2.5 Flash)
* Tarayıcı üzerinden mikrofonla sesinizi kaydedin.
* Yapay zeka fonetik doğruluğunuzu, akıcılığınızı ve anlaşılırlığınızı 100 üzerinden puanlasın.
* Türk gezginlerin dil yapısına özel fonetik ipuçları ve motive edici geri bildirimler alın.

### 🔊 3. Japonca Doğal Sesli Telaffuz (Web Speech API)
* Tüm ifadeler için yerleşik Japonca ses motoru desteği.
* Yavaşlatılmış ve anlaşılır telaffuz hızıyla dinleme imkanı.

### 🎴 4. İnteraktif Pratik & Bilgi Kartları (Flashcards) & Mini Test (Quiz)
* İki taraflı çevrilebilir bilgi kartları ile hızlı ezber.
* Rastgele üretilen 4 şıklı mini testlerle kendinizi sınama.

### 🏮 5. Japonya Seyahat Adabı & Görgü Kuralları Rehberi
* Bahşiş vermeme kuralı, yürüyen merdiven düzeni (Tokyo sol, Osaka sağ), çöp ayrıştırma, yemek çubuğu (Hashi) kuralları ve dövme (tattoo) onsen kısıtlamaları gibi hayat kurtaran ipuçları.

### 📱 6. Mobil Uyumlu Alt Navigasyon (Bottom Dock)
* Telefon ekranlarında tek parmakla Mekanlar, Pratik, Adap, Favoriler ve AI Koç arasında anında geçiş.

---

## ⚡ Hızlı Başlangıç

### 1. Web Sürümünü Başlatma (Full-Stack):
```bash
git clone https://github.com/KULLANICI_ADINIZ/nihongotr.git
cd nihongotr/web-version
npm install
cp .env.example .env
# .env dosyasında GEMINI_API_KEY anahtarınızı tanımlayın
npm run dev
```
Uygulama `http://localhost:3000` adresinde açılacaktır.

### 2. Tek Dosya HTML Sürümünü Başlatma (Kurulumsuz):
* `standalone-html-version/index.html` dosyasına çift tıklayarak tarayıcınızda açmanız yeterlidir.
* AI telaffuz özellikleri için [Google AI Studio](https://aistudio.google.com/app/apikey)'dan aldığınız ücretsiz anahtarı arayüze girin.

### 3. Android APK Derleme:
* `apk-version/` klasöründeki adımları takip ederek Android Studio ile doğrudan `.apk` çıktısı alabilirsiniz.

---

## 🛠️ Kullanılan Teknolojiler

| Alan | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Frontend** | React 19 + TypeScript | Yüksek performanslı reaktif arayüz |
| **Stil & Tasarım** | Tailwind CSS v4 | Modern, temiz ve responsive tipografi |
| **İkonlar** | Lucide React / Lucide Icons | Vektörel minimal ikon seti |
| **Yapay Zeka** | Google Gemini API (`@google/genai`) | Telaffuz analizi & diyalog koçu |
| **Ses Motoru** | Web Speech API & MediaRecorder | Çevrimdışı Japonca seslendirme & kayıt |
| **Mobil** | Capacitor | Android / iOS yerel paketleme |
| **Backend** | Express + Vite Middleware | Güvenli API proxy ve SPA sunucusu |

---

## 🤝 Katkıda Bulunma

1. Bu depoyu Fork'layın (`fork`)
2. Yeni bir özellik dalı oluşturun (`git checkout -b feature/YeniKategori`)
3. Değişikliklerinizi commit'leyin (`git commit -m 'Yeni kategori ve ifadeler eklendi'`)
4. Dalınıza push yapın (`git push origin feature/YeniKategori`)
5. Bir **Pull Request** açın!

---

## 📄 Lisans

Bu proje **MIT** lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakabilirsiniz.

<div align="center">
  <sub>Türk gezginlerin Japonya maceralarını kolaylaştırmak için özenle geliştirilmiştir. 🌸 良い旅を！(İyi yolculuklar!)</sub>
</div>
