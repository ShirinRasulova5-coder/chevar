import { useState, useEffect } from "react";
import { useToast } from "../Toast";
import { ShoppingBag, PlusCircle, MessageSquare, Send, Sparkles } from "lucide-react";
const CustomerDashboard = ({ user, onSelectTab }) => {
  const { showToast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [tailorsList, setTailorsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [selectedTailorId, setSelectedTailorId] = useState("");
  const [dressType, setDressType] = useState("Oqshom Libosi");
  const [fabricChoice, setFabricChoice] = useState("Tabiiy ipak va shifon");
  const [colorPreference, setColorPreference] = useState("To'q zumrad yashil");
  const [notes, setNotes] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [measurementChoice, setMeasurementChoice] = useState("tailor_takes");
  const [height, setHeight] = useState(168);
  const [bust, setBust] = useState(90);
  const [waist, setWaist] = useState(68);
  const [hips, setHips] = useState(96);
  const [dressLength, setDressLength] = useState(120);
  const loadData = async () => {
    try {
      const [ordersRes, tailorsRes] = await Promise.all([
        fetch(`/api/orders?customerId=${user.id}`),
        fetch("/api/tailors")
      ]);
      const ordersData = await ordersRes.json();
      const tailorsData = await tailorsRes.json();
      setOrders(ordersData || []);
      setTailorsList(tailorsData || []);
      if (tailorsData && tailorsData.length > 0 && !selectedTailorId) {
        setSelectedTailorId(tailorsData[0].id);
      }
      if (ordersData && ordersData.length > 0 && !selectedOrder) {
        setSelectedOrder(ordersData[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!notes.trim()) {
      showToast({
        type: "warning",
        title: "Istaklaringizni yozing",
        message: "Iltimos, tikilishi kerak bo'lgan libos bo'yicha hohishlaringizni yozib qoldiring."
      });
      return;
    }
    setIsLoading(true);
    try {
      const selectedTailor = tailorsList.find((t) => t.id === selectedTailorId);
      const payload = {
        customerId: user.id,
        customerName: `${user.firstName} ${user.lastName}`,
        customerPhone: customerPhone || "+998 90 000 00 00",
        customerEmail: user.email,
        tailorId: selectedTailor?.id || "tailor-1",
        tailorName: selectedTailor ? `${selectedTailor.firstName} ${selectedTailor.lastName}` : "Tikuvchi",
        dressType,
        fabricChoice,
        colorPreference,
        notes,
        measurements: measurementChoice === "enter_own" ? { height, bust, waist, hips, dressLength } : { request: "Tikuvchi o'lchov olishi kutilmoqda" }
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast({
        type: "success",
        title: "Buyurtma qabul qilindi!",
        message: "Sizning libos buyurtmangiz tikuvchiga muvaffaqiyatli yuborildi.",
        duration: 5e3
      });
      setOrders([data.order, ...orders]);
      setSelectedOrder(data.order);
      setActiveSubTab("orders");
      setNotes("");
    } catch (err) {
      showToast({
        type: "error",
        title: "Xatolik",
        message: err.message || "Buyurtma berishda xatolik"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !chatMessage.trim()) return;
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderRole: "mijoz",
          senderName: `${user.firstName} ${user.lastName}`,
          text: chatMessage.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSelectedOrder(data.order);
      setOrders((prev) => prev.map((o) => o.id === data.order.id ? data.order : o));
      setChatMessage("");
      showToast({
        type: "success",
        title: "Xabar yuborildi",
        message: "Tikuvchiga xabaringiz yetkazildi."
      });
    } catch (err) {
      showToast({
        type: "error",
        title: "Xatolik",
        message: err.message
      });
    }
  };
  const getStatusText = (status) => {
    switch (status) {
      case "yangi":
        return "Yangi Qabul Qilingan";
      case "qabul_qilindi":
        return "Tikuvchi Tasdiqladi";
      case "bichilmoqda":
        return "Mato Bichilmoqda";
      case "tikilmoqda":
        return "Tikilmoqda";
      case "primerka":
        return "Kiyib Ko'rish (Primerka)";
      case "tayyor":
        return "Libos Tayyor!";
      case "topshirildi":
        return "Mijozga Yetkazildi";
      default:
        return status;
    }
  };
  const getStepNumber = (status) => {
    switch (status) {
      case "yangi":
        return 1;
      case "qabul_qilindi":
        return 2;
      case "bichilmoqda":
        return 3;
      case "tikilmoqda":
        return 4;
      case "primerka":
        return 5;
      case "tayyor":
      case "topshirildi":
        return 6;
      default:
        return 1;
    }
  };
  return <div className="max-w-7xl mx-auto px-4 py-6">
      {
    /* Top Banner */
  }
      <div className="bg-white rounded-3xl border border-stone-200 p-6 mb-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-700 mb-1">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Mijoz Shaxsiy Kabineti</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Xush Kelibsiz, {user.firstName}!
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            O'zingiz hohlagan libos fasoni va orzuingizdagi kiyimni buyurtma qiling hamda tikuvchi bilan muloqotda bo'ling.
          </p>
        </div>

        {
    /* Tab Toggle */
  }
        <div className="flex items-center space-x-2 p-1 bg-stone-100 rounded-2xl">
          <button
    onClick={() => setActiveSubTab("orders")}
    className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${activeSubTab === "orders" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600 hover:text-stone-900"}`}
  >
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>Buyurtmalarim ({orders.length})</span>
          </button>
          <button
    onClick={() => setActiveSubTab("new_order")}
    className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${activeSubTab === "new_order" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600 hover:text-stone-900"}`}
  >
            <PlusCircle className="w-4 h-4 text-amber-600" />
            <span>Yangi Fason & Hohishlar</span>
          </button>
        </div>
      </div>

      {activeSubTab === "new_order" ? (
    // NEW ORDER / WISHES SUBMISSION FORM
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Yangi Libos Buyurtmasi va Hohish-Istaklaringiz
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Fasoningiz, mato xohishingiz va o'lchovlaringizni kiriting. Tanlagan tikuvchingiz siz bilan bog'lanadi.
            </p>
          </div>

          <form onSubmit={handleCreateOrder} className="space-y-5">
            {
      /* Choose Tailor */
    }
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Libosingizni Tikuvchi Usta (Atelier) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tailorsList.map((t) => <div
      key={t.id}
      onClick={() => setSelectedTailorId(t.id)}
      className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center space-x-3 ${selectedTailorId === t.id ? "border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20" : "border-stone-200 hover:border-stone-300"}`}
    >
                    <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-serif font-bold text-sm flex-shrink-0">
                      ✂️
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-stone-900 truncate">
                        {t.firstName} {t.lastName}
                      </div>
                      <div className="text-[11px] text-amber-900 font-medium truncate">{t.salonName}</div>
                      <div className="text-[10px] text-stone-500 truncate">{t.specialty}</div>
                    </div>
                  </div>)}
              </div>
            </div>

            {
      /* Dress Type and Fabric */
    }
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">Libos Turi *</label>
                <select
      value={dressType}
      onChange={(e) => setDressType(e.target.value)}
      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-amber-500/40"
    >
                  <option value="To'y / Kelin Ko'ylagi">👰 Kelin Ko'ylagi / Oqshom Libosi</option>
                  <option value="Milliy Xonatlas / Adras Libosi">👑 Milliy Xonatlas / Adras Libosi</option>
                  <option value="Kundalik Ko'ylak">👗 Kundalik Nafis Ko'ylak</option>
                  <option value="Kostyum-shim (Klassik)">💼 Kostyum-shim (Klassik)</option>
                  <option value="Yubka va Bluzka">🩰 Yubka va Bluzka</option>
                  <option value="Bolalar Libosi">🎀 Bolalar Libosi</option>
                  <option value="Palto / Kushot">🧥 Palto / Kushot</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">Mato Xohishingiz</label>
                <input
      type="text"
      placeholder="Masalan: Qalin baxmal, ipak shifon, tabiiy adras"
      value={fabricChoice}
      onChange={(e) => setFabricChoice(e.target.value)}
      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500/40"
    />
              </div>
            </div>

            {
      /* Color preference and Phone */
    }
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">Rang Xohishi</label>
                <input
      type="text"
      placeholder="Masalan: Zumrad yashil, qaymoq rang, to'q bordo"
      value={colorPreference}
      onChange={(e) => setColorPreference(e.target.value)}
      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500/40"
    />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Aloqa Uchun Telefon Raqamingiz *
                </label>
                <input
      type="tel"
      required
      placeholder="+998 90 123 45 67"
      value={customerPhone}
      onChange={(e) => setCustomerPhone(e.target.value)}
      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500/40"
    />
              </div>
            </div>

            {
      /* Wishes & Specific Notes */
    }
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Sizning Maxsus Hohish-Istaklaringiz (Fason detallari) *
              </label>
              <textarea
      rows={4}
      required
      placeholder="Libos haqida hamma istaklaringizni batafsil yozing: qat-qat etak bo'lsinmi, yenglari puff shakldami, yoqasi qanday bo'lishi kerak, shleyf yoki kamar bormi..."
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500/40 leading-relaxed"
    />
            </div>

            {
      /* Measurement Choice */
    }
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <label className="block text-xs font-bold text-stone-700">O'lchov Olish Qanday Bo'lsin?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div
      onClick={() => setMeasurementChoice("tailor_takes")}
      className={`p-3.5 rounded-2xl border cursor-pointer transition ${measurementChoice === "tailor_takes" ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 font-semibold" : "border-stone-200"}`}
    >
                  <div className="font-bold text-stone-900">✂️ Tikuvchi O'zimdan O'lchov Olsin</div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    Atelierga borib yoki tikuvchi bilan kelishilgan vaqtda o'lchov olinadi.
                  </div>
                </div>

                <div
      onClick={() => setMeasurementChoice("enter_own")}
      className={`p-3.5 rounded-2xl border cursor-pointer transition ${measurementChoice === "enter_own" ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 font-semibold" : "border-stone-200"}`}
    >
                  <div className="font-bold text-stone-900">📏 O'z O'lchovlarimni Kiritaman</div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    Bo'y, ko'krak, bel va bo'ksa sm parametrlarini o'zim bilaman.
                  </div>
                </div>
              </div>

              {measurementChoice === "enter_own" && <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Bo'y (Height)</label>
                    <input
      type="number"
      value={height}
      onChange={(e) => setHeight(Number(e.target.value))}
      className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs font-mono font-bold"
    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Ko'krak (Bust)</label>
                    <input
      type="number"
      value={bust}
      onChange={(e) => setBust(Number(e.target.value))}
      className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs font-mono font-bold"
    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Bel (Waist)</label>
                    <input
      type="number"
      value={waist}
      onChange={(e) => setWaist(Number(e.target.value))}
      className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs font-mono font-bold"
    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Bo'ksa (Hips)</label>
                    <input
      type="number"
      value={hips}
      onChange={(e) => setHips(Number(e.target.value))}
      className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs font-mono font-bold"
    />
                  </div>
                </div>}
            </div>

            {
      /* Submit Button */
    }
            <button
      type="submit"
      disabled={isLoading}
      className="w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs font-bold shadow-lg shadow-stone-900/10 flex items-center justify-center space-x-2 transition disabled:opacity-50"
    >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isLoading ? "Yuborilmoqda..." : "Buyurtmani Tikuvchiga Yuborish"}</span>
            </button>
          </form>
        </div>
  ) : (
    // ORDERS TRACKING & CHAT VIEW
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {
      /* Orders List */
    }
          <div className="lg:col-span-5 space-y-3">
            <h3 className="font-serif font-bold text-sm text-stone-900 mb-2">
              Sizning Faol Buyurtmalaringiz:
            </h3>

            {orders.map((order) => <div
      key={order.id}
      onClick={() => setSelectedOrder(order)}
      className={`p-4 rounded-2xl border transition cursor-pointer space-y-2.5 ${selectedOrder?.id === order.id ? "bg-emerald-50/60 border-emerald-400 ring-2 ring-emerald-500/20 shadow-md" : "bg-white border-stone-200 hover:border-stone-300"}`}
    >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-stone-600">{order.orderNumber}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-stone-900">{order.dressType}</h4>
                  <p className="text-xs text-stone-500">Tikuvchi: {order.tailorName}</p>
                </div>

                <div className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                  {order.notes}
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-100">
                  <span>{new Date(order.createdAt).toLocaleDateString("uz-UZ")}</span>
                  {order.priceEstimate ? <span className="font-bold text-stone-800">
                      {order.priceEstimate.toLocaleString()} so'm
                    </span> : <span className="text-amber-700">Tikuvchi narx hisoblamoqda</span>}
                </div>
              </div>)}

            {orders.length === 0 && <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-6 space-y-3">
                <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
                <h4 className="font-bold text-stone-800 text-sm">Hozircha buyurtmalaringiz yo'q</h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Orzuingizdagi libosni tikuvchilarimizga buyurtma qilish uchun yuqoridagi tugmani bosing.
                </p>
                <button
      onClick={() => setActiveSubTab("new_order")}
      className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold"
    >
                  Buyurtma berish
                </button>
              </div>}
          </div>

          {
      /* Selected Order Detailed Progress & Chat */
    }
          <div className="lg:col-span-7">
            {selectedOrder ? <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                      {selectedOrder.orderNumber}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold font-serif text-stone-900 mt-2">
                    {selectedOrder.dressType}
                  </h2>
                  <p className="text-xs text-stone-500">
                    Mas'ul Usta: <b>{selectedOrder.tailorName}</b>
                  </p>
                </div>

                {
      /* Progress Visual Tracker */
    }
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-stone-700">
                    <span>Tikuv Bosqichlari:</span>
                    <span>Qadam {getStepNumber(selectedOrder.status)} / 6</span>
                  </div>
                  {
      /* Progress bar */
    }
                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div
      className="bg-emerald-600 h-full transition-all duration-500"
      style={{ width: `${getStepNumber(selectedOrder.status) / 6 * 100}%` }}
    />
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-[10px] text-stone-500 pt-1 text-center font-medium">
                    <span className={getStepNumber(selectedOrder.status) >= 1 ? "text-emerald-700 font-bold" : ""}>
                      1. Qabul
                    </span>
                    <span className={getStepNumber(selectedOrder.status) >= 2 ? "text-emerald-700 font-bold" : ""}>
                      2. Bichish
                    </span>
                    <span className={getStepNumber(selectedOrder.status) >= 3 ? "text-emerald-700 font-bold" : ""}>
                      3. Tikish
                    </span>
                    <span className={getStepNumber(selectedOrder.status) >= 4 ? "text-emerald-700 font-bold" : ""}>
                      4. Primerka
                    </span>
                    <span className={getStepNumber(selectedOrder.status) >= 5 ? "text-emerald-700 font-bold" : ""}>
                      5. Tayyor
                    </span>
                    <span className={getStepNumber(selectedOrder.status) >= 6 ? "text-emerald-700 font-bold" : ""}>
                      6. Topshirildi
                    </span>
                  </div>
                </div>

                {
      /* Order Meta details */
    }
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-400 block mb-0.5">Mato va Rang:</span>
                    <span className="font-bold text-stone-800">
                      {selectedOrder.fabricChoice || "Oddiy"} • {selectedOrder.colorPreference || "Standart"}
                    </span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-400 block mb-0.5">Topshirish muddati:</span>
                    <span className="font-bold text-stone-800">
                      {selectedOrder.deliveryDate || "Tikuvchi tomonidan belgilanmoqda"}
                    </span>
                  </div>
                </div>

                {
      /* Customer Wishes */
    }
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                  <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                    Sizning Hohish-Istaklaringiz:
                  </span>
                  <p className="text-stone-800 leading-relaxed">{selectedOrder.notes}</p>
                </div>

                {
      /* Live Chat with Tailor */
    }
                <div className="space-y-3 pt-2 border-t border-stone-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center space-x-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>Tikuvchi bilan jonli muloqot:</span>
                  </span>

                  <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-stone-50 rounded-2xl border border-stone-200">
                    {selectedOrder.messages && selectedOrder.messages.length > 0 ? selectedOrder.messages.map((msg, i) => <div
      key={i}
      className={`p-2.5 rounded-xl text-xs max-w-sm ${msg.senderRole === "mijoz" ? "bg-emerald-600 text-white ml-auto" : "bg-white text-stone-800 border border-stone-200 mr-auto"}`}
    >
                          <div className="text-[10px] font-semibold opacity-80 mb-0.5">{msg.senderName}</div>
                          <div>{msg.text}</div>
                        </div>) : <div className="text-center text-xs text-stone-400 py-3">Xabarlar yo'q</div>}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
      type="text"
      placeholder="Tikuvchiga savol yoki qo'shimcha istak yozing..."
      value={chatMessage}
      onChange={(e) => setChatMessage(e.target.value)}
      className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500/40"
    />
                    <button
      type="submit"
      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center space-x-1"
    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Yuborish</span>
                    </button>
                  </form>
                </div>
              </div> : null}
          </div>
        </div>
  )}
    </div>;
};
export {
  CustomerDashboard
};
