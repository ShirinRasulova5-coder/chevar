import { useState, useEffect } from "react";
import { useToast } from "../Toast";
import { Ruler, Plus, Search, ArrowRight, Sparkles, Phone, Scissors } from "lucide-react";
const MeasurementTool = ({ user, onSendToCalculator, onSendToPatternMaker }) => {
  const { showToast } = useToast();
  const [measurementsList, setMeasurementsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [dressType, setDressType] = useState("Ayollar ko'ylagi");
  const [height, setHeight] = useState(168);
  const [bust, setBust] = useState(92);
  const [waist, setWaist] = useState(70);
  const [hips, setHips] = useState(98);
  const [shoulder, setShoulder] = useState(38);
  const [sleeveLength, setSleeveLength] = useState(58);
  const [dressLength, setDressLength] = useState(110);
  const [neck, setNeck] = useState(36);
  const [wrist, setWrist] = useState(16);
  const [notes, setNotes] = useState("");
  const [activeField, setActiveField] = useState("bust");
  const loadMeasurements = async () => {
    try {
      const res = await fetch("/api/measurements");
      const data = await res.json();
      setMeasurementsList(data || []);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    loadMeasurements();
  }, []);
  const calculateStandardSize = (b, h) => {
    if (!b) return "Standart o'lcham";
    if (b <= 84) return "XS (34-36 / O'zbekcha 40)";
    if (b <= 88) return "S (36-38 / O'zbekcha 42)";
    if (b <= 92) return "M (38-40 / O'zbekcha 44-46)";
    if (b <= 98) return "L (40-42 / O'zbekcha 48)";
    if (b <= 104) return "XL (42-44 / O'zbekcha 50)";
    if (b <= 112) return "XXL (46-48 / O'zbekcha 52-54)";
    return "3XL+ (Katta o'lcham)";
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (!clientName.trim()) {
      showToast({
        type: "warning",
        title: "Ism kiritilmadi",
        message: "Mijoz ismini kiritishingiz shart"
      });
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        clientName,
        clientPhone,
        dressType,
        height,
        bust,
        waist,
        hips,
        shoulder,
        sleeveLength,
        dressLength,
        neck,
        wrist,
        notes,
        tailorId: user.id
      };
      const res = await fetch("/api/measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast({
        type: "success",
        title: "O'lchov saqlandi",
        message: `${clientName} uchun o'lchovlar muvaffaqiyatli saqlandi.`
      });
      setMeasurementsList([data.measurement, ...measurementsList]);
      setClientName("");
      setClientPhone("");
      setNotes("");
    } catch (err) {
      showToast({
        type: "error",
        title: "Xatolik",
        message: err.message || "O'lchovni saqlab bo'lmadi"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSelectRecord = (m) => {
    setClientName(m.clientName);
    setClientPhone(m.clientPhone || "");
    setDressType(m.dressType || "Ko'ylak");
    setHeight(m.height || 168);
    setBust(m.bust || 92);
    setWaist(m.waist || 70);
    setHips(m.hips || 98);
    setShoulder(m.shoulder || 38);
    setSleeveLength(m.sleeveLength || 58);
    setDressLength(m.dressLength || 110);
    setNeck(m.neck || 36);
    setWrist(m.wrist || 16);
    setNotes(m.notes || "");
    showToast({
      type: "info",
      title: "Ma'lumotlar yuklandi",
      message: `${m.clientName} o'lchovlari formaga o'tkazildi.`
    });
  };
  const handleSendToCalc = () => {
    if (onSendToCalculator) {
      onSendToCalculator({
        height: Number(height),
        bust: Number(bust),
        waist: Number(waist),
        hips: Number(hips),
        shoulder: Number(shoulder),
        sleeveLength: Number(sleeveLength),
        dressLength: Number(dressLength),
        dressType
      });
      showToast({
        type: "success",
        title: "Kalkulyatorga o'tkazildi",
        message: "O'lchovlar mato hisoblash moduliga yuklandi."
      });
    }
  };
  const handleSendToPatterns = () => {
    if (onSendToPatternMaker) {
      onSendToPatternMaker({
        height: Number(height),
        bust: Number(bust),
        waist: Number(waist),
        hips: Number(hips),
        shoulder: Number(shoulder),
        sleeveLength: Number(sleeveLength),
        dressLength: Number(dressLength),
        neck: Number(neck),
        dressType
      });
      showToast({
        type: "success",
        title: "Andoza konstruktoriga o'tkazildi",
        message: "O'lchovlar asosida lekala chizmasi ochildi."
      });
    }
  };
  const filtered = measurementsList.filter(
    (m) => m.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || m.clientPhone && m.clientPhone.includes(searchTerm)
  );
  return <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2 text-amber-700 mb-1">
            <Ruler className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Antropometrik O'lchov Dasturi</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Mijoz O'lchovlarini Olish va Saqlash
          </h1>
          <p className="text-xs text-stone-500">
            Aniq o'lchovlar oling, standart razmerni aniqlang va mato sarfini hisoblang.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onSendToPatternMaker && <button
    onClick={handleSendToPatterns}
    className="flex items-center space-x-2 px-3.5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-md transition"
  >
              <Scissors className="w-4 h-4 text-amber-400" />
              <span>Andoza (Lekala) Chiqarish</span>
            </button>}

          {onSendToCalculator && <button
    onClick={handleSendToCalc}
    className="flex items-center space-x-2 px-3.5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-amber-600/20 hover:from-amber-700 hover:to-amber-800 transition"
  >
              <span>Matoni Hisoblash</span>
              <ArrowRight className="w-4 h-4" />
            </button>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {
    /* Left Column: Visual Body Guide & Inputs Form */
  }
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
          <form onSubmit={handleSave} className="space-y-6">
            {
    /* Client Basic Details */
  }
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Mijoz Ism-Familiyasi *</label>
                <input
    type="text"
    required
    placeholder="Ism Familiya"
    value={clientName}
    onChange={(e) => setClientName(e.target.value)}
    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500/40"
  />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Telefon Raqami</label>
                <input
    type="tel"
    placeholder="+998 90 000 00 00"
    value={clientPhone}
    onChange={(e) => setClientPhone(e.target.value)}
    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500/40"
  />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Libos Turi</label>
                <select
    value={dressType}
    onChange={(e) => setDressType(e.target.value)}
    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500/40"
  >
                  <option value="Ayollar ko'ylagi">Ayollar ko'ylagi</option>
                  <option value="Oqshom libosi">Oqshom libosi</option>
                  <option value="Milliy ko'ylak (Atlas)">Milliy ko'ylak (Atlas)</option>
                  <option value="Kostyum-shim">Kostyum-shim</option>
                  <option value="Klassik yubka">Klassik yubka</option>
                  <option value="Klassik shim">Klassik shim</option>
                  <option value="Palto / Jaket">Palto / Jaket</option>
                </select>
              </div>
            </div>

            {
    /* Visual Mannequin + Body Measurement Grid */
  }
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2 border-t border-stone-100">
              {
    /* Mannequin Graphic */
  }
              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="relative w-44 h-80">
                  {
    /* Stylized Silhouette */
  }
                  <svg viewBox="0 0 200 400" className="w-full h-full stroke-stone-300 fill-none" strokeWidth="2">
                    {
    /* Head */
  }
                    <circle cx="100" cy="35" r="16" />
                    {
    /* Neck */
  }
                    <line x1="96" y1="51" x2="96" y2="70" />
                    <line x1="104" y1="51" x2="104" y2="70" />
                    {
    /* Shoulders */
  }
                    <path d="M 60 80 Q 100 70 140 80" />
                    {
    /* Bust line */
  }
                    <path d="M 70 115 Q 100 125 130 115" strokeDasharray="3,3" />
                    {
    /* Waist line */
  }
                    <path d="M 75 160 Q 100 166 125 160" strokeDasharray="3,3" />
                    {
    /* Hip line */
  }
                    <path d="M 68 210 Q 100 220 132 210" strokeDasharray="3,3" />
                    {
    /* Torso contour */
  }
                    <path d="M 60 80 C 58 115, 75 160, 75 160 C 65 190, 68 210, 72 260 L 75 380" />
                    <path d="M 140 80 C 142 115, 125 160, 125 160 C 135 190, 132 210, 128 260 L 125 380" />
                    {
    /* Arms */
  }
                    <path d="M 60 80 L 40 180 L 42 220" />
                    <path d="M 140 80 L 160 180 L 158 220" />
                  </svg>

                  {
    /* Interactive Measurement Pinpoints */
  }
                  <div
    onClick={() => setActiveField("bust")}
    className={`absolute top-[110px] left-[70px] px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${activeField === "bust" ? "bg-amber-600 text-white ring-4 ring-amber-300/50 scale-110" : "bg-white text-stone-700 shadow-sm border border-stone-200"}`}
  >
                    Ko'krak: {bust} sm
                  </div>

                  <div
    onClick={() => setActiveField("waist")}
    className={`absolute top-[155px] left-[75px] px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${activeField === "waist" ? "bg-amber-600 text-white ring-4 ring-amber-300/50 scale-110" : "bg-white text-stone-700 shadow-sm border border-stone-200"}`}
  >
                    Bel: {waist} sm
                  </div>

                  <div
    onClick={() => setActiveField("hips")}
    className={`absolute top-[205px] left-[68px] px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${activeField === "hips" ? "bg-amber-600 text-white ring-4 ring-amber-300/50 scale-110" : "bg-white text-stone-700 shadow-sm border border-stone-200"}`}
  >
                    Bo'ksa: {hips} sm
                  </div>

                  <div
    onClick={() => setActiveField("sleeveLength")}
    className={`absolute top-[170px] right-[5px] px-1.5 py-0.5 rounded-md text-[9px] font-bold cursor-pointer transition ${activeField === "sleeveLength" ? "bg-amber-600 text-white ring-2 ring-amber-300" : "bg-stone-200 text-stone-700"}`}
  >
                    Yeng: {sleeveLength}
                  </div>
                </div>

                <div className="text-[11px] text-stone-500 mt-2 text-center">
                  Nuqtani tanlang yoki o'ng tomondagi qatorlarni to'ldiring
                </div>
              </div>

              {
    /* Number Inputs Grid */
  }
              <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className={activeField === "height" ? "ring-2 ring-amber-500 rounded-xl p-1" : ""}>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Bo'y (Height)</label>
                  <div className="relative">
                    <input
    type="number"
    value={height}
    onFocus={() => setActiveField("height")}
    onChange={(e) => setHeight(Number(e.target.value) || "")}
    className="w-full px-3 py-2 pr-8 rounded-xl border border-stone-200 text-xs font-mono font-bold"
  />
                    <span className="absolute right-2.5 top-2 text-[10px] text-stone-400">sm</span>
                  </div>
                </div>

                <div className={activeField === "bust" ? "ring-2 ring-amber-500 rounded-xl p-1" : ""}>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Ko'krak Aylanasi *</label>
                  <div className="relative">
                    <input
    type="number"
    value={bust}
    onFocus={() => setActiveField("bust")}
    onChange={(e) => setBust(Number(e.target.value) || "")}
    className="w-full px-3 py-2 pr-8 rounded-xl border border-stone-200 text-xs font-mono font-bold text-amber-900 bg-amber-50/30"
  />
                    <span className="absolute right-2.5 top-2 text-[10px] text-stone-400">sm</span>
                  </div>
                </div>

                <div className={activeField === "waist" ? "ring-2 ring-amber-500 rounded-xl p-1" : ""}>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Bel Aylanasi *</label>
                  <div className="relative">
                    <input
    type="number"
    value={waist}
    onFocus={() => setActiveField("waist")}
    onChange={(e) => setWaist(Number(e.target.value) || "")}
    className="w-full px-3 py-2 pr-8 rounded-xl border border-stone-200 text-xs font-mono font-bold text-amber-900 bg-amber-50/30"
  />
                    <span className="absolute right-2.5 top-2 text-[10px] text-stone-400">sm</span>
                  </div>
                </div>

                <div className={activeField === "hips" ? "ring-2 ring-amber-500 rounded-xl p-1" : ""}>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Bo'ksa Aylanasi *</label>
                  <div className="relative">
                    <input
    type="number"
    value={hips}
    onFocus={() => setActiveField("hips")}
    onChange={(e) => setHips(Number(e.target.value) || "")}
    className="w-full px-3 py-2 pr-8 rounded-xl border border-stone-200 text-xs font-mono font-bold text-amber-900 bg-amber-50/30"
  />
                    <span className="absolute right-2.5 top-2 text-[10px] text-stone-400">sm</span>
                  </div>
                </div>

                <div className={activeField === "shoulder" ? "ring-2 ring-amber-500 rounded-xl p-1" : ""}>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Yelka Kengligi</label>
                  <div className="relative">
                    <input
    type="number"
    value={shoulder}
    onFocus={() => setActiveField("shoulder")}
    onChange={(e) => setShoulder(Number(e.target.value) || "")}
    className="w-full px-3 py-2 pr-8 rounded-xl border border-stone-200 text-xs font-mono font-bold"
  />
                    <span className="absolute right-2.5 top-2 text-[10px] text-stone-400">sm</span>
                  </div>
                </div>

                <div className={activeField === "sleeveLength" ? "ring-2 ring-amber-500 rounded-xl p-1" : ""}>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Yeng Uzunligi</label>
                  <div className="relative">
                    <input
    type="number"
    value={sleeveLength}
    onFocus={() => setActiveField("sleeveLength")}
    onChange={(e) => setSleeveLength(Number(e.target.value) || "")}
    className="w-full px-3 py-2 pr-8 rounded-xl border border-stone-200 text-xs font-mono font-bold"
  />
                    <span className="absolute right-2.5 top-2 text-[10px] text-stone-400">sm</span>
                  </div>
                </div>

                <div className={activeField === "dressLength" ? "ring-2 ring-amber-500 rounded-xl p-1" : ""}>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Libos Uzunligi</label>
                  <div className="relative">
                    <input
    type="number"
    value={dressLength}
    onFocus={() => setActiveField("dressLength")}
    onChange={(e) => setDressLength(Number(e.target.value) || "")}
    className="w-full px-3 py-2 pr-8 rounded-xl border border-stone-200 text-xs font-mono font-bold"
  />
                    <span className="absolute right-2.5 top-2 text-[10px] text-stone-400">sm</span>
                  </div>
                </div>

                <div className={activeField === "neck" ? "ring-2 ring-amber-500 rounded-xl p-1" : ""}>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Yoqa Aylanasi</label>
                  <div className="relative">
                    <input
    type="number"
    value={neck}
    onFocus={() => setActiveField("neck")}
    onChange={(e) => setNeck(Number(e.target.value) || "")}
    className="w-full px-3 py-2 pr-8 rounded-xl border border-stone-200 text-xs font-mono font-bold"
  />
                    <span className="absolute right-2.5 top-2 text-[10px] text-stone-400">sm</span>
                  </div>
                </div>

                <div className={activeField === "wrist" ? "ring-2 ring-amber-500 rounded-xl p-1" : ""}>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Bilak Aylanasi</label>
                  <div className="relative">
                    <input
    type="number"
    value={wrist}
    onFocus={() => setActiveField("wrist")}
    onChange={(e) => setWrist(Number(e.target.value) || "")}
    className="w-full px-3 py-2 pr-8 rounded-xl border border-stone-200 text-xs font-mono font-bold"
  />
                    <span className="absolute right-2.5 top-2 text-[10px] text-stone-400">sm</span>
                  </div>
                </div>
              </div>
            </div>

            {
    /* Standard Size Auto-Estimation Banner */
  }
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span className="text-xs text-amber-900 font-medium">
                  Avtomatik aniqlangan standart razmer:
                </span>
              </div>
              <span className="text-xs font-bold text-amber-950 bg-white px-2.5 py-1 rounded-lg border border-amber-300">
                {calculateStandardSize(Number(bust), Number(hips))}
              </span>
            </div>

            {
    /* Notes */
  }
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tikuvchi Maxsus Qaydlari (Fason erkinligi, qadash qulayligi)
              </label>
              <textarea
    rows={2}
    placeholder="Masalan: Ko'krak qismiga 2 sm erkinlik qo'shilsin, belbog'li..."
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500/40"
  />
            </div>

            {
    /* Submit */
  }
            <button
    type="submit"
    disabled={isLoading}
    className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-2 transition disabled:opacity-50"
  >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>{isLoading ? "Saqlanmoqda..." : "O'lchovni Saqlash"}</span>
            </button>
          </form>
        </div>

        {
    /* Right Column: Saved Measurements Cards List */
  }
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-stone-900">
                Saqlangan O'lchovlar ({measurementsList.length})
              </h3>
            </div>

            {
    /* Search */
  }
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
    type="text"
    placeholder="Mijoz ismi yoki telefoni..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs"
  />
            </div>

            {
    /* List */
  }
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filtered.map((item) => <div
    key={item.id}
    onClick={() => handleSelectRecord(item)}
    className="p-3 rounded-2xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/30 cursor-pointer transition space-y-1.5"
  >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900">{item.clientName}</span>
                    <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-medium">
                      {item.dressType}
                    </span>
                  </div>

                  <div className="text-[11px] text-stone-500 grid grid-cols-3 gap-1 pt-1 font-mono">
                    <span>Ko'krak: {item.bust}</span>
                    <span>Bel: {item.waist}</span>
                    <span>Bo'ksa: {item.hips}</span>
                  </div>

                  {item.clientPhone && <div className="text-[10px] text-stone-400 flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{item.clientPhone}</span>
                    </div>}
                </div>)}

              {filtered.length === 0 && <div className="text-center py-8 text-stone-400 text-xs">
                  O'lchovlar topilmadi
                </div>}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export {
  MeasurementTool
};
