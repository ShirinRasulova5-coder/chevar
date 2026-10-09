import { useState, useEffect } from "react";
import { useToast } from "../Toast";
import { ShoppingBag, MessageSquare, Send } from "lucide-react";
const TailorDashboard = ({ user }) => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [replyText, setReplyText] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [deliveryDateInput, setDeliveryDateInput] = useState("");
  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data || []);
      if (data && data.length > 0 && !selectedOrder) {
        setSelectedOrder(data[0]);
        setPriceInput(data[0].priceEstimate || "");
        setDeliveryDateInput(data[0].deliveryDate || "");
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    loadOrders();
  }, []);
  const handleStatusChange = async (newStatus) => {
    if (!selectedOrder) return;
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          priceEstimate: priceInput || void 0,
          deliveryDate: deliveryDateInput || void 0
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast({
        type: "success",
        title: "Status yangilandi",
        message: `Buyurtma statusi: "${getStatusLabel(newStatus)}" ga o'zgartirildi.`
      });
      setSelectedOrder(data.order);
      setOrders((prev) => prev.map((o) => o.id === data.order.id ? data.order : o));
    } catch (err) {
      showToast({
        type: "error",
        title: "Xatolik",
        message: err.message
      });
    }
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !replyText.trim()) return;
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderRole: "tikuvchi",
          senderName: `${user.firstName} ${user.lastName}`,
          text: replyText.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSelectedOrder(data.order);
      setOrders((prev) => prev.map((o) => o.id === data.order.id ? data.order : o));
      setReplyText("");
      showToast({
        type: "success",
        title: "Xabar yuborildi",
        message: "Mijozga bildirishnoma yuborildi."
      });
    } catch (err) {
      showToast({
        type: "error",
        title: "Xatolik",
        message: err.message
      });
    }
  };
  const getStatusLabel = (status) => {
    switch (status) {
      case "yangi":
        return "Yangi Buyurtma";
      case "qabul_qilindi":
        return "Qabul Qilindi";
      case "bichilmoqda":
        return "Bichilmoqda (Mato kesish)";
      case "tikilmoqda":
        return "Tikilmoqda";
      case "primerka":
        return "O'lchov Kiyish (Primerka)";
      case "tayyor":
        return "Tayyor";
      case "topshirildi":
        return "Mijozga Topshirildi";
      default:
        return status;
    }
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "yangi":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "qabul_qilindi":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "bichilmoqda":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "tikilmoqda":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "primerka":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "tayyor":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-stone-100 text-stone-800 border-stone-200";
    }
  };
  const filteredOrders = orders.filter((o) => filterStatus === "all" || o.status === filterStatus);
  return <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2 text-amber-700 mb-1">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Buyurtmalar Boshqaruvi</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Mijozlar Buyurtmalari va Tikuv Jarayoni
          </h1>
          <p className="text-xs text-stone-500">
            Mijozlarning maxsus libos buyurtmalarini boshqaring, statusini o'zgartiring va xabarlashing.
          </p>
        </div>

        {
    /* Filter status buttons */
  }
        <div className="flex flex-wrap gap-1.5">
          {[
    { id: "all", label: "Barchasi" },
    { id: "yangi", label: "Yangi" },
    { id: "tikilmoqda", label: "Tikilmoqda" },
    { id: "primerka", label: "Primerka" },
    { id: "tayyor", label: "Tayyor" }
  ].map((tab) => <button
    key={tab.id}
    onClick={() => setFilterStatus(tab.id)}
    className={`text-xs px-3 py-1.5 rounded-xl font-medium transition ${filterStatus === tab.id ? "bg-stone-900 text-white font-bold" : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"}`}
  >
              {tab.label}
            </button>)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {
    /* Left List of Orders */
  }
        <div className="lg:col-span-5 space-y-3">
          {filteredOrders.map((order) => <div
    key={order.id}
    onClick={() => {
      setSelectedOrder(order);
      setPriceInput(order.priceEstimate || "");
      setDeliveryDateInput(order.deliveryDate || "");
    }}
    className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${selectedOrder?.id === order.id ? "bg-amber-50/70 border-amber-400 ring-2 ring-amber-500/20 shadow-md" : "bg-white border-stone-200 hover:border-stone-300"}`}
  >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-stone-600">{order.orderNumber}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-stone-900">{order.customerName}</h4>
                <p className="text-xs text-amber-900 font-medium">{order.dressType}</p>
              </div>

              <div className="text-[11px] text-stone-500 line-clamp-1">{order.notes || "Maxsus libos"}</div>

              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-100">
                <span>{new Date(order.createdAt).toLocaleDateString("uz-UZ")}</span>
                {order.priceEstimate ? <span className="font-bold text-stone-700">
                    {order.priceEstimate.toLocaleString()} so'm
                  </span> : <span className="text-amber-700">Narx belgilanmagan</span>}
              </div>
            </div>)}

          {filteredOrders.length === 0 && <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 text-stone-400 text-xs">
              Ushbu toifada buyurtmalar mavjud emas.
            </div>}
        </div>

        {
    /* Right Detail Pane */
  }
        <div className="lg:col-span-7">
          {selectedOrder ? <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5">
              {
    /* Header */
  }
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {selectedOrder.orderNumber}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold font-serif text-stone-900 mt-1">
                    {selectedOrder.customerName}
                  </h2>
                  <p className="text-xs text-stone-500">
                    Mijoz tel: {selectedOrder.customerPhone || "Ko'rsatilmagan"} • {selectedOrder.customerEmail}
                  </p>
                </div>
              </div>

              {
    /* Status Update Control */
  }
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                  Buyurtma Statusini O'zgartirish:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
    { id: "qabul_qilindi", label: "1. Qabul qilindi" },
    { id: "bichilmoqda", label: "2. Bichilmoqda" },
    { id: "tikilmoqda", label: "3. Tikilmoqda" },
    { id: "primerka", label: "4. Primerka (Kiyish)" },
    { id: "tayyor", label: "5. Tayyor" },
    { id: "topshirildi", label: "6. Topshirildi" }
  ].map((st) => <button
    key={st.id}
    onClick={() => handleStatusChange(st.id)}
    className={`py-2 px-2.5 rounded-xl font-medium transition text-left text-xs ${selectedOrder.status === st.id ? "bg-amber-600 text-white font-bold shadow-sm" : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-100"}`}
  >
                      {st.label}
                    </button>)}
                </div>

                {
    /* Price and Delivery Date Set */
  }
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Xizmat Narxi (So'm):
                    </label>
                    <input
    type="number"
    step="10000"
    value={priceInput}
    onChange={(e) => setPriceInput(Number(e.target.value))}
    placeholder="Masalan: 450000"
    className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-mono font-bold"
  />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Topshirish Sanasi:
                    </label>
                    <input
    type="date"
    value={deliveryDateInput}
    onChange={(e) => setDeliveryDateInput(e.target.value)}
    className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs"
  />
                  </div>
                </div>
              </div>

              {
    /* Customer Wishes Details */
  }
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  Mijoz Hohish-Istaklari & Detallar:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-semibold text-stone-500 block mb-0.5">Libos Turi:</span>
                    <span className="font-bold text-stone-900">{selectedOrder.dressType}</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-semibold text-stone-500 block mb-0.5">Mato va Rang Tanlovi:</span>
                    <span className="font-bold text-stone-900">
                      {selectedOrder.fabricChoice || "Oddiy"} • {selectedOrder.colorPreference || "Standart"}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <span className="font-semibold text-stone-500 block mb-1">Mijoz Maxsus Istaklari:</span>
                  <p className="text-stone-800 leading-relaxed font-medium">
                    {selectedOrder.notes || "Maxsus hohishlar ko'rsatilmagan"}
                  </p>
                </div>

                {
    /* Measurements Summary if present */
  }
                {selectedOrder.measurements && Object.keys(selectedOrder.measurements).length > 0 && <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs">
                    <span className="font-bold text-amber-900 block mb-1.5">
                      📏 Mijoz O'lchovlari:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-[11px] font-mono">
                      {Object.entries(selectedOrder.measurements).map(([k, v]) => <div key={k} className="bg-white p-1.5 rounded-lg border border-amber-100 text-center">
                          <span className="block text-stone-400 text-[10px] uppercase">{k}</span>
                          <span className="font-bold text-stone-800">{String(v)} sm</span>
                        </div>)}
                    </div>
                  </div>}
              </div>

              {
    /* Direct Messaging with Customer */
  }
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center space-x-1.5">
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  <span>Mijoz Bilan Xabarlashuv:</span>
                </span>

                <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  {selectedOrder.messages && selectedOrder.messages.length > 0 ? selectedOrder.messages.map((msg, i) => <div
    key={i}
    className={`p-2.5 rounded-xl text-xs max-w-sm ${msg.senderRole === "tikuvchi" ? "bg-amber-600 text-white ml-auto" : "bg-white text-stone-800 border border-stone-200 mr-auto"}`}
  >
                        <div className="text-[10px] font-semibold opacity-80 mb-0.5">{msg.senderName}</div>
                        <div>{msg.text}</div>
                      </div>) : <div className="text-center text-xs text-stone-400 py-3">Xabarlar mavjud emas</div>}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
    type="text"
    placeholder="Mijozga xabar yozing (masalan: ertaga soat 15:00 da o'lchov olish uchun kuting)..."
    value={replyText}
    onChange={(e) => setReplyText(e.target.value)}
    className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500/40"
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
            </div> : <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-400 text-xs">
              Buyurtma tafsilotlarini ko'rish uchun chap tomondan birontasini tanlang.
            </div>}
        </div>
      </div>
    </div>;
};
export {
  TailorDashboard
};
