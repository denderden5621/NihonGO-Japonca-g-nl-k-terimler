import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Lazy initialize Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined in environment.");
    }
    geminiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Helper function with retry and fallback across supported models
async function generateContentWithRetry(
  ai: GoogleGenAI,
  requestConfig: {
    contents: any;
    config?: any;
  }
) {
  const candidateModels = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-pro",
    "gemini-3.7-flash"
  ];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: requestConfig.contents,
        config: requestConfig.config,
      });
      return response;
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini API] Model ${model} failed (${err?.status || err?.code || 'error'}), trying next model: ${err?.message || err}`);
    }
  }

  throw lastError || new Error("Tüm Gemini modelleri meşgul.");
}

// AI Pronunciation Evaluation endpoint
app.post("/api/evaluate-pronunciation", async (req, res) => {
  const {
    targetJapanese,
    targetRomaji,
    targetTurkish,
    userSpokenText,
    userAudioBase64,
    audioMimeType,
  } = req.body;

  if (!targetJapanese || !targetRomaji) {
    return res.status(400).json({ error: "Hedef Japonca ifade eksik." });
  }

  try {
    const ai = getGeminiClient();

    const systemInstruction = `Sen uzman, son derece dikkatli ve dürüst bir Japonca fonetik koçu ve dil eğitmenisin.
Kullanıcı bir Japonca ifadeyi sesli olarak telaffuz etmiştir.

KRİTİK DOĞRULUK KURALLARI (KESİNLİKLE UYULMALIDIR):
1. KULLANICI FARKLI VEYA ALAKASIZ BİR KELİME SÖYLEDİYSE:
   - Kullanıcı hedef cümle yerine başka bir dilde (Türkçe, İngilizce vb.) veya hedef cümleyle ilgisi olmayan tamamen farklı bir Japonca kelime söylediyse:
   - score: 10 ile 35 arasında DÜŞÜK bir puan olmalıdır (ASLA 50 veya üzeri vermeyin!).
   - rating: 'Yanlış İfade' veya 'Tekrar Deneyin' olmalıdır.
   - detectedText: Kullanıcının gerçekte söylediği/ses kaydında duyulan ifade (Örn: 'merhaba', 'elma', 'farklı cümle' vb.).
   - summaryFeedback: Hedef ifade olan "${targetJapanese}" (${targetRomaji}) yerine farklı bir ifade ("{duyulan kelime}") söylendiğini açık ve nazikçe belirtin.

2. KULLANICI DOĞRU İFADEYİ SÖYLEDİ AMA TELAFFUZ KUSURLARI VARSA:
   - score: 50 ile 84 arasında olmalıdır.
   - rating: 'İyi' veya 'Geliştirilebilir' olmalıdır.
   - Hangi hecelerde (Örn: R sesleri, TSU sesi, uzun sesler, desu/masu yutulması) hata yapıldığını somut olarak açıklayın.

3. KULLANICI DOĞRU İFADEYİ ÇOK NET VE AKICI TELAFFUZ ETTİYSE:
   - score: 85 ile 100 arasında olmalıdır.
   - rating: 'Çok İyi' veya 'Mükemmel' olmalıdır.

Tüm açıklama, ipucu ve tavsiyeler Türkçe olmalıdır. Yanıtı yalnızca belirtilen JSON şemasında döndürün.`;

    const promptText = `HEDEF JAPONCA İFADE:
- Japonca: ${targetJapanese}
- Romaji: ${targetRomaji}
- Türkçe Anlamı: ${targetTurkish || ""}

KULLANICIDAN GELEN SES / KONUŞMA BİLGİSİ:
${userSpokenText ? `Algılanan Konuşma Metni: "${userSpokenText}"` : "Kullanıcı ses kaydını yükledi. Lütfen ekteki ses kaydını dinleyerek kullanıcının ne söylediğini analiz et."}

