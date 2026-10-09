import { useRef, useState, useEffect } from "react";
import { FASHION_PALETTE } from "../../data/croquisTemplates";
import { useToast } from "../Toast";
import {
  Pen,
  Highlighter,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Save,
  Sparkles
} from "lucide-react";
const SketchCanvas = ({ user, onSaveSketch }) => {
  const { showToast } = useToast();
  const canvasRef = useRef(null);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#171717");
  const [brushSize, setBrushSize] = useState(3);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const isDrawing = useRef(false);
  const lastPoint = useRef(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [sketchTitle, setSketchTitle] = useState("");
  const [dressCategory, setDressCategory] = useState("oqshom_libosi");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAiRendering, setIsAiRendering] = useState(false);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const CANVAS_WIDTH = 540;
  const CANVAS_HEIGHT = 800;
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const initialImageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    setHistory([initialImageData]);
    setHistoryIndex(0);
  }, []);
  const saveHistoryState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(currentData);
    if (newHistory.length > 25) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const newIndex = historyIndex - 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };
  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const newIndex = historyIndex + 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveHistoryState();
  };
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let clientX = 0;
    let clientY = 0;
    if ("touches" in e) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };
  const startDrawing = (e) => {
    if ("touches" in e) {
      e.stopPropagation();
    }
    isDrawing.current = true;
    const coords = getCoordinates(e);
    lastPoint.current = coords;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, brushSize / 2, 0, Math.PI * 2);
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#ffffff";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = color;
      ctx.globalAlpha = tool === "marker" ? 0.35 : brushOpacity;
    }
    ctx.fill();
  };
  const draw = (e) => {
    if (!isDrawing.current || !lastPoint.current) return;
    if ("touches" in e) {
      e.stopPropagation();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const currentPoint = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = brushSize * 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = 1;
    } else if (tool === "marker") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize * 2;
      ctx.lineCap = "square";
      ctx.lineJoin = "bevel";
      ctx.globalAlpha = 0.3;
    } else if (tool === "pencil") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, brushSize * 0.7);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = 0.75 * brushOpacity;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = brushOpacity;
    }
    ctx.stroke();
    lastPoint.current = currentPoint;
  };
  const stopDrawing = () => {
    if (isDrawing.current) {
      isDrawing.current = false;
      lastPoint.current = null;
      saveHistoryState();
    }
  };
  const getCanvasImageDataUrl = () => {
    const canvas = canvasRef.current;
    if (!canvas) return "";
    return canvas.toDataURL("image/png");
  };
  const handleSaveSketch = async () => {
    if (!sketchTitle.trim()) {
      showToast({
        type: "warning",
        title: "Eskiz nomi kiritilmadi",
        message: "Iltimos, eskizga nom bering (masalan: Bahorgi Oqshom Libosi)"
      });
      return;
    }
    setIsSaving(true);
    try {
      const dataUrl = getCanvasImageDataUrl();
      const payload = {
        title: sketchTitle,
        tailorId: user.id,
        tailorName: `${user.firstName} ${user.lastName}`,
        modelType: "blank",
        dressCategory,
        notes,
        fabricSuggestion: aiAdvice ? aiAdvice.fabricRecommendation : "Shifon va ipak shoyi",
        imageData: dataUrl
      };
      const res = await fetch("/api/sketches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eskizni saqlab bo'lmadi");
      showToast({
        type: "success",
        title: "Eskiz saqlandi!",
        message: `"${sketchTitle}" eskizi muvaffaqiyatli galereyangizga qo'shildi.`
      });
      onSaveSketch(data.sketch);
      setSketchTitle("");
      setNotes("");
    } catch (err) {
      showToast({
        type: "error",
        title: "Saqlashda xatolik",
        message: err.message || "Eskizni saqlashda xatolik yuz berdi"
      });
    } finally {
      setIsSaving(false);
    }
  };
  const handleDownload = () => {
    const dataUrl = getCanvasImageDataUrl();
    const link = document.createElement("a");
    link.download = `eskiz-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    showToast({
      type: "info",
      title: "Yuklab olindi",
      message: "Eskiz rasmi qurilmangizga PNG formatida saqlandi."
    });
  };
  const handleAiAdvice = async () => {
    setIsAiRendering(true);
    setShowAiModal(true);
    try {
      const dataUrl = getCanvasImageDataUrl();
      const res = await fetch("/api/render-sketch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: dataUrl,
          dressCategory,
          notes,
          colorPalette: color
        })
      });
      const data = await res.json();
      if (data.success && data.advice) {
        setAiAdvice(data.advice);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiRendering(false);
    }
  };
  return <div className="max-w-6xl mx-auto px-2 sm:px-6 py-4">
      {
    /* Top Banner */
  }
      <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-serif font-bold text-stone-900 flex items-center space-x-2">
              <span>Eskiz Chizish Studiyasi</span>
              <span className="text-xs bg-amber-100 text-amber-900 font-sans font-medium px-2 py-0.5 rounded-full border border-amber-300">
                Toza Oq Kanvas
              </span>
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              O'z fasoningiz, andozangiz va libos chizmalaringizni erkin chizing.
            </p>
          </div>

          {
    /* Action buttons */
  }
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
    onClick={handleAiAdvice}
    className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs font-semibold shadow-md shadow-amber-600/20 transition"
  >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>AI Ranglash & Maslahat</span>
            </button>
            <button
    onClick={handleDownload}
    title="PNG Yuklab olish"
    className="p-2 border border-stone-200 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition"
  >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {
    /* Main Studio Area: Left Toolbar + Clean White Canvas */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {
    /* Left Toolbar & Settings (Tools, Brush, Colors, Save) */
  }
        <div className="lg:col-span-5 space-y-4">
          {
    /* Drawing Tools Card */
  }
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
              <span>Chizish Asboblari</span>
              <span className="text-[10px] text-stone-400 font-mono">{tool.toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 p-1 bg-stone-100 rounded-xl">
              <button
    onClick={() => setTool("pen")}
    title="Ruchka / Kontur"
    className={`flex flex-col items-center py-2 px-1 rounded-lg text-[11px] font-medium transition ${tool === "pen" ? "bg-white text-stone-900 shadow-sm font-bold" : "text-stone-600 hover:text-stone-900"}`}
  >
                <Pen className="w-4 h-4 mb-1 text-amber-600" />
                <span>Ruchka</span>
              </button>

              <button
    onClick={() => setTool("marker")}
    title="Copic Marker / Akvarel (Shaffof)"
    className={`flex flex-col items-center py-2 px-1 rounded-lg text-[11px] font-medium transition ${tool === "marker" ? "bg-white text-stone-900 shadow-sm font-bold" : "text-stone-600 hover:text-stone-900"}`}
  >
                <Highlighter className="w-4 h-4 mb-1 text-rose-600" />
                <span>Marker</span>
              </button>

              <button
    onClick={() => setTool("pencil")}
    title="Yupqa Qalam"
    className={`flex flex-col items-center py-2 px-1 rounded-lg text-[11px] font-medium transition ${tool === "pencil" ? "bg-white text-stone-900 shadow-sm font-bold" : "text-stone-600 hover:text-stone-900"}`}
  >
                <Pen className="w-4 h-4 mb-1 text-stone-500 stroke-dasharray-1" />
                <span>Qalam</span>
              </button>

              <button
    onClick={() => setTool("eraser")}
    title="O'chirg'ich"
    className={`flex flex-col items-center py-2 px-1 rounded-lg text-[11px] font-medium transition ${tool === "eraser" ? "bg-white text-stone-900 shadow-sm font-bold" : "text-stone-600 hover:text-stone-900"}`}
  >
                <Eraser className="w-4 h-4 mb-1 text-indigo-600" />
                <span>O'chirg'ich</span>
              </button>
            </div>

            {
    /* Brush Size & Opacity */
  }
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <div>
                <div className="flex justify-between text-xs text-stone-600 mb-1">
                  <span>Qalinlik (Size):</span>
                  <span className="font-mono font-bold">{brushSize}px</span>
                </div>
                <input
    type="range"
    min="1"
    max="40"
    value={brushSize}
    onChange={(e) => setBrushSize(Number(e.target.value))}
    className="w-full accent-amber-600 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
  />
              </div>

              <div>
                <div className="flex justify-between text-xs text-stone-600 mb-1">
                  <span>Shaffoflik (Opacity):</span>
                  <span className="font-mono font-bold">{Math.round(brushOpacity * 100)}%</span>
                </div>
                <input
    type="range"
    min="0.1"
    max="1"
    step="0.05"
    value={brushOpacity}
    onChange={(e) => setBrushOpacity(Number(e.target.value))}
    className="w-full accent-amber-600 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
  />
              </div>
            </div>

            {
    /* Fashion Color Palette */
  }
            <div className="pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Moda Ranglari</span>
                <input
    type="color"
    value={color}
    onChange={(e) => setColor(e.target.value)}
    className="w-6 h-6 rounded-md cursor-pointer border border-stone-300 p-0"
    title="O'zingiz tanlang"
  />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {FASHION_PALETTE.map((c) => <button
    key={c.hex}
    onClick={() => setColor(c.hex)}
    style={{ backgroundColor: c.hex }}
    title={c.name}
    className={`h-7 rounded-lg border transition transform hover:scale-105 ${color.toLowerCase() === c.hex.toLowerCase() ? "border-amber-600 ring-2 ring-amber-400 shadow-md scale-105" : "border-stone-300"}`}
  />)}
              </div>
            </div>

            {
    /* Undo / Redo / Clear Actions */
  }
            <div className="flex items-center space-x-2 pt-2 border-t border-stone-100">
              <button
    onClick={handleUndo}
    disabled={historyIndex <= 0}
    className="flex-1 flex items-center justify-center space-x-1 py-2 px-2 bg-stone-100 hover:bg-stone-200 disabled:opacity-30 rounded-xl text-xs font-medium text-stone-700 transition"
  >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Orqaga</span>
              </button>
              <button
    onClick={handleRedo}
    disabled={historyIndex >= history.length - 1}
    className="flex-1 flex items-center justify-center space-x-1 py-2 px-2 bg-stone-100 hover:bg-stone-200 disabled:opacity-30 rounded-xl text-xs font-medium text-stone-700 transition"
  >
                <Redo2 className="w-3.5 h-3.5" />
                <span>Oldinga</span>
              </button>
              <button
    onClick={handleClear}
    title="Tozalash"
    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition border border-rose-200"
  >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {
    /* Save to Tailor Gallery Card */
  }
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Eskizni Galereyaga Saqlash
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Eskiz Nomi *</label>
              <input
    type="text"
    placeholder="Masalan: Bahorgi Yangi Fason Libos"
    value={sketchTitle}
    onChange={(e) => setSketchTitle(e.target.value)}
    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40"
  />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Toifa</label>
              <select
    value={dressCategory}
    onChange={(e) => setDressCategory(e.target.value)}
    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40"
  >
                <option value="oqshom_libosi">Oqshom Libosi / Kelin ko'ylak</option>
                <option value="kundalik_koylak">Kundalik Ayollar Ko'ylagi</option>
                <option value="milliy_libos">Milliy Libos (Atlas / Adras)</option>
                <option value="kostyum_shim">Kostyum-shim / Pidjak</option>
                <option value="yubka">Yubka va Bluzka</option>
                <option value="palto">Palto / Kurtka</option>
                <option value="bolalar_kiyimi">Bolalar Kiyimi</option>
              </select>
            </div>
            <button
    onClick={handleSaveSketch}
    disabled={isSaving}
    className="w-full py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition disabled:opacity-50"
  >
              <Save className="w-4 h-4 text-amber-400" />
              <span>{isSaving ? "Saqlanmoqda..." : "Eskizni Saqlash"}</span>
            </button>
          </div>
        </div>

        {
    /* Right Area: Large, Clean, Pure White Drawing Canvas */
  }
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative bg-white rounded-3xl border-2 border-stone-300 shadow-xl overflow-hidden w-full max-w-[500px] aspect-[540/800] select-none touch-none">
            {
    /* Clean White Drawing Canvas (No human figure!) */
  }
            <canvas
    ref={canvasRef}
    onMouseDown={startDrawing}
    onMouseMove={draw}
    onMouseUp={stopDrawing}
    onMouseLeave={stopDrawing}
    onTouchStart={startDrawing}
    onTouchMove={draw}
    onTouchEnd={stopDrawing}
    className="absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none bg-white"
  />
          </div>

          <p className="text-[11px] text-stone-400 mt-3 text-center">
            💡 Erkin chizish kanvasi: Telefon yoki planshetda barmog'ingiz yoki stilus bilan bevosita chizishingiz mumkin.
          </p>
        </div>
      </div>

      {
    /* AI Advice & Render Modal */
  }
      {showAiModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-stone-200 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    AI Modelyer Maslahati & Ranglash
                  </h3>
                  <p className="text-xs text-stone-500">
                    Gemini 3.8 Flash kutyure tavsiyalari va mato uyg'unligi
                  </p>
                </div>
              </div>
              <button
    onClick={() => setShowAiModal(false)}
    className="text-stone-400 hover:text-stone-700 text-lg font-bold p-1"
  >
                ✕
              </button>
            </div>

            {isAiRendering ? <div className="py-12 text-center space-y-3">
                <div className="inline-block w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-medium text-stone-600">
                  Eskiz chizmasi tahlil qilinmoqda va moda tavsiyalari tayyorlanmoqda...
                </p>
              </div> : aiAdvice ? <div className="space-y-4 text-xs">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                  <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider">
                    Moda Stil Nomi:
                  </span>
                  <h4 className="text-sm font-bold text-amber-950 mt-0.5">
                    {aiAdvice.styleTitle || "Klassik Couture Libosi"}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-bold text-stone-800 block mb-1">🧵 Tavsiya Etiladigan Mato:</span>
                    <p className="text-stone-600 leading-relaxed">{aiAdvice.fabricRecommendation}</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-bold text-stone-800 block mb-1">🎨 Ranglar Uyg'unligi:</span>
                    <p className="text-stone-600 leading-relaxed">{aiAdvice.colorHarmony}</p>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="font-bold text-stone-800 block mb-1">✂️ Tikuvchi Uchun Maslahatlar:</span>
                  <p className="text-stone-600 leading-relaxed">{aiAdvice.tailoringTips}</p>
                  {aiAdvice.estimatedFabricMeters && <div className="mt-2 text-stone-800 font-semibold">
                      Zarur mato miqdori:{" "}
                      <span className="text-amber-700">{aiAdvice.estimatedFabricMeters}</span>
                    </div>}
                </div>

                {aiAdvice.finishingElements && aiAdvice.finishingElements.length > 0 && <div>
                    <span className="font-bold text-stone-700 block mb-1.5">
                      ✨ Qo'shimcha Bezak Elementlari:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiAdvice.finishingElements.map((el, idx) => <span
    key={idx}
    className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg text-[11px] font-medium"
  >
                          {el}
                        </span>)}
                    </div>
                  </div>}
              </div> : null}

            <div className="pt-2 flex justify-end">
              <button
    onClick={() => setShowAiModal(false)}
    className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold"
  >
                Yopish
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
export {
  SketchCanvas
};
