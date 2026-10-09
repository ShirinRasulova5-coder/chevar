import { useState, useRef } from "react";
import { useToast } from "../Toast";
import {
  Scissors,
  Download,
  Printer,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Info
} from "lucide-react";
const PatternMaker = ({ user, initialMeasurements }) => {
  const { showToast } = useToast();
  const svgRef = useRef(null);
  const [patternType, setPatternType] = useState("dress_bodice");
  const [bust, setBust] = useState(initialMeasurements?.bust || 92);
  const [waist, setWaist] = useState(initialMeasurements?.waist || 70);
  const [hips, setHips] = useState(initialMeasurements?.hips || 98);
  const [shoulder, setShoulder] = useState(initialMeasurements?.shoulder || 38);
  const [garmentLength, setGarmentLength] = useState(initialMeasurements?.dressLength || 105);
  const [sleeveLength, setSleeveLength] = useState(initialMeasurements?.sleeveLength || 58);
  const [neck, setNeck] = useState(initialMeasurements?.neck || 36);
  const [easeAllowance, setEaseAllowance] = useState(2);
  const [seamAllowance, setSeamAllowance] = useState(1.5);
  const [showSeamAllowance, setShowSeamAllowance] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const halfBust = bust / 2;
  const halfWaist = waist / 2;
  const halfHips = hips / 2;
  const neckWidth = neck / 6 + 0.5;
  const backNeckDepth = 2;
  const frontNeckDepth = neckWidth + 1.5;
  const armholeDepth = bust / 10 + 10.5 + easeAllowance * 0.5;
  const backWaistLength = 40;
  const backWidth = bust / 8 + 5.5 + easeAllowance * 0.25;
  const armholeWidth = bust / 8 - 1.5 + easeAllowance * 0.5;
  const frontChestWidth = halfBust + easeAllowance - (backWidth + armholeWidth);
  const quarterBust = bust / 4 + easeAllowance;
  const quarterWaist = waist / 4 + 0.5;
  const quarterHips = hips / 4 + 1;
  const totalWaistSuppression = (bust + easeAllowance * 2 - (waist + easeAllowance)) / 2;
  const sideDart = Math.min(3.5, totalWaistSuppression * 0.4);
  const backDart = Math.min(3, totalWaistSuppression * 0.35);
  const frontDart = Math.min(2.5, totalWaistSuppression * 0.25);
  const handleExportPng = () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 900;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const link = document.createElement("a");
      link.download = `andoza-${patternType}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      showToast({
        type: "success",
        title: "Andoza yuklab olindi",
        message: "Lekala chizmasi PNG formatida qurilmangizga saqlandi."
      });
    };
  };
  const handlePrint = () => {
    window.print();
  };
  return <div className="max-w-7xl mx-auto px-2 sm:px-6 py-4">
      {
    /* Top Banner */
  }
      <div className="bg-white rounded-3xl border border-stone-200 p-5 mb-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-700 mb-1">
            <Scissors className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Patrondis Uslubida Andoza Konstruktori
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Professional Lekala & Bichish Andozalari
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            O'lchovlaringizni kiriting va tizim millimeter aniqlikdagi andoza (lekala) chizmasini, chok haqqi va vitochkalarini avtomatik chiqarib beradi.
          </p>
        </div>

        {
    /* Action buttons */
  }
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
    onClick={handleExportPng}
    className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-md transition"
  >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Andozani Yuklab Olish (PNG)</span>
          </button>
          <button
    onClick={handlePrint}
    title="Chop etish"
    className="p-2 border border-stone-200 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition"
  >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {
    /* Pattern Type Selector (Patrondis App Styles) */
  }
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-5">
        {[
    { id: "dress_bodice", name: "Ko'ylak Asos Andozasi", sub: "Old & Ort Bo'lak", icon: "👗" },
    { id: "sleeve", name: "Klassik Yeng Andozasi", sub: "Yeng o'miz qadash", icon: "🧤" },
    { id: "skirt", name: "Qalam / To'g'ri Yubka", sub: "Old, ort, vitochka", icon: "🩰" },
    { id: "pants", name: "Klassik Shim Andozasi", sub: "Old & Ort balandlik", icon: "👖" },
    { id: "circle_skirt", name: "Quyosh / A-Siluet Etak", sub: "Doira radius hisobi", icon: "💃" }
  ].map((item) => <button
    key={item.id}
    onClick={() => setPatternType(item.id)}
    className={`p-3 rounded-2xl border text-left transition flex items-center space-x-2.5 ${patternType === item.id ? "border-amber-600 bg-amber-50/70 text-amber-950 ring-2 ring-amber-500/20 font-semibold shadow-xs" : "border-stone-200 hover:border-stone-300 bg-white text-stone-700"}`}
  >
            <span className="text-xl flex-shrink-0">{item.icon}</span>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">{item.name}</div>
              <div className="text-[10px] text-stone-500 truncate">{item.sub}</div>
            </div>
          </button>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {
    /* Left Settings & Measurements Input */
  }
        <div className="lg:col-span-4 space-y-4">
          {
    /* Measurements Panel */
  }
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                O'lchov Parametrlari (sm)
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                Aniq Masshtab
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Ko'krak (Bust)</label>
                <div className="relative">
                  <input
    type="number"
    value={bust}
    onChange={(e) => setBust(Number(e.target.value))}
    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 font-mono font-bold text-amber-950 bg-amber-50/30"
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
    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 font-mono font-bold text-amber-950 bg-amber-50/30"
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
    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 font-mono font-bold text-amber-950 bg-amber-50/30"
  />
                  <span className="absolute right-2 top-1.5 text-[10px] text-stone-400">sm</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Yelka Kengligi</label>
                <div className="relative">
                  <input
    type="number"
    value={shoulder}
    onChange={(e) => setShoulder(Number(e.target.value))}
    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 font-mono font-bold"
  />
                  <span className="absolute right-2 top-1.5 text-[10px] text-stone-400">sm</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Yoqa Aylanasi</label>
                <div className="relative">
                  <input
    type="number"
    value={neck}
    onChange={(e) => setNeck(Number(e.target.value))}
    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 font-mono font-bold"
  />
                  <span className="absolute right-2 top-1.5 text-[10px] text-stone-400">sm</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Libos Uzunligi</label>
                <div className="relative">
                  <input
    type="number"
    value={garmentLength}
    onChange={(e) => setGarmentLength(Number(e.target.value))}
    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 font-mono font-bold"
  />
                  <span className="absolute right-2 top-1.5 text-[10px] text-stone-400">sm</span>
                </div>
              </div>
            </div>

            {
    /* Pattern Construction Controls */
  }
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <div>
                <div className="flex justify-between text-xs text-stone-600 mb-1">
                  <span>Erkinlik Haqqi (Ease):</span>
                  <span className="font-bold text-amber-900 font-mono">+{easeAllowance} sm</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  {[
    { val: 0, label: "Yopishqoq" },
    { val: 2, label: "Qulay" },
    { val: 4, label: "Erkin" }
  ].map((e) => <button
    key={e.val}
    onClick={() => setEaseAllowance(e.val)}
    className={`py-1 rounded-lg border font-medium ${easeAllowance === e.val ? "bg-amber-600 text-white border-amber-600 font-bold" : "bg-stone-50 border-stone-200 text-stone-700"}`}
  >
                      {e.label}
                    </button>)}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-stone-600 mb-1">
                  <span>Chok Haqqi (Seam Allowance):</span>
                  <span className="font-bold text-stone-900 font-mono">{seamAllowance} sm</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[11px]">
                  {[0, 1, 1.5, 2].map((s) => <button
    key={s}
    onClick={() => setSeamAllowance(s)}
    className={`py-1 rounded-lg border font-medium ${seamAllowance === s ? "bg-stone-900 text-white font-bold" : "bg-stone-50 border-stone-200 text-stone-700"}`}
  >
                      {s === 0 ? "0 sm" : `${s} sm`}
                    </button>)}
                </div>
              </div>

              {
    /* Toggles */
  }
              <div className="space-y-2 pt-2 text-xs">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
    type="checkbox"
    checked={showSeamAllowance}
    onChange={(e) => setShowSeamAllowance(e.target.checked)}
    className="w-4 h-4 accent-amber-600 rounded"
  />
                  <span className="text-stone-700 font-medium">Chok haqqi chiziqlarini ko'rsatish (qizil nuqtali)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
    type="checkbox"
    checked={showDimensions}
    onChange={(e) => setShowDimensions(e.target.checked)}
    className="w-4 h-4 accent-amber-600 rounded"
  />
                  <span className="text-stone-700 font-medium">Santimetr o'lcham chiziqlarini ko'rsatish</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
    type="checkbox"
    checked={showGrid}
    onChange={(e) => setShowGrid(e.target.checked)}
    className="w-4 h-4 accent-amber-600 rounded"
  />
                  <span className="text-stone-700 font-medium">Millimetrovka kataklarini ko'rsatish</span>
                </label>
              </div>
            </div>
          </div>

          {
    /* Formulas and Math Breakdown */
  }
          <div className="bg-amber-50/70 rounded-3xl border border-amber-200 p-5 text-xs space-y-2.5">
            <div className="flex items-center space-x-1.5 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Bichish Formulalari Hisobi:</span>
            </div>

            <div className="space-y-1.5 text-stone-700 font-mono text-[11px]">
              <div className="flex justify-between">
                <span>Ort bo'yin kengligi:</span>
                <span className="font-bold">{neckWidth.toFixed(1)} sm</span>
              </div>
              <div className="flex justify-between">
                <span>O'miz chuqurligi:</span>
                <span className="font-bold">{armholeDepth.toFixed(1)} sm</span>
              </div>
              <div className="flex justify-between">
                <span>Old 1/4 ko'krak eni:</span>
                <span className="font-bold">{quarterBust.toFixed(1)} sm</span>
              </div>
              <div className="flex justify-between">
                <span>1/4 bel + vitochka:</span>
                <span className="font-bold">{quarterWaist.toFixed(1)} sm</span>
              </div>
              <div className="flex justify-between">
                <span>1/4 bo'ksa kengligi:</span>
                <span className="font-bold">{quarterHips.toFixed(1)} sm</span>
              </div>
            </div>

            <p className="text-[10px] text-amber-800 pt-1 border-t border-amber-200">
              * Ushbu hisob-kitoblar xalqaro Müller va Konstruksiyalash me'yorlari asosida mato elastikligi va chok zaxiralarini hisobga oladi.
            </p>
          </div>
        </div>

        {
    /* Right Blueprint Canvas (Interactive Vector Sewing Pattern) */
  }
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-3">
          {
    /* Canvas Controls Header */
  }
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-stone-900">
                {patternType === "dress_bodice" && "Ko'ylak Asos Andozasi (Old va Ort Bo'lak)"}
                {patternType === "sleeve" && "Klassik Yeng Lekalasi (O'miz va Bilak)"}
                {patternType === "skirt" && "Klassik Qalam Yubka Andozasi"}
                {patternType === "pants" && "Klassik Shim Andozasi (Old va Ort)"}
                {patternType === "circle_skirt" && "Quyosh Doira Etak Andozasi"}
              </span>
              <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                Masshtab: 1:{Math.round(2 / zoomLevel)}
              </span>
            </div>

            {
    /* Zoom Controls */
  }
            <div className="flex items-center space-x-1">
              <button
    onClick={() => setZoomLevel(Math.max(0.7, zoomLevel - 0.1))}
    className="p-1.5 border border-stone-200 rounded-lg hover:bg-stone-50"
    title="Kichraytirish"
  >
                <ZoomOut className="w-3.5 h-3.5 text-stone-600" />
              </button>
              <button
    onClick={() => setZoomLevel(1)}
    className="text-[10px] font-mono px-2 py-1 border border-stone-200 rounded-lg"
  >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
    onClick={() => setZoomLevel(Math.min(1.5, zoomLevel + 0.1))}
    className="p-1.5 border border-stone-200 rounded-lg hover:bg-stone-50"
    title="Kattalashtirish"
  >
                <ZoomIn className="w-3.5 h-3.5 text-stone-600" />
              </button>
            </div>
          </div>

          {
    /* Scaled Vector Blueprint Canvas */
  }
          <div className="relative w-full overflow-auto bg-[#fafaf9] rounded-2xl border border-stone-200 flex items-center justify-center p-4 min-h-[580px]">
            <svg
    ref={svgRef}
    viewBox="0 0 900 680"
    className="w-full max-w-[850px] transition-transform duration-200 select-none"
    style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center top" }}
  >
              <defs>
                {
    /* Millimetrovka Grid pattern */
  }
                <pattern id="patternGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e7e5e4" strokeWidth="0.8" />
                </pattern>
                {
    /* Marker arrow */
  }
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#78716c" />
                </marker>
              </defs>

              {
    /* Background Grid */
  }
              {showGrid && <rect width="900" height="680" fill="url(#patternGrid)" />}

              {
    /* RENDER PATTERN ACCORDING TO SELECTED TYPE */
  }
              {patternType === "dress_bodice" && <g id="dress_bodice_group">
                  {
    /* ===================== ORT BO'LAK (BACK BODICE) ===================== */
  }
                  <g transform="translate(60, 40)">
                    {
    /* Header Label */
  }
                    <text x="120" y="-15" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#292524">
                      ORT BO'LAK (BACK) • 1/4
                    </text>
                    <text x="120" y="2" textAnchor="middle" fontSize="10" fill="#78716c">
                      O'rta chiziq bukiq (Fold ↕)
                    </text>

                    {
    /* Main Pattern Path */
  }
                    <path
    d={`
                        M 0,0
                        Q ${neckWidth * 2.5},${backNeckDepth * 2} ${neckWidth * 3.5},${backNeckDepth * 2}
                        L ${backWidth * 5.5},${armholeDepth * 1.8}
                        C ${backWidth * 5.8},${armholeDepth * 3.8} ${quarterBust * 5.2},${armholeDepth * 4.8} ${quarterBust * 5.5},${armholeDepth * 5.5}
                        L ${(quarterWaist + backDart) * 5.2},220
                        L ${quarterHips * 5.5},340
                        L ${quarterHips * 5.6},520
                        L 0,520
                        Z
                      `}
    fill="#ffffff"
    fillOpacity="0.85"
    stroke="#1c1917"
    strokeWidth="2.5"
  />

                    {
    /* Seam Allowance dashed outline */
  }
                    {showSeamAllowance && <path
    d={`
                          M -8,-8
                          Q ${neckWidth * 2.5},${backNeckDepth * 2 - 8} ${neckWidth * 3.5 + 8},${backNeckDepth * 2 - 8}
                          L ${backWidth * 5.5 + 8},${armholeDepth * 1.8 - 8}
                          C ${backWidth * 5.8 + 10},${armholeDepth * 3.8} ${quarterBust * 5.2 + 10},${armholeDepth * 4.8} ${quarterBust * 5.5 + 8},${armholeDepth * 5.5 + 8}
                          L ${(quarterWaist + backDart) * 5.2 + 8},220
                          L ${quarterHips * 5.5 + 8},340
                          L ${quarterHips * 5.6 + 8},535
                          L -8,535
                          Z
                        `}
    fill="none"
    stroke="#dc2626"
    strokeWidth="1.2"
    strokeDasharray="4,4"
  />}

                    {
    /* Vitochka (Dart) on Back */
  }
                    <path
    d="M 90,140 L 98,220 L 82,220 Z M 90,300 L 98,220 L 82,220 Z"
    fill="#f5f5f4"
    stroke="#44403c"
    strokeWidth="1.6"
  />
                    <line x1="90" y1="130" x2="90" y2="310" stroke="#a8a29e" strokeDasharray="3,3" strokeWidth="1" />

                    {
    /* Chest and Waist Guide Lines */
  }
                    <line x1="0" y1={armholeDepth * 5.5} x2={quarterBust * 5.5} y2={armholeDepth * 5.5} stroke="#a8a29e" strokeDasharray="3,3" strokeWidth="1" />
                    <line x1="0" y1="220" x2={(quarterWaist + backDart) * 5.2} y2="220" stroke="#a8a29e" strokeDasharray="3,3" strokeWidth="1" />
                    <line x1="0" y1="340" x2={quarterHips * 5.5} y2="340" stroke="#a8a29e" strokeDasharray="3,3" strokeWidth="1" />

                    {
    /* Grainline Arrow */
  }
                    <line x1="45" y1="160" x2="45" y2="400" stroke="#57534e" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                    <text x="50" y="280" fontSize="10" fill="#57534e" transform="rotate(-90 50 280)">Ulush ipi (Grainline ↕)</text>

                    {
    /* Dimension Markers */
  }
                    {showDimensions && <>
                        <text x="10" y={armholeDepth * 5.5 - 5} fontSize="10" fill="#78716c">Ko'krak chizig'i</text>
                        <text x="10" y="215" fontSize="10" fill="#78716c">Bel chizig'i</text>
                        <text x="10" y="335" fontSize="10" fill="#78716c">Bo'ksa chizig'i</text>
                        <text x={quarterHips * 5.5 - 30} y="515" fontSize="10" fill="#047857" fontWeight="bold">Etak: {quarterHips.toFixed(1)} sm</text>
                      </>}
                  </g>

                  {
    /* ===================== OLD BO'LAK (FRONT BODICE) ===================== */
  }
                  <g transform="translate(480, 40)">
                    {
    /* Header Label */
  }
                    <text x="130" y="-15" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#292524">
                      OLD BO'LAK (FRONT) • 1/4
                    </text>
                    <text x="130" y="2" textAnchor="middle" fontSize="10" fill="#78716c">
                      O'rta chiziq bukiq (Center Front)
                    </text>

                    {
    /* Main Pattern Path */
  }
                    <path
    d={`
                        M 0,${frontNeckDepth * 4.5}
                        Q ${neckWidth * 2},0 ${neckWidth * 4.2},0
                        L ${backWidth * 5.4},${armholeDepth * 1.6}
                        C ${backWidth * 5.6},${armholeDepth * 3.6} ${quarterBust * 5.2},${armholeDepth * 4.5} ${quarterBust * 5.6},${armholeDepth * 5.5}
                        L ${(quarterWaist + frontDart) * 5.3},220
                        L ${quarterHips * 5.6},340
                        L ${quarterHips * 5.7},520
                        L 0,520
                        Z
                      `}
    fill="#ffffff"
    fillOpacity="0.85"
    stroke="#1c1917"
    strokeWidth="2.5"
  />

                    {
    /* Seam Allowance dashed outline */
  }
                    {showSeamAllowance && <path
    d={`
                          M -8,${frontNeckDepth * 4.5}
                          Q ${neckWidth * 2 - 8},-8 ${neckWidth * 4.2},-8
                          L ${backWidth * 5.4 + 8},${armholeDepth * 1.6 - 8}
                          C ${backWidth * 5.6 + 10},${armholeDepth * 3.6} ${quarterBust * 5.2 + 10},${armholeDepth * 4.5} ${quarterBust * 5.6 + 8},${armholeDepth * 5.5 + 8}
                          L ${(quarterWaist + frontDart) * 5.3 + 8},220
                          L ${quarterHips * 5.6 + 8},340
                          L ${quarterHips * 5.7 + 8},535
                          L -8,535
                          Z
                        `}
    fill="none"
    stroke="#dc2626"
    strokeWidth="1.2"
    strokeDasharray="4,4"
  />}

                    {
    /* Ko'krak Vitochkasi (Chest Dart to apex) */
  }
                    <path
    d="M 230,175 L 140,165 L 230,195 Z"
    fill="#f5f5f4"
    stroke="#44403c"
    strokeWidth="1.6"
  />
                    <circle cx="140" cy="165" r="3" fill="#ea580c" />
                    <text x="145" y="160" fontSize="9" fill="#ea580c" fontWeight="bold">Ko'krak uchi</text>

                    {
    /* Bel Vitochkasi (Waist Dart) */
  }
                    <path
    d="M 140,165 L 146,220 L 134,220 Z M 140,290 L 146,220 L 134,220 Z"
    fill="#f5f5f4"
    stroke="#44403c"
    strokeWidth="1.6"
  />

                    {
    /* Guide Lines */
  }
                    <line x1="0" y1={armholeDepth * 5.5} x2={quarterBust * 5.6} y2={armholeDepth * 5.5} stroke="#a8a29e" strokeDasharray="3,3" strokeWidth="1" />
                    <line x1="0" y1="220" x2={(quarterWaist + frontDart) * 5.3} y2="220" stroke="#a8a29e" strokeDasharray="3,3" strokeWidth="1" />
                    <line x1="0" y1="340" x2={quarterHips * 5.6} y2="340" stroke="#a8a29e" strokeDasharray="3,3" strokeWidth="1" />

                    {
    /* Grainline Arrow */
  }
                    <line x1="50" y1="160" x2="50" y2="400" stroke="#57534e" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                    <text x="55" y="280" fontSize="10" fill="#57534e" transform="rotate(-90 55 280)">Ulush ipi (Grainline ↕)</text>

                    {
    /* Dimensions */
  }
                    {showDimensions && <>
                        <text x={quarterBust * 5.6 - 65} y={armholeDepth * 5.5 - 5} fontSize="10" fill="#0369a1" fontWeight="bold">
                          1/4 Ko'krak: {quarterBust.toFixed(1)} sm
                        </text>
                        <text x={quarterHips * 5.6 - 30} y="515" fontSize="10" fill="#047857" fontWeight="bold">Etak: {quarterHips.toFixed(1)} sm</text>
                      </>}
                  </g>
                </g>}

              {
    /* ===================== YENG ANDOZASI (SLEEVE PATTERN) ===================== */
  }
              {patternType === "sleeve" && <g id="sleeve_pattern_group" transform="translate(250, 40)">
                  <text x="200" y="-15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#292524">
                    KLASSIK O'TIRUVCHI YENG ANDOZASI (SLEEVE BLOCK)
                  </text>
                  <text x="200" y="5" textAnchor="middle" fontSize="10" fill="#78716c">
                    Yeng o'miz balandligi: ~15 sm • Bilak aylanasi: ~22 sm
                  </text>

                  {
    /* Main Sleeve Contour */
  }
                  <path
    d={`
                      M 200,0
                      C 260,0 320,60 380,120
                      L 320,520
                      L 80,520
                      L 20,120
                      C 80,60 140,0 200,0
                      Z
                    `}
    fill="#ffffff"
    fillOpacity="0.85"
    stroke="#1c1917"
    strokeWidth="2.5"
  />

                  {
    /* Seam Allowance */
  }
                  {showSeamAllowance && <path
    d={`
                        M 200,-10
                        C 265,-10 328,52 390,115
                        L 330,535
                        L 70,535
                        L 10,115
                        C 72,52 135,-10 200,-10
                        Z
                      `}
    fill="none"
    stroke="#dc2626"
    strokeWidth="1.2"
    strokeDasharray="4,4"
  />}

                  {
    /* Center Line & Armhole Cap Base */
  }
                  <line x1="200" y1="0" x2="200" y2="520" stroke="#78716c" strokeDasharray="3,3" strokeWidth="1.5" />
                  <line x1="20" y1="120" x2="380" y2="120" stroke="#a8a29e" strokeDasharray="3,3" strokeWidth="1" />
                  <line x1="50" y1="320" x2="350" y2="320" stroke="#a8a29e" strokeDasharray="3,3" strokeWidth="1" />

                  {
    /* Notches for Front & Back Matching */
  }
                  <circle cx="95" cy="55" r="4" fill="#2563eb" />
                  <text x="60" y="50" fontSize="9" fill="#2563eb" fontWeight="bold">Old o'miz (1 kerik)</text>

                  <circle cx="305" cy="55" r="4" fill="#dc2626" />
                  <circle cx="313" cy="62" r="4" fill="#dc2626" />
                  <text x="320" y="50" fontSize="9" fill="#dc2626" fontWeight="bold">Ort o'miz (2 kerik)</text>

                  {
    /* Center Grainline Arrow */
  }
                  <line x1="200" y1="160" x2="200" y2="460" stroke="#57534e" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                  <text x="205" y="300" fontSize="10" fill="#57534e">Yeng balandlik chizig'i ({sleeveLength} sm)</text>

                  {showDimensions && <>
                      <text x="210" y="115" fontSize="10" fill="#0369a1" fontWeight="bold">O'miz kengligi: {(bust / 3).toFixed(1)} sm</text>
                      <text x="160" y="510" fontSize="10" fill="#047857" fontWeight="bold">Bilak: 22 sm</text>
                      <text x="60" y="315" fontSize="10" fill="#78716c">Tirsak chizig'i</text>
                    </>}
                </g>}

              {
    /* ===================== YUBKA ANDOZASI (SKIRT BLOCK) ===================== */
  }
              {patternType === "skirt" && <g id="skirt_pattern_group" transform="translate(180, 50)">
                  <text x="270" y="-20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#292524">
                    KLASSIK TO'G'RI VA QALAM YUBKA ANDOZASI
                  </text>

                  {
    /* Back skirt quadrant */
  }
                  <g transform="translate(0, 0)">
                    <text x="110" y="15" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#44403c">Ort bo'lak (Back) • 1/4</text>
                    <path
    d={`
                        M 0,30
                        L ${(quarterWaist + 2.5) * 5.2},30
                        C ${(quarterWaist + 4) * 5.2},90 ${(quarterHips + 0.5) * 5.2},130 ${(quarterHips + 0.5) * 5.2},160
                        L ${(quarterHips + 0.5) * 5.2},480
                        L 0,480
                        Z
                      `}
    fill="#ffffff"
    fillOpacity="0.85"
    stroke="#1c1917"
    strokeWidth="2.5"
  />

                    {
    /* Back Skirt Dart */
  }
                    <path d="M 80,30 L 76,120 L 84,30 Z" fill="#f5f5f4" stroke="#44403c" strokeWidth="1.6" />
                    <line x1="0" y1="160" x2={(quarterHips + 0.5) * 5.2} y2="160" stroke="#a8a29e" strokeDasharray="3,3" strokeWidth="1" />
                    <text x="10" y="155" fontSize="10" fill="#78716c">Bo'ksa balandligi (18-20 sm)</text>
                    <line x1="40" y1="180" x2="40" y2="400" stroke="#57534e" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                  </g>

                  {
    /* Front skirt quadrant */
  }
                  <g transform="translate(300, 0)">
                    <text x="110" y="15" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#44403c">Old bo'lak (Front) • 1/4</text>
                    <path
    d={`
                        M 0,30
                        L ${(quarterWaist + 2) * 5.2},30
                        C ${(quarterWaist + 3.5) * 5.2},90 ${(quarterHips + 0.5) * 5.2},130 ${(quarterHips + 0.5) * 5.2},160
                        L ${(quarterHips + 0.5) * 5.2},480
                        L 0,480
                        Z
                      `}
    fill="#ffffff"
    fillOpacity="0.85"
    stroke="#1c1917"
    strokeWidth="2.5"
  />

                    {
    /* Front Skirt Dart */
  }
                    <path d="M 80,30 L 78,100 L 82,30 Z" fill="#f5f5f4" stroke="#44403c" strokeWidth="1.6" />
                    <line x1="0" y1="160" x2={(quarterHips + 0.5) * 5.2} y2="160" stroke="#a8a29e" strokeDasharray="3,3" strokeWidth="1" />
                    <text x="10" y="155" fontSize="10" fill="#78716c">Bo'ksa chizig'i</text>
                    <line x1="40" y1="180" x2="40" y2="400" stroke="#57534e" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                  </g>
                </g>}

              {
    /* ===================== SHIM ANDOZASI (PANTS BLOCK) ===================== */
  }
              {patternType === "pants" && <g id="pants_pattern_group" transform="translate(140, 40)">
                  <text x="320" y="-15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#292524">
                    KLASSIK SHIM ANDOZASI (FRONT & BACK LEGS)
                  </text>

                  {
    /* Front Leg */
  }
                  <g transform="translate(0, 20)">
                    <text x="110" y="0" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#44403c">Old Bo'lak (Front Leg)</text>
                    <path
    d={`
                        M 40,20
                        L 160,20
                        L 165,120
                        L 140,240
                        L 120,500
                        L 60,500
                        L 40,240
                        L 10,135
                        C 20,110 35,60 40,20
                        Z
                      `}
    fill="#ffffff"
    fillOpacity="0.85"
    stroke="#1c1917"
    strokeWidth="2.5"
  />
                    <line x1="90" y1="20" x2="90" y2="500" stroke="#0284c7" strokeDasharray="4,4" strokeWidth="1.2" />
                    <text x="95" y="180" fontSize="9" fill="#0284c7">Strelka (Dazmol chizig'i)</text>
                    <text x="15" y="130" fontSize="9" fill="#dc2626" fontWeight="bold">Bant chizig'i</text>
                  </g>

                  {
    /* Back Leg */
  }
                  <g transform="translate(320, 20)">
                    <text x="130" y="0" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#44403c">Ort Bo'lak (Back Leg)</text>
                    <path
    d={`
                        M 30,10
                        L 180,30
                        L 185,120
                        L 155,240
                        L 135,500
                        L 50,500
                        L 30,240
                        L -25,145
                        C 0,110 20,60 30,10
                        Z
                      `}
    fill="#ffffff"
    fillOpacity="0.85"
    stroke="#1c1917"
    strokeWidth="2.5"
  />
                    <line x1="95" y1="20" x2="95" y2="500" stroke="#0284c7" strokeDasharray="4,4" strokeWidth="1.2" />
                    <text x="100" y="180" fontSize="9" fill="#0284c7">Strelka chizig'i</text>
                    <text x="-25" y="140" fontSize="9" fill="#dc2626" fontWeight="bold">O'tirg'ich chuqurligi</text>
                  </g>
                </g>}

              {
    /* ===================== QUYOSH DOIRA ETAK (CIRCLE SKIRT) ===================== */
  }
              {patternType === "circle_skirt" && <g id="circle_skirt_group" transform="translate(220, 60)">
                  <text x="240" y="-20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#292524">
                    QUYOSH VA YARIM QUYOSH DOIRA ETAK HISOBLAGICHI
                  </text>

                  {
    /* Radius Math */
  }
                  <g transform="translate(50, 20)">
                    {
    /* Skirt Arc */
  }
                    <path
    d="M 0,0 L 400,0 A 400,400 0 0,1 0,400 Z"
    fill="#f5f5f4"
    stroke="#a8a29e"
    strokeWidth="1.5"
    strokeDasharray="4,4"
  />
                    {
    /* Inner Waist Arc: R = Waist / 6.28 */
  }
                    <path
    d={`M 0,0 L ${waist / 6.28 * 4.5},0 A ${waist / 6.28 * 4.5},${waist / 6.28 * 4.5} 0 0,1 0,${waist / 6.28 * 4.5} Z`}
    fill="#ffffff"
    stroke="#dc2626"
    strokeWidth="2.5"
  />
                    {
    /* Outer Hem Arc */
  }
                    <path
    d={`M ${waist / 6.28 * 4.5},0 L 380,0 A 380,380 0 0,1 0,380 L 0,${waist / 6.28 * 4.5}`}
    fill="#ffffff"
    fillOpacity="0.8"
    stroke="#1c1917"
    strokeWidth="3"
  />

                    {
    /* Radius lines and labels */
  }
                    <line x1="0" y1="0" x2="0" y2={waist / 6.28 * 4.5} stroke="#ea580c" strokeWidth="2" />
                    <text x="10" y={waist / 6.28 * 2.5} fontSize="11" fill="#ea580c" fontWeight="bold">
                      R (Bel radiusi) = {(waist / 6.28).toFixed(1)} sm
                    </text>

                    <line x1="0" y1={waist / 6.28 * 4.5} x2="0" y2="380" stroke="#047857" strokeWidth="2" />
                    <text x="10" y="240" fontSize="11" fill="#047857" fontWeight="bold">
                      Etak uzunligi = {garmentLength > 90 ? garmentLength - 40 : garmentLength} sm
                    </text>

                    {
    /* Center point */
  }
                    <circle cx="0" cy="0" r="4" fill="#000" />
                    <text x="5" y="-5" fontSize="11" fontWeight="bold">Mato burchagi (90°)</text>
                  </g>
                </g>}

              {
    /* Watermark / Scale Stamp */
  }
              <text x="30" y="660" fontSize="10" fill="#a8a29e" fontFamily="sans-serif">
                ChevarMaster Patrondis CAD Engine • 1:1 Parametric Sewing Blueprint • {(/* @__PURE__ */ new Date()).toLocaleDateString("uz-UZ")}
              </text>
            </svg>
          </div>

          {
    /* Quick Guidance Box */
  }
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-start space-x-3 text-xs text-stone-600">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-stone-800">Tikuvchiga bichish bo'yicha yo'riqnoma:</span>
              <p className="leading-relaxed">
                Ushbu andoza kiritilgan o'lchovlarga qarab real vaqtda qayta chiziladi. <b>Qizil chiziq</b> chok haqqi zaxirasini (1.5 sm) bildiradi. Matoga qo'yganda <b>ulush ipi (grainline ↕)</b> yo'nalishiga qat'iy rioya qiling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export {
  PatternMaker
};
