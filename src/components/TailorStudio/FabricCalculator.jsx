import React, { useState } from "react";
import { useToast } from "../Toast";
import { Calculator } from "lucide-react";
const FabricCalculator = ({ initialMeasurements }) => {
  const { showToast } = useToast();
  const [garmentType, setGarmentType] = useState(
    initialMeasurements?.dressType === "Oqshom libosi" ? "oqshom_libosi" : initialMeasurements?.dressType === "Milliy ko'ylak (Atlas)" ? "milliy_libos" : "koylak_a_siluet"
  );
  const [fabricWidth, setFabricWidth] = useState(140);
  const [height, setHeight] = useState(initialMeasurements?.height || 168);
  const [bust, setBust] = useState(initialMeasurements?.bust || 92);
  const [waist, setWaist] = useState(initialMeasurements?.waist || 70);
  const [hips, setHips] = useState(initialMeasurements?.hips || 98);
  const [garmentLength, setGarmentLength] = useState(initialMeasurements?.dressLength || 115);
  const [sleeveLength, setSleeveLength] = useState(initialMeasurements?.sleeveLength || 58);
  const [hasLining, setHasLining] = useState(true);
  const [patternType, setPatternType] = useState("plain");
  const [ruffleCount, setRuffleCount] = useState(2);
  const [pricePerMeter, setPricePerMeter] = useState(75e3);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState(null);
  const handleCalculate = async (e) => {
    if (e) e.preventDefault();
    setIsCalculating(true);
    try {
      const payload = {
        garmentType,
        fabricWidth,
        height,
        bust,
        waist,
        hips,
        sleeveLength,
        garmentLength,
        hasLining,
        patternType,
        ruffleCount,
        pricePerMeter
      };
      const res = await fetch("/api/calculate-fabric", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.result);
      showToast({
        type: "success",
        title: "Hisoblandi!",
        message: `Ushbu libos uchun ${data.result.totalMainFabric} metr mato zarur.`
      });
    } catch (err) {
      showToast({
        type: "error",
        title: "Xatolik",
        message: err.message || "Hisoblashda xatolik yuz berdi"
      });
    } finally {
      setIsCalculating(false);
    }
  };
  React.useEffect(() => {
    handleCalculate();
  }, []);
  return <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-amber-700 mb-1">
          <Calculator className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Tikuvchilik Geometriyasi</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-stone-900">
          Mato Sarfi va Xarajat Kalkulyatori
        </h1>
        <p className="text-xs text-stone-500 mt-1 max-w-2xl">
          Libos fasoni, mato eni, mijoz qaddi-qomati va chok zaxiralarini hisobga olgan holda zarur bo'lgan mato metrini va taxminiy narxini aniq hisoblab bering.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {
    /* Form Controls */
  }
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5">
          <form onSubmit={handleCalculate} className="space-y-4">
            {
    /* Garment Type */
  }
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Libos Fasoni va Turi *
              </label>
              <select
    value={garmentType}
    onChange={(e) => setGarmentType(e.target.value)}
    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-amber-500/40"
  >
                <option value="koylak_a_siluet">👗 Ayollar ko'ylagi (Keng A-siluet)</option>
                <option value="koylak_oddiy">👗 Klassik to'g'ri ko'ylak (Futlyar)</option>
                <option value="koylak_quyosh">💃 Quyosh etakli libos (Doira etak)</option>
                <option value="oqshom_libosi">✨ Kelin ko'ylak / Oqshom libosi (Qat-qat ruffles)</option>
                <option value="milliy_libos">👑 Milliy libos (Xonatlas / Adras / Bekasab)</option>
                <option value="kostyum_shim">👔 Kostyum va shim (2 qismli)</option>
                <option value="shim">👖 Klassik shim</option>
                <option value="yubka">🩰 Klassik yoki trapetsiya yubka</option>
                <option value="palto">🧥 Palto / Trench-kot</option>
                <option value="rubashka">👔 Erkaklar klassik ko'ylagi</option>
              </select>
            </div>

            {
    /* Fabric Width & Pattern properties */
  }
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">Mato Eni (Width)</label>
                <select
    value={fabricWidth}
    onChange={(e) => setFabricWidth(Number(e.target.value))}
    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
  >
                  <option value={90}>90 sm (Tor xonatlas)</option>
                  <option value={110}>110 sm (Adras, shoyi ipak)</option>
                  <option value={140}>140 sm (Kostyumbop, jun mato)</option>
                  <option value={150}>150 sm (Standart kenglik)</option>
                  <option value={160}>160 sm (Keng trikotaj/paxta)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">Naqsh & Ip Yo'nalishi</label>
                <select
    value={patternType}
    onChange={(e) => setPatternType(e.target.value)}
    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
  >
                  <option value="plain">Oddiy / Bir xil silliq (0%)</option>
                  <option value="print_match">Katak / Katta gulli (+15%)</option>
                  <option value="pile_velvet">Baxmal / Tivit yo'nalishi (+20%)</option>
                </select>
              </div>
            </div>

            {
    /* Dimensions */
  }
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-stone-100">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Libos Uzunligi</label>
                <div className="relative">
                  <input
    type="number"
    value={garmentLength}
    onChange={(e) => setGarmentLength(Number(e.target.value))}
    className="w-full px-3 py-1.5 pr-7 rounded-xl border border-stone-200 text-xs font-mono font-bold"
  />
                  <span className="absolute right-2 top-1.5 text-[10px] text-stone-400">sm</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Yeng Uzunligi</label>
                <div className="relative">
                  <input
    type="number"
    value={sleeveLength}
    onChange={(e) => setSleeveLength(Number(e.target.value))}
    className="w-full px-3 py-1.5 pr-7 rounded-xl border border-stone-200 text-xs font-mono font-bold"
  />
                  <span className="absolute right-2 top-1.5 text-[10px] text-stone-400">sm</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Bo'ksa (Hips)</label>
                <div className="relative">
                  <input
    type="number"
    value={hips}
    onChange={(e) => setHips(Number(e.target.value))}
    className="w-full px-3 py-1.5 pr-7 rounded-xl border border-stone-200 text-xs font-mono font-bold"
  />
                  <span className="absolute right-2 top-1.5 text-[10px] text-stone-400">sm</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Bel (Waist)</label>
                <div className="relative">
                  <input
    type="number"
    value={waist}
    onChange={(e) => setWaist(Number(e.target.value))}
    className="w-full px-3 py-1.5 pr-7 rounded-xl border border-stone-200 text-xs font-mono font-bold"
  />
                  <span className="absolute right-2 top-1.5 text-[10px] text-stone-400">sm</span>
                </div>
              </div>
            </div>

            {
    /* Additional details */
  }
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center space-x-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <input
    type="checkbox"
    id="hasLining"
    checked={hasLining}
    onChange={(e) => setHasLining(e.target.checked)}
    className="w-4 h-4 accent-amber-600 rounded"
  />
                <label htmlFor="hasLining" className="text-xs font-semibold text-stone-800 cursor-pointer">
                  Astar (Lining) qo'shish
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">1 metr mato narxi (so'm)</label>
                <input
    type="number"
    step="5000"
    value={pricePerMeter}
    onChange={(e) => setPricePerMeter(Number(e.target.value))}
    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono font-semibold"
  />
              </div>
            </div>

            <button
    type="submit"
    disabled={isCalculating}
    className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-2 transition disabled:opacity-50"
  >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>{isCalculating ? "Hisoblanmoqda..." : "Mato Sarfini Qayta Hisoblash"}</span>
            </button>
          </form>
        </div>

        {
    /* Calculation Result Display */
  }
        <div className="lg:col-span-5 space-y-4">
          {result && <div className="bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 text-white rounded-3xl p-6 shadow-xl space-y-5 border border-amber-900/50">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-300">
                  Hisoblash Natijasi
                </span>
                <span className="text-[11px] bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full border border-amber-400/30">
                  Eni: {fabricWidth} sm
                </span>
              </div>

              {
    /* Main meters callout */
  }
              <div className="text-center py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
                <div className="text-xs text-stone-300 mb-1">Zarur Asosiy Mato Miqdori:</div>
                <div className="text-4xl font-serif font-bold text-amber-300 tracking-tight">
                  {result.totalMainFabric} <span className="text-xl font-sans text-stone-300">metr</span>
                </div>
                <div className="text-[11px] text-stone-400 mt-1 max-w-xs mx-auto">
                  {result.formulaDescription}
                </div>
              </div>

              {
    /* Secondary details */
  }
              <div className="space-y-2 text-xs">
                {hasLining && <div className="flex justify-between items-center p-2.5 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-stone-300">Astarlik mato:</span>
                    <span className="font-bold text-white font-mono">{result.totalLining} metr</span>
                  </div>}

                <div className="flex justify-between items-center p-2.5 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-stone-300">Dublyaj / Flizelin:</span>
                  <span className="font-semibold text-stone-200">{result.interfacingNeeded}</span>
                </div>

                {pricePerMeter > 0 && <div className="flex justify-between items-center p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <span className="text-amber-200">Taxminiy mato qiymati:</span>
                    <span className="font-bold text-amber-300 font-mono text-sm">
                      {result.estimatedCost.toLocaleString()} so'm
                    </span>
                  </div>}
              </div>

              {
    /* Professional Notes */
  }
              <div className="space-y-1.5 pt-2 border-t border-stone-800">
                <span className="text-[11px] font-bold uppercase text-stone-400 tracking-wider">
                  Tikuvchi Uchun Tavsiyalar:
                </span>
                <ul className="space-y-1 text-[11px] text-stone-300">
                  {result.details.map((d, i) => <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span>{d}</span>
                    </li>)}
                  <li className="flex items-start space-x-1.5">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>
                      Tabiiy ipak va paxta matolarni bichishdan oldin dazmol bilan namlab (dekatiprovka) qisqartirish tavsiya etiladi.
                    </span>
                  </li>
                </ul>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
export {
  FabricCalculator
};