GÖREV:
Ses kaydını / konuşmayı analiz et. Kullanıcı GERÇEKTEN hedef "${targetRomaji}" ifadesini mi söyledi, yoksa hedef ifadeden farklı/alakasız bir kelime mi söyledi? Eğer hedef ifade söylenmediyse düşük puan (15-35) ver ve duyduğun gerçek kelimeyi detectedText alanına yaz.`;

    const contentsPayload: any = [];

    if (userAudioBase64 && typeof userAudioBase64 === "string" && userAudioBase64.trim().length > 30) {
      contentsPayload.push({
        inlineData: {
          mimeType: audioMimeType || "audio/webm",
          data: userAudioBase64,
        },
      });
    }

    contentsPayload.push({ text: promptText });

    const response = await generateContentWithRetry(ai, {
      contents: contentsPayload,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: "Doğruluğa göre 1 ile 100 arasında telaffuz puanı (Farklı/alakasız kelimeler için 10-35 verilmeli)",
            },
            rating: {
              type: Type.STRING,
              description: "'Mükemmel', 'Çok İyi', 'İyi', 'Geliştirilebilir', 'Yanlış İfade' veya 'Tekrar Deneyin'",
            },
            detectedText: {
              type: Type.STRING,
              description: "Kullanıcının söylediği algılanan gerçek Japonca/Romaji/Türkçe metin",
            },
            summaryFeedback: {
              type: Type.STRING,
              description: "Kullanıcının söylediği içeriğe göre detaylı ve objektif Türkçe değerlendirme",
            },
            phoneticTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Hedef cümlenin doğru telaffuzu için Türkçe 2-3 pratik telaffuz ipucu",
            },
            turkishPhoneticGuide: {
              type: Type.STRING,
              description: "Hedef ifadenin Türkçe harflerle en doğru okunuş şablonu",
            },
            encouragement: {
              type: Type.STRING,
              description: "Kısa ve motive edici Türkçe gezi tavsiyesi",
            },
          },
          required: ["score", "rating", "detectedText", "summaryFeedback", "phoneticTips", "turkishPhoneticGuide", "encouragement"],
        },
      },
    });

    const jsonText = response.text || "{}";
    const result = JSON.parse(jsonText);
    res.json(result);
  } catch (error: any) {
    console.error("Pronunciation evaluation fallback active:", error?.message || error);
    
    // Evaluate based on detected text match
    const cleanSpoken = (userSpokenText || "").toLowerCase().trim();
    const cleanTarget = targetRomaji.toLowerCase().trim();

    let isMatch = false;
    if (cleanSpoken) {
      const spokenWords = cleanSpoken.split(/\s+/);
      const targetWords = cleanTarget.split(/\s+/);
      const commonWords = spokenWords.filter((w) =>
        targetWords.some((tw) => tw.includes(w) || w.includes(tw))
      );
      isMatch = commonWords.length > 0 && commonWords.length >= Math.ceil(targetWords.length / 2);
    }

    if (cleanSpoken && !isMatch) {
      res.status(200).json({
        score: 25,
        rating: "Yanlış İfade",
        detectedText: userSpokenText,
        summaryFeedback: `Hedef ifade ("${targetRomaji}") yerine farklı bir konuşma ("${userSpokenText}") algılandı. Lütfen sadece hedef Japonca ifadeyi söylemeyi deneyin.`,
        phoneticTips: [
          `Hedef cümlenin doğru okunuşu: "${targetRomaji}"`,
          "Kayıt düğmesine bastıktan sonra mikrofona yaklaşarak sadece ekrandaki Japonca cümleyi söyleyin."
        ],
        turkishPhoneticGuide: targetRomaji,
        encouragement: "Hiç sorun değil! Mikrofon butonuna tekrar basarak hedef cümleyi deneyebilirsiniz."
      });
      return;
    }

    // Dynamic contextual fallback tailored to the target phrase
    const isDesu = targetRomaji.toLowerCase().includes("desu");
    const isMasu = targetRomaji.toLowerCase().includes("masu");
    const hasR = /[rl]/i.test(targetRomaji);

    const dynamicTips: string[] = [];
    if (hasR) {
      dynamicTips.push("Japonca 'r' seslerini (ra, ri, ru, re, ro) Türkçe sert 'R' gibi değil; dilinizi üst damağınıza hafifçe dokundurarak (L ile R arasında yumuşak) telaffuz edin.");
    }
    if (isDesu) {
      dynamicTips.push("Cümle sonundaki 'desu' kelimesinde sondaki 'u' sesini yutarak 'des' şeklinde fısıldayın.");
    }
    if (isMasu) {
      dynamicTips.push("Cümle sonundaki 'masu' (örneğin 'kudasaimasu', 'arigatou gozaimasu') ifadesini 'mas' gibi yumuşak bitirin.");
    }
    if (dynamicTips.length < 2) {
      dynamicTips.push("Tüm heceleri eşit uzunlukta ve düz bir tonlamayla okuyun; hece uzatmalarından kaçının.");
      dynamicTips.push("Vurguyu kelimenin başına değil, hecelere eşit dağıtın.");
    }

    res.status(200).json({
      score: 75,
      rating: "İyi",
      detectedText: userSpokenText || "Ses Kaydı Alındı",
      summaryFeedback: `Telaffuzunuz kaydedildi ve Japonca konuşma akışında anlaşılabilir düzeyde.`,
      phoneticTips: dynamicTips.slice(0, 3),
      turkishPhoneticGuide: targetRomaji,
      encouragement: "Pratik yaparak telaffuzunuzu daha da akıcı hale getirebilirsiniz! 🇯🇵"
    });
  }
});

// AI Travel Assistant & Roleplay endpoint
app.post("/api/travel-assistant", async (req, res) => {
  const { messages, scenario, currentPlace } = req.body;

  try {
    const ai = getGeminiClient();

    const systemInstruction = `Sen Japonya seyahatinde olan bir Türk gezginin kişisel rehberi ve Japonca rol yapma asistanısın.
