# 🌐 NihongoTR - Full-Stack Web & Dev Server Sürümü

Bu klasör, **React 19, TypeScript, Tailwind CSS v4, Motion ve Express/Node.js** arka ucu ile çalışan tam teşekküllü modern web uygulaması kaynak kodlarını içerir.

---

## 🚀 Yerel Geliştirme (Local Development)

### 1. Bağımlılıkları Yükleyin:
```bash
npm install
```

### 2. Ortam Değişkenlerini Ayarlayın:
`.env.example` dosyasını kopyalayarak `.env` oluşturun ve Gemini API anahtarınızı ekleyin:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Geliştirici Sunucusunu Başlatın:
```bash
npm run dev
```
Uygulama `http://localhost:3000` adresinde çalışmaya başlayacaktır.

---

## 📦 Canlı Dağıtım & Derleme (Production Build)

```bash
npm run build
npm start
```
Bu komut, optimize edilmiş statik dosyaları `dist/` klasörüne derler ve Express sunucusunu ayağa kaldırır.
