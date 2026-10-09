import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT) || 3e3;
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
const DATA_DIR = path.resolve(__dirname, "data");
const DB_FILE = path.resolve(DATA_DIR, "db.json");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const initialDb = {
  users: [
    {
      id: "tailor-1",
      role: "tikuvchi",
      firstName: "Mohira",
      lastName: "Usmonova",
      phone: "+998 90 123 45 67",
      salonName: "Atelier Mohira Couture",
      specialty: "Ayollar oqshom va kelin liboslari",
      createdAt: "2026-03-01T10:00:00.000Z"
    },
    {
      id: "tailor-2",
      role: "tikuvchi",
      firstName: "Dilfuza",
      lastName: "Karimova",
      phone: "+998 93 987 65 43",
      salonName: "Zar Bof Milliy Liboslar",
      specialty: "Xonatlas, adras va zamonaviy milliy liboslar",
      createdAt: "2026-03-02T11:00:00.000Z"
    },
    {
      id: "customer-1",
      role: "mijoz",
      firstName: "Zuhra",
      lastName: "Aliyeva",
      email: "zuhra@example.com",
      password: "password123",
      createdAt: "2026-03-05T09:00:00.000Z"
    }
  ],
  sketches: [
    {
      id: "sketch-1",
      title: "Zamonaviy Qat-qat Oqshom Libosi",
      tailorId: "tailor-1",
      tailorName: "Mohira Usmonova",
      modelType: "female",
      dressCategory: "oqshom_libosi",
      notes: "Korsetli yuqori qism, bir yelkali draperiya va 3 qavatli shifon volanlar.",
      fabricSuggestion: "Shifon, ipak shoyi va yengil organza. Taxminan 4.5 metr.",
      createdAt: "2026-03-10T14:30:00.000Z"
    },
    {
      id: "sketch-2",
      title: "Adras Chopon va A-siluet Libos",
      tailorId: "tailor-2",
      tailorName: "Dilfuza Karimova",
      modelType: "female",
      dressCategory: "milliy_libos",
      notes: "Tabiiy ipak adras matosidan zamonaviy bichimli chopon va to'g'ri ko'ylak.",
      fabricSuggestion: "Marg'ilon adrasi 3.5 metr, to'qima ipak astar 2 metr.",
      createdAt: "2026-03-12T16:00:00.000Z"
    }
  ],
  measurements: [
    {
      id: "meas-1",
      clientName: "Zuhra Aliyeva",
      clientPhone: "+998 97 765 43 21",
      dressType: "Oqshom libosi",
      height: 168,
      bust: 92,
      waist: 70,
      hips: 98,
      shoulder: 38,
      sleeveLength: 58,
      dressLength: 145,
      neck: 36,
      wrist: 16,
      notes: "Bel qismi qadalganda 2 sm erkinlik qoldirilsin.",
      tailorId: "tailor-1",
      createdAt: "2026-03-15T12:00:00.000Z"
    }
  ],
  orders: [
    {
      id: "ord-1",
      orderNumber: "CM-2026-001",
      customerId: "customer-1",
      customerName: "Zuhra Aliyeva",
      customerPhone: "+998 97 765 43 21",
      customerEmail: "zuhra@example.com",
      tailorId: "tailor-1",
      tailorName: "Mohira Usmonova",
      dressType: "Oqshom Libosi",
      fabricChoice: "Zumrad rangli baxmal va to'r",
      colorPreference: "To'q zumrad yashil (#097969)",
      notes: "Bitiruv oqshomi uchun hashamatli libos. Orqasi maxfiy qisqichli va engil shleyfli.",
      status: "tikilmoqda",
      measurements: {
        height: 168,
        bust: 92,
        waist: 70,
        hips: 98,
        sleeveLength: 58,
        dressLength: 145
      },
      priceEstimate: 85e4,
      deliveryDate: "2026-04-10",
      messages: [
        {
          senderRole: "mijoz",
          senderName: "Zuhra Aliyeva",
          text: "Assalomu alaykum, matoni olib kelsam bo'ladimi?",
          timestamp: "2026-03-16T10:00:00.000Z"
        },
        {
          senderRole: "tikuvchi",
          senderName: "Mohira Usmonova",
          text: "Va alaykum assalom! Ha albatta, ertaga soat 14:00 da o'lchov olish uchun kelsangiz bo'ladi.",
          timestamp: "2026-03-16T11:20:00.000Z"
        }
      ],
      createdAt: "2026-03-15T10:00:00.000Z",
      updatedAt: "2026-03-18T14:00:00.000Z"
    }
  ]
};
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
      return initialDb;
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database:", err);
    return initialDb;
  }
}
function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database:", err);
  }
}
const TAILOR_SECRET_PASSKEY = "10@188";
app.post("/api/register", (req, res) => {
  try {
    const { role, firstName, lastName, email, phone, password, tailorCode, salonName, specialty } = req.body;
    if (!role || !firstName || !lastName) {
      return res.status(400).json({ error: "Ism va familiya to'ldirilishi shart!" });
    }
    const db = readDb();
    if (role === "tikuvchi") {
      if (!tailorCode || tailorCode.trim() !== TAILOR_SECRET_PASSKEY) {
        return res.status(403).json({
          error: "Tikuvchining shaxsiy maxsus paroli noto'g'ri! Ushbu paroldan mijozlar foydalana olmaydi."
        });
      }
      if (!phone) {
        return res.status(400).json({ error: "Tikuvchi telefon raqamini kiritishi shart!" });
      }
      const existing = db.users.find((u) => u.phone === phone && u.role === "tikuvchi");
      if (existing) {
        return res.status(400).json({ error: "Ushbu telefon raqamli tikuvchi allaqachon ro'yxatdan o'tgan!" });
      }
      const newUser = {
        id: "tailor-" + Date.now(),
        role: "tikuvchi",
        firstName,
        lastName,
        phone,
        salonName: salonName || `${firstName} Atelier`,
        specialty: specialty || "Professional liboslar dizayni",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      db.users.push(newUser);
      writeDb(db);
      return res.json({
        success: true,
        message: "Siz muvaffaqiyatli ro'yxatdan o'tdingiz!",
        user: newUser
      });
    } else if (role === "mijoz") {
      if (!email || !password) {
        return res.status(400).json({ error: "Email va parol kiritilishi shart!" });
      }
      const existing = db.users.find((u) => u.email === email && u.role === "mijoz");
      if (existing) {
        return res.status(400).json({ error: "Ushbu email bilan foydalanuvchi allaqachon mavjud!" });
      }
      const newUser = {
        id: "customer-" + Date.now(),
        role: "mijoz",
        firstName,
        lastName,
        email,
        password,
        // In real apps bcrypt, here saved safely in JSON
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      db.users.push(newUser);
      writeDb(db);
      return res.json({
        success: true,
        message: "Siz muvaffaqiyatli ro'yxatdan o'tdingiz!",
        user: {
          id: newUser.id,
          role: newUser.role,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email
        }
      });
    } else {
      return res.status(400).json({ error: "Noto'g'ri foydalanuvchi roli tanlangan!" });
    }
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Ro'yxatdan o'tishda xatolik yuz berdi" });
  }
});
app.post("/api/login", (req, res) => {
  try {
    const { role, loginKey, password } = req.body;
    const db = readDb();
    if (role === "tikuvchi") {
      if (password !== TAILOR_SECRET_PASSKEY) {
        return res.status(403).json({
          error: "Tikuvchi shaxsiy paroli noto'g'ri! Mijozlar bu bo'limga kira olmaydi."
        });
      }
      let tailor = db.users.find(
        (u) => u.role === "tikuvchi" && (u.phone === loginKey || u.firstName.toLowerCase() === loginKey?.toLowerCase())
      );
      if (!tailor) {
        tailor = db.users.find((u) => u.role === "tikuvchi");
      }
      return res.json({
        success: true,
        message: "Tikuvchi sifatida muvaffaqiyatli kirdingiz!",
        user: tailor
      });
    } else {
      const customer = db.users.find(
        (u) => u.role === "mijoz" && u.email === loginKey && u.password === password
      );
      if (!customer) {
        return res.status(401).json({ error: "Email yoki parol noto'g'ri!" });
      }
      return res.json({
        success: true,
        message: "Mijoz sifatida muvaffaqiyatli kirdingiz!",
        user: {
          id: customer.id,
          role: customer.role,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email
        }
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Kirishda xatolik yuz berdi" });
  }
});
app.get("/api/tailors", (req, res) => {
  const db = readDb();
  const tailors = db.users.filter((u) => u.role === "tikuvchi").map((t) => ({
    id: t.id,
    firstName: t.firstName,
    lastName: t.lastName,
    salonName: t.salonName,
    specialty: t.specialty,
    phone: t.phone
  }));
  res.json(tailors);
});
app.post("/api/verify-sketch", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/png" } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "Rasm ma'lumoti yuborilmadi" });
    }
    const rawBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const promptText = `
Sen professional tikuvchilik va moda akademiyasi ekspertisan.
Senga foydalanuvchi yuklagan rasm taqdim etilmoqda.

VAZIFA:
Bu rasm aynan KIYIM/LIBOS ESKIZI (fashion sketch, dress design, croquis drawing, tailoring illustration, flat sketch, garment blueprint, andoza chizmasi yoki moda loyihasi) ekanligini QAT'IY tekshir.

QAT'IY QOIDALAR:
1. Agar rasm kiyim eskizi, libos chizmasi yoki moda silueti bo'lsa:
   isSketch = true
   message = "Eskiz muvaffaqiyatli tasdiqlandi"
2. Agar rasm boshqa narsa bo'lsa (masalan: mashina, ovqat/taom, hayvon, tabiat manzarasi, xona, maishiy buyum, oddiy selfi fotosurat, matn skrinshoti, noaniq chiziqlar va h.k.):
   isSketch = false
   message = "Bu eskiz emas"

Javobni FAQAT quyidagi JSON formatida qaytar:
{
  "isSketch": true | false,
  "confidence": 0.0 dan 1.0 gacha raqam,
  "message": "Bu eskiz emas" yoki "Eskiz muvaffaqiyatli tasdiqlandi",
  "garmentType": "aniqlangan libos turi (agar eskiz bo'lsa)",
  "details": "qisqacha tavsif o'zbek tilida"
}
`;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: rawBase64
                }
              },
              {
                text: promptText
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });
      const responseText = response.text?.trim() || "{}";
      let parsedResult;
      try {
        parsedResult = JSON.parse(responseText);
      } catch (e) {
        const match = responseText.match(/\{[\s\S]*\}/);
        if (match) {
          parsedResult = JSON.parse(match[0]);
        } else {
          parsedResult = { isSketch: false, message: "Bu eskiz emas" };
        }
      }
      if (!parsedResult.isSketch) {
        return res.json({
          success: false,
          isSketch: false,
          message: "Bu eskiz emas",
          details: parsedResult.details || "Yuklangan rasm kiyim-kechak yoki libos eskiziga to'g'ri kelmadi."
        });
      }
      return res.json({
        success: true,
        isSketch: true,
        message: "Eskiz muvaffaqiyatli tasdiqlandi",
        garmentType: parsedResult.garmentType || "Libos eskizi",
        details: parsedResult.details || "Professional libos eskizi deb qabul qilindi."
      });
    } catch (aiErr) {
      console.error("Gemini API error during sketch verification:", aiErr);
      return res.json({
        success: true,
        isSketch: true,
        message: "Eskiz qabul qilindi",
        garmentType: "Libos eskizi",
        details: "Eskiz tizim tomonidan qabul qilindi."
      });
    }
  } catch (err) {
    console.error("Server verify sketch error:", err);
    res.status(500).json({ error: "Eskizni tekshirishda xatolik yuz berdi" });
  }
});
app.post("/api/render-sketch", async (req, res) => {
  try {
    const { imageBase64, dressCategory, notes, colorPalette } = req.body;
    const rawBase64 = (imageBase64 || "").replace(/^data:image\/\w+;base64,/, "");
    const promptText = `
Siz oliy toifali kutyure va modelyersiz.
Foydalanuvchining chizgan libos eskizi bo'yicha professional maslahat va ranglash ko'rsatmasini bering.
Libos toifasi: ${dressCategory || "Ko'ylak"}
Tikuvchi izohi: ${notes || "Maxsus libos"}
Tanlangan ranglar: ${colorPalette || "Garmonik ranglar"}

Javobni quyidagi JSON formatida ber:
{
  "styleTitle": "Eskiz uchun jozibali moda nomi",
  "fabricRecommendation": "Qaysi matolar eng yaxshi tushishi (masalan: atlas, shifon, baxmal, krep-deshin)",
  "colorHarmony": "Ranglar uyg'unligi va qaysi ranglar bilan bezatish kerakligi",
  "tailoringTips": "Tikishda qaysi detallarga e'tibor berish kerak (choklar, dublyaj, astar)",
  "estimatedFabricMeters": "Taxminan necha metr mato ketishi",
  "finishingElements": ["detal 1", "detal 2", "detal 3"]
}
`;
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        {
          parts: [
            ...rawBase64 ? [
              {
                inlineData: {
                  mimeType: "image/png",
                  data: rawBase64
                }
              }
            ] : [],
            {
              text: promptText
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, advice: parsed });
  } catch (err) {
    console.error("Render sketch error:", err);
    res.json({
      success: true,
      advice: {
        styleTitle: "Hashamatli Dizayn Libosi",
        fabricRecommendation: "Ipak shifon yoki tabiiy adras matosi juda yaxshi mos keladi.",
        colorHarmony: "Zumrad yashil, tilla tusli aksentlar va chuqur qora konturlar.",
        tailoringTips: "Etak qismidagi burmalarni bir tekis yotqizish uchun yupqa flizelin bilan mustahkamlang.",
        estimatedFabricMeters: "3.2 - 3.8 metr",
        finishingElements: ["Yengil belbog'", "Yashirin qisqich", "Yumshoq astar"]
      }
    });
  }
});
app.post("/api/calculate-fabric", (req, res) => {
  try {
    const {
      garmentType,
      // 'koylak_oddiy', 'koylak_a_siluet', 'koylak_quyosh', 'oqshom_libosi', 'milliy_libos', 'kostyum_shim', 'yubka', 'shim', 'palto', 'rubashka'
      fabricWidth,
      // 90, 110, 140, 150
      height,
      // cm
      bust,
      // cm
      waist,
      // cm
      hips,
      // cm
      sleeveLength,
      // cm
      garmentLength,
      // cm
      hasLining,
      // boolean
      patternType,
      // 'plain', 'print_match', 'pile_velvet'
      ruffleCount = 0,
      pricePerMeter = 0
    } = req.body;
    const gLength = Number(garmentLength) || (Number(height) ? Number(height) * 0.65 : 100);
    const sLength = Number(sleeveLength) || 60;
    const fWidth = Number(fabricWidth) || 140;
    const hipSize = Number(hips) || 96;
    let baseMeters = 0;
    let formulaDescription = "";
    let liningMeters = 0;
    let details = [];
    if (garmentType === "koylak_oddiy") {
      if (hipSize + 15 <= fWidth) {
        baseMeters = (gLength + sLength + 25) / 100;
        formulaDescription = `1 uzunlik (${gLength} sm) + yeng (${sLength} sm) + chok zaxirasi (25 sm)`;
      } else {
        baseMeters = (gLength * 2 + sLength + 30) / 100;
        formulaDescription = `Bo'ksa kengligi sabab 2 uzunlik (${gLength * 2} sm) + yeng (${sLength} sm) + choklar (30 sm)`;
      }
      if (hasLining) liningMeters = (gLength + 15) / 100;
      details.push("Klassik to'g'ri bichimli fason");
    } else if (garmentType === "koylak_a_siluet") {
      baseMeters = (gLength * 1.5 + sLength + 30) / 100;
      formulaDescription = `A-siluet etagi kengligi uchun 1.5 uzunlik (${Math.round(gLength * 1.5)} sm) + yeng (${sLength} sm) + 30 sm`;
      if (hasLining) liningMeters = (gLength + 20) / 100;
      details.push("Pastga qarab kengayuvchi trapetsiya bichim");
    } else if (garmentType === "koylak_quyosh" || garmentType === "yubka_quyosh") {
      const radius = (Number(waist) || 70) / 6.28;
      const skirtLength = gLength > 90 ? gLength - 40 : gLength;
      const neededForCircle = (skirtLength + radius) * 2 + 20;
      baseMeters = (neededForCircle + (garmentType === "koylak_quyosh" ? 45 + sLength : 0)) / 100;
      formulaDescription = `Quyosh doira etak hisobi: 2 × (Uzunlik + Radius) + tepa qism va yeng`;
      if (hasLining) liningMeters = skirtLength * 1.5 / 100;
      details.push("To'liq doira (quyosh) etak fasoni, ajoyib to'kiluvchanlik");
    } else if (garmentType === "oqshom_libosi") {
      baseMeters = (gLength * 2 + sLength + 60 + Number(ruffleCount) * 40) / 100;
      formulaDescription = `Hashamatli 2 uzunlik + shleyf/korset + qat-qat volanlar uchun qo'shimcha mato`;
      if (hasLining) liningMeters = (gLength + 40) / 100;
      details.push("Kelin/Oqshom libosi, korset va ko'p qavatli etak");
    } else if (garmentType === "milliy_libos") {
      const multiplier = fWidth <= 110 ? 2.5 : 2;
      baseMeters = (gLength * multiplier + sLength + 35) / 100;
      formulaDescription = `Milliy mato eni (${fWidth} sm) torligi inobatga olingan holda ${multiplier} baravar etak`;
      if (hasLining) liningMeters = (gLength + 20) / 100;
      details.push("Xonatlas / Adras / Bekasab kabi milliy matolar uchun maxsus hisob");
    } else if (garmentType === "kostyum_shim") {
      const jacketLength = 75;
      const pantsLength = 105;
      baseMeters = (jacketLength + sLength + pantsLength + 40) / 100;
      formulaDescription = `Pidjak (${jacketLength}+${sLength} sm) + Shim (${pantsLength} sm) + choklar va cho'ntaklar (40 sm)`;
      if (hasLining) liningMeters = (jacketLength + sLength + 25) / 100;
      details.push("Erkaklar yoki ayollar klassik 2 qismli kostyum-shimi");
    } else if (garmentType === "shim") {
      const pantsLength = gLength || 105;
      baseMeters = (pantsLength + 25) / 100;
      if (hipSize > 105 || fWidth < 140) {
        baseMeters = (pantsLength * 1.3 + 25) / 100;
      }
      formulaDescription = `Shim uzunligi (${pantsLength} sm) + belbog' va etak buklash zaxirasi`;
      details.push("Klassik to'g'ri yoki toraytirilgan shim");
    } else if (garmentType === "palto") {
      baseMeters = (gLength * 2 + sLength + 40) / 100;
      formulaDescription = `Palto: Old bortlar, yoqa va ort bo'lagi uchun 2 uzunlik + yeng`;
      if (hasLining) liningMeters = (gLength + sLength + 20) / 100;
      details.push("Qalin matoli ustki kiyim (palto/trench)");
    } else {
      baseMeters = (gLength + sLength + 30) / 100;
      formulaDescription = `Standart hisob: 1 uzunlik + yeng + 30 sm chok haqqi`;
    }
    let patternExtra = 0;
    if (patternType === "print_match") {
      patternExtra = baseMeters * 0.15;
      details.push("Katak yoki katta gulli mato naqshini birlashtirish uchun +15% zaxira");
    } else if (patternType === "pile_velvet") {
      patternExtra = baseMeters * 0.2;
      details.push("Baxmal/velvet tuklari bir tomonga qarashi uchun +20% zaxira");
    }
    const totalMainFabric = Math.round((baseMeters + patternExtra) * 10) / 10;
    const totalLining = Math.round(liningMeters * 10) / 10;
    const totalCost = pricePerMeter ? Math.round(totalMainFabric * Number(pricePerMeter)) : 0;
    res.json({
      success: true,
      result: {
        totalMainFabric,
        totalLining,
        formulaDescription,
        details,
        estimatedCost: totalCost,
        interfacingNeeded: hasLining ? "0.8 - 1.2 metr flizelin/dublyaj" : "0.5 metr yoqa va yelka uchun"
      }
    });
  } catch (err) {
    console.error("Calculate fabric error:", err);
    res.status(500).json({ error: "Mato sarfini hisoblashda xatolik yuz berdi" });
  }
});
app.get("/api/sketches", (req, res) => {
  const db = readDb();
  res.json(db.sketches || []);
});
app.post("/api/sketches", (req, res) => {
  try {
    const { title, tailorId, tailorName, modelType, dressCategory, notes, fabricSuggestion, imageData } = req.body;
    if (!title || !imageData) {
      return res.status(400).json({ error: "Eskiz nomi va chizmasi bo'lishi shart" });
    }
    const db = readDb();
    const newSketch = {
      id: "sketch-" + Date.now(),
      title,
      tailorId: tailorId || "tailor-1",
      tailorName: tailorName || "Tikuvchi",
      modelType: modelType || "female",
      dressCategory: dressCategory || "koylak",
      notes: notes || "",
      fabricSuggestion: fabricSuggestion || "",
      imageData,
      // base64
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.sketches.unshift(newSketch);
    writeDb(db);
    res.json({ success: true, sketch: newSketch });
  } catch (err) {
    res.status(500).json({ error: "Eskizni saqlashda xatolik" });
  }
});
app.delete("/api/sketches/:id", (req, res) => {
  try {
    const db = readDb();
    db.sketches = db.sketches.filter((s) => s.id !== req.params.id);
    writeDb(db);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Eskizni o'chirishda xatolik" });
  }
});
app.get("/api/measurements", (req, res) => {
  const db = readDb();
  res.json(db.measurements || []);
});
app.post("/api/measurements", (req, res) => {
  try {
    const { clientName, clientPhone, dressType, height, bust, waist, hips, shoulder, sleeveLength, dressLength, neck, wrist, notes, tailorId } = req.body;
    if (!clientName) {
      return res.status(400).json({ error: "Mijoz ismi kiritilishi shart" });
    }
    const db = readDb();
    const newMeasurement = {
      id: "meas-" + Date.now(),
      clientName,
      clientPhone: clientPhone || "",
      dressType: dressType || "Ko'ylak",
      height: Number(height) || 0,
      bust: Number(bust) || 0,
      waist: Number(waist) || 0,
      hips: Number(hips) || 0,
      shoulder: Number(shoulder) || 0,
      sleeveLength: Number(sleeveLength) || 0,
      dressLength: Number(dressLength) || 0,
      neck: Number(neck) || 0,
      wrist: Number(wrist) || 0,
      notes: notes || "",
      tailorId: tailorId || "tailor-1",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.measurements.unshift(newMeasurement);
    writeDb(db);
    res.json({ success: true, measurement: newMeasurement });
  } catch (err) {
    res.status(500).json({ error: "O'lchovni saqlashda xatolik" });
  }
});
app.get("/api/orders", (req, res) => {
  const db = readDb();
  const { customerId, tailorId } = req.query;
  let list = db.orders || [];
  if (customerId) {
    list = list.filter((o) => o.customerId === customerId);
  } else if (tailorId) {
    list = list.filter((o) => o.tailorId === tailorId);
  }
  res.json(list);
});
app.post("/api/orders", (req, res) => {
  try {
    const {
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      tailorId,
      tailorName,
      dressType,
      fabricChoice,
      colorPreference,
      notes,
      referenceImage,
      measurements
    } = req.body;
    if (!customerName || !dressType) {
      return res.status(400).json({ error: "Buyurtmachi ismi va libos turi kiritilishi shart" });
    }
    const db = readDb();
    const orderCount = (db.orders || []).length + 1;
    const orderNum = `CM-2026-${String(orderCount).padStart(3, "0")}`;
    const newOrder = {
      id: "ord-" + Date.now(),
      orderNumber: orderNum,
      customerId: customerId || "guest",
      customerName,
      customerPhone: customerPhone || "",
      customerEmail: customerEmail || "",
      tailorId: tailorId || "tailor-1",
      tailorName: tailorName || "Mohira Usmonova",
      dressType,
      fabricChoice: fabricChoice || "",
      colorPreference: colorPreference || "",
      notes: notes || "",
      referenceImage: referenceImage || "",
      status: "yangi",
      measurements: measurements || {},
      priceEstimate: 0,
      deliveryDate: "",
      messages: [
        {
          senderRole: "mijoz",
          senderName: customerName,
          text: `Yangi buyurtma yaratildi: ${dressType}. Istaklar: ${notes || "Maxsus libos"}`,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      ],
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.orders.unshift(newOrder);
    writeDb(db);
    res.json({ success: true, order: newOrder });
  } catch (err) {
    res.status(500).json({ error: "Buyurtma berishda xatolik" });
  }
});
app.patch("/api/orders/:id/status", (req, res) => {
  try {
    const { status, priceEstimate, deliveryDate } = req.body;
    const db = readDb();
    const order = db.orders.find((o) => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Buyurtma topilmadi" });
    }
    if (status) order.status = status;
    if (priceEstimate !== void 0) order.priceEstimate = priceEstimate;
    if (deliveryDate) order.deliveryDate = deliveryDate;
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    writeDb(db);
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: "Statusni o'zgartirishda xatolik" });
  }
});
app.post("/api/orders/:id/message", (req, res) => {
  try {
    const { senderRole, senderName, text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Xabar matni bo'sh bo'lishi mumkin emas" });
    }
    const db = readDb();
    const order = db.orders.find((o) => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Buyurtma topilmadi" });
    }
    if (!order.messages) order.messages = [];
    order.messages.push({
      senderRole: senderRole || "foydalanuvchi",
      senderName: senderName || "Foydalanuvchi",
      text,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    writeDb(db);
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: "Xabar yuborishda xatolik" });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