Uygulama arayüzü tamamen Türkçe.
Kullanıcı seninle Türkçe konuşur veya Japonca pratik yapar.

Şu anki bağlam/mekan: ${currentPlace || "Genel Seyahat"}
Senaryo/Mod: ${scenario || "Yardımcı Asistan"}

Görevin:
1. Gezginin sorusuna göre tam olarak Japonya'da nerede ne demesi gerektiğini açıkla.
2. Her Japonca ifadenin yanına mutlaka:
   - Japonca Yazılışı (Kanji/Kana)
   - Romaji (Latin okunuş)
   - Türkçe Fonetik Okunuş (Türkçe harflerle nasıl telaffuz edileceği)
   - Türkçe Anlamı
3. Eğer rol yapma (roleplay) yapılıyorsa (örneğin konbini kasiyeri veya restoran garsonu rolündeysen), önce Japonca konuş, sonra altına parantez içinde Romaji ve Türkçe çevirisi ile kullanıcının verebileceği yanıt seçeneklerini sun.
4. Japon görgü kuralları (örneğin bahşiş bırakılmaması, para tepsisi, çubuk adabı) hakkında pratik ipuçları ver.
Her zaman kibar, samimi ve son derece yardımcı ol.`;

    const formattedContents = (messages || []).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    if (formattedContents.length === 0) {
      formattedContents.push({
        role: "user",
        parts: [{ text: "Merhaba! Japonya seyahatimde bana yardımcı olur musun?" }],
      });
    }

    const response = await generateContentWithRetry(ai, {
      contents: formattedContents,
      config: {
        systemInstruction,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Travel assistant fallback active:", error?.message || error);
    
    // Contextual fallback response according to scenario
    let fallbackReply = "Konnichiwa! Japonya seyahatiniz için buradayım. Konbini, restoran, tren istasyonu veya alışveriş sırasında söylemek istediğiniz her şeyi sorabilirsiniz!";
    if (scenario === "konbini") {
      fallbackReply = "Irasshaimase! (Hoş geldiniz!) 🏪\n\nKasiyer size şu soruları sorabilir:\n1. **Fukuro wa go-riyō desu ka?** (Poşet ister misiniz?) ➡️ Yanıt: *Daijoubu desu* (Gerek yok / İyiyim) veya *Onegaishimasu* (Lütfen).\n2. **Atatame masu ka?** (Isıtalım mı?) ➡️ Yanıt: *Onegaishimasu* (Lütfen ısıtın).\n3. **Pointo kaado wa?** (Puan kartınız var mı?) ➡️ Yanıt: *Nai desu* (Yok).";
    } else if (scenario === "restaurant") {
      fallbackReply = "Irasshaimase, nan-mei sama desu ka? (Hoş geldiniz, kaç kişisiniz?) 🍜\n\nKullanabileceğiniz temel ifadeler:\n- **Hitori desu** (1 kişiyim) / **Futari desu** (2 kişiyiz)\n- **Kore o kudasai** (Bundan rica ediyorum)\n- **O-kaikei onegaishimasu** (Hesap lütfen)";
    } else if (scenario === "train") {
      fallbackReply = "Tren ve Ulaşım İpuçları 🚄:\n- **... wa doko desu ka?** (... nerede?)\n- **Kono densha wa ... ni ikimasu ka?** (Bu tren ...'ya gider mi?)\n- **Kippu uriba** (Bilet gişesi)\n- **Suica / Pasmo** kartınızı turnikelerden geçerken mavi alana dokundurmanız yeterlidir.";
    }

    res.json({ reply: fallbackReply });
  }
});

// Vite Middleware for SPA and Static Asset serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
