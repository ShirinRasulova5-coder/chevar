import { useState, useRef } from "react";
import { useToast } from "../Toast";
import { Upload, AlertCircle, CheckCircle2, Sparkles, Save } from "lucide-react";
const SketchUploadModal = ({ user, onSketchUploaded }) => {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [title, setTitle] = useState("");
  const [dressCategory, setDressCategory] = useState("oqshom_libosi");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast({
        type: "error",
        title: "Noto'g'ri fayl",
        message: "Faqat rasm fayllarini yuklash mumkin (JPG, PNG, WEBP)"
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      setImagePreview(base64);
      setVerificationResult(null);
      verifyImageWithAi(base64);
    };
    reader.readAsDataURL(file);
  };
  const verifyImageWithAi = async (base64Image) => {
    setIsVerifying(true);
    try {
      const res = await fetch("/api/verify-sketch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64Image,
          mimeType: "image/png"
        })
      });
      const data = await res.json();
      setVerificationResult(data);
      if (data.isSketch) {
        showToast({
          type: "success",
          title: "Eskiz tasdiqlandi!",
          message: data.message || "Yuklangan rasm haqiqiy libos eskizi deb qabul qilindi."
        });
        if (data.garmentType && !title) {
          setTitle(data.garmentType);
        }
      } else {
        showToast({
          type: "error",
          title: "Bu eskiz emas!",
          message: "Tizim bu rasmni eskiz deb tan olmadi. Iltimos, faqat kiyim yoki libos fasoni eskizini yuklang.",
          duration: 6e3
        });
      }
    } catch (err) {
      console.error(err);
      showToast({
        type: "error",
        title: "Tekshirishda xatolik",
        message: "Eskizni AI orqali tekshirishda xatolik yuz berdi"
      });
    } finally {
      setIsVerifying(false);
    }
  };
  const handleSave = async () => {
    if (!imagePreview) return;
    if (!verificationResult || !verificationResult.isSketch) {
      showToast({
        type: "error",
        title: "Qabul qilib bo'lmaydi",
        message: "Bu rasm eskiz emasligi sababli galereyaga saqlanmaydi!"
      });
      return;
    }
    if (!title.trim()) {
      showToast({
        type: "warning",
        title: "Nom kiriting",
        message: "Iltimos, eskizga nom bering"
      });
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        title,
        tailorId: user.id,
        tailorName: `${user.firstName} ${user.lastName}`,
        modelType: "female",
        dressCategory,
        notes: notes || verificationResult.details,
        fabricSuggestion: "Mijoz talabiga ko'ra",
        imageData: imagePreview
      };
      const res = await fetch("/api/sketches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast({
        type: "success",
        title: "Muvaffaqiyatli saqlandi!",
        message: "Eskiz galereyangizga qo'shildi va buyurtmalarga biriktirilishi mumkin."
      });
      onSketchUploaded(data.sketch);
      setImagePreview(null);
      setVerificationResult(null);
      setTitle("");
      setNotes("");
    } catch (err) {
      showToast({
        type: "error",
        title: "Saqlashda xatolik",
        message: err.message
      });
    } finally {
      setIsSaving(false);
    }
  };
  const testValidSketch = () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600" style="background:#fff">
        <text x="20" y="30" font-family="sans-serif" font-size="14" fill="#999">COUTURE FASHION SKETCH #2026</text>
        <ellipse cx="200" cy="80" rx="16" ry="22" fill="none" stroke="#333" stroke-width="2"/>
        <path d="M 195 102 L 195 125 M 205 102 L 205 125" stroke="#333" stroke-width="2"/>
        <path d="M 170 128 Q 200 135 230 128" stroke="#333" stroke-width="2"/>
        <path d="M 170 128 L 155 180 L 175 220 L 180 260 L 130 520 L 270 520 L 220 260 L 225 220 L 245 180 L 230 128" fill="none" stroke="#222" stroke-width="2.5"/>
        <path d="M 180 260 Q 200 270 220 260" stroke="#333" stroke-width="2"/>
        <path d="M 140 320 Q 200 350 260 320" stroke="#555" stroke-width="1.5" stroke-dasharray="4,4"/>
        <path d="M 135 420 Q 200 460 265 420" stroke="#555" stroke-width="1.5" stroke-dasharray="4,4"/>
      </svg>
    `;
    const base64 = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    setImagePreview(base64);
    verifyImageWithAi(base64);
  };
  const testInvalidImage = () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" style="background:#fff">
        <text x="20" y="40" font-family="sans-serif" font-size="16" fill="#333">AUTOMOBILE VEHICLE PHOTO</text>
        <rect x="50" y="180" width="300" height="90" rx="20" fill="#e11d48"/>
        <path d="M 100 180 L 140 120 L 260 120 L 290 180 Z" fill="#991b1b"/>
        <circle cx="110" cy="270" r="30" fill="#18181b"/>
        <circle cx="280" cy="270" r="30" fill="#18181b"/>
      </svg>
    `;
    const base64 = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    setImagePreview(base64);
    verifyImageWithAi(base64);
  };
  return <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center space-x-2 text-amber-700 mb-1">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">AI Tekshiruv & Autentifikatsiya</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Eskiz Rasmini Yuklash va Tekshirish
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            Tikuvchi chizgan eskiz rasmini yuklashi mumkin. Tizim sun'iy intellekt orqali tekshiradi: agar rasm libos eskizi bo'lmasa, qat'iy ravishda <b>"Bu eskiz emas"</b> deb qabul qilinmaydi.
          </p>
        </div>

        {
    /* Upload Dropzone */
  }
        <div
    onClick={() => fileInputRef.current?.click()}
    className="border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-3xl p-8 text-center cursor-pointer bg-stone-50/60 hover:bg-amber-50/20 transition group"
  >
          <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    onChange={handleFileChange}
    className="hidden"
  />
          <div className="w-16 h-16 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center justify-center mx-auto mb-3 text-stone-400 group-hover:text-amber-600 transition">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-stone-800">
            Eskiz rasmini tanlang yoki bu yerga tortib tashlang
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            PNG, JPG yoki WEBP formatida chizma yoki fotosurat (maksimal 25MB)
          </p>
        </div>

        {
    /* Quick Testing buttons */
  }
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-stone-400 font-medium">Tezkor sinab ko'rish:</span>
          <button
    type="button"
    onClick={testValidSketch}
    className="text-xs py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200 transition font-medium"
  >
            ✅ Haqiqiy Libos Eskizini Sinash
          </button>
          <button
    type="button"
    onClick={testInvalidImage}
    className="text-xs py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl border border-rose-200 transition font-medium"
  >
            ❌ Noto'g'ri Rasmni Sinash ("Bu eskiz emas")
          </button>
        </div>

        {
    /* Preview & AI Result Section */
  }
        {imagePreview && <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
            {
    /* Image Preview Box */
  }
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Yuklangan Rasm Ko'rinishi:
              </span>
              <div className="relative bg-stone-100 rounded-2xl border border-stone-200 overflow-hidden flex items-center justify-center max-h-[360px] p-2">
                <img
    src={imagePreview}
    alt="Eskiz preview"
    className="max-h-[340px] w-auto object-contain rounded-xl"
  />
                {isVerifying && <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2 p-4 text-center">
                    <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-semibold">Gemini AI eskizni tahlil qilmoqda...</span>
                  </div>}
              </div>
            </div>

            {
    /* AI Decision and Meta Form */
  }
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                AI Tekshiruv Natijasi:
              </span>

              {verificationResult && <div>
                  {verificationResult.isSketch ? (
    // Valid sketch accepted
    <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2">
                      <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>Eskiz Muvaffaqiyatli Qabul Qilindi!</span>
                      </div>
                      <p className="text-xs text-emerald-800 leading-relaxed">
                        {verificationResult.details || "Rasm libos chizmasi yoki moda eskizi sifatida tasdiqlandi."}
                      </p>
                      {verificationResult.garmentType && <div className="text-[11px] font-semibold text-emerald-950 bg-emerald-100/70 inline-block px-2.5 py-1 rounded-md">
                          Aniqlangan libos: {verificationResult.garmentType}
                        </div>}
                    </div>
  ) : (
    // Rejection: "Bu eskiz emas"
    <div className="p-5 bg-rose-50 border-2 border-rose-400 rounded-2xl space-y-2 text-rose-950 animate-shake">
                      <div className="flex items-center space-x-2 text-rose-800 font-bold text-base">
                        <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
                        <span>⚠️ Bu eskiz emas!</span>
                      </div>
                      <p className="text-xs text-rose-800 leading-relaxed font-medium">
                        Tizim faqat kiyim-kechak, libos fasoni yoki tikuvchilik eskizlarini qabul qiladi.
                        Boshqa narsalarning rasmini yuklash taqiqlangan.
                      </p>
                      <div className="text-[11px] text-rose-600 bg-rose-100/50 p-2 rounded-lg">
                        Sabab: {verificationResult.details || "Libos chizmasi yoki moda silueti aniqlanmadi."}
                      </div>
                    </div>
  )}
                </div>}

              {
    /* Form fields only active if approved */
  }
              {verificationResult?.isSketch && <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Eskiz Nomi *</label>
                    <input
    type="text"
    placeholder="Masalan: To'y oqshomi uchun atlas libos"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500/40"
  />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Toifasi</label>
                    <select
    value={dressCategory}
    onChange={(e) => setDressCategory(e.target.value)}
    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
  >
                      <option value="oqshom_libosi">Oqshom Libosi / Kelin ko'ylak</option>
                      <option value="kundalik_koylak">Kundalik Ko'ylak</option>
                      <option value="milliy_libos">Milliy Libos (Atlas / Adras)</option>
                      <option value="kostyum_shim">Kostyum-shim</option>
                      <option value="yubka">Yubka va Bluzka</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Tikuvchi Izohi</label>
                    <textarea
    rows={2}
    placeholder="Fason xususiyatlari, tavsiya etilgan mato..."
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
  />
                  </div>

                  <button
    onClick={handleSave}
    disabled={isSaving}
    className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition disabled:opacity-50"
  >
                    <Save className="w-4 h-4 text-amber-400" />
                    <span>{isSaving ? "Saqlanmoqda..." : "Eskizni Galereyaga Saqlash"}</span>
                  </button>
                </div>}
            </div>
          </div>}
      </div>
    </div>;
};
export {
  SketchUploadModal
};
