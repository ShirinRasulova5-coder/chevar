import { Scissors, Palette, Ruler, Calculator, ShoppingBag, LogOut, Upload } from "lucide-react";
const Navbar = ({ user, activeTab, onSelectTab, onLogout }) => {
  if (!user) return null;
  const isTailor = user.role === "tikuvchi";
  return <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {
    /* Logo and Brand */
  }
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab(isTailor ? "studio" : "my_orders")}>
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-md">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-lg text-stone-900 tracking-tight">ChevarMaster</span>
                <span
    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${isTailor ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-emerald-100 text-emerald-800 border border-emerald-300"}`}
  >
                  {isTailor ? "✂️ Tikuvchi-Usta" : "👗 Mijoz"}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                {isTailor ? user.salonName || "Professional Tikuvchilik Studiyasi" : "Maxsus Liboslar Buyurtma Portali"}
              </p>
            </div>
          </div>

          {
    /* Navigation Links */
  }
          <nav className="hidden md:flex items-center space-x-1">
            {isTailor ? (
    // Tikuvchi Menusi
    <>
                <button
      onClick={() => onSelectTab("studio")}
      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${activeTab === "studio" ? "bg-stone-900 text-white shadow-sm" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"}`}
    >
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>Eskiz Studiyasi</span>
                </button>

                <button
      onClick={() => onSelectTab("patterns")}
      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${activeTab === "patterns" ? "bg-stone-900 text-white shadow-sm" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"}`}
    >
                  <Scissors className="w-4 h-4 text-amber-400" />
                  <span>Andoza & Lekala</span>
                </button>

                <button
      onClick={() => onSelectTab("upload_sketch")}
      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${activeTab === "upload_sketch" ? "bg-stone-900 text-white shadow-sm" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"}`}
    >
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>Eskiz Yuklash & AI</span>
                </button>

                <button
      onClick={() => onSelectTab("measurements")}
      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${activeTab === "measurements" ? "bg-stone-900 text-white shadow-sm" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"}`}
    >
                  <Ruler className="w-4 h-4 text-amber-400" />
                  <span>O'lchov Olish</span>
                </button>

                <button
      onClick={() => onSelectTab("fabric_calc")}
      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${activeTab === "fabric_calc" ? "bg-stone-900 text-white shadow-sm" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"}`}
    >
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span>Mato Hisoblash</span>
                </button>

                <button
      onClick={() => onSelectTab("orders")}
      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${activeTab === "orders" ? "bg-stone-900 text-white shadow-sm" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"}`}
    >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Buyurtmalar</span>
                </button>
              </>
  ) : (
    // Mijoz Menusi
    <>
                <button
      onClick={() => onSelectTab("my_orders")}
      className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition ${activeTab === "my_orders" ? "bg-stone-900 text-white shadow-sm" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"}`}
    >
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>Mening Buyurtmalarim</span>
                </button>

                <button
      onClick={() => onSelectTab("new_order")}
      className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition ${activeTab === "new_order" ? "bg-stone-900 text-white shadow-sm" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"}`}
    >
                  <Palette className="w-4 h-4 text-emerald-400" />
                  <span>Yangi Buyurtma & Hohishlar</span>
                </button>

                <button
      onClick={() => onSelectTab("fabric_calc")}
      className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition ${activeTab === "fabric_calc" ? "bg-stone-900 text-white shadow-sm" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"}`}
    >
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span>Mato Sarfini Hisoblash</span>
                </button>
              </>
  )}
          </nav>

          {
    /* Right Action: User profile & Logout */
  }
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-stone-900">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-[10px] text-stone-500">
                {isTailor ? user.phone : user.email}
              </span>
            </div>

            <button
    onClick={onLogout}
    title="Chiqish"
    className="p-2 rounded-xl text-stone-500 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 transition"
  >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {
    /* Mobile Navigation Bar */
  }
        <div className="md:hidden flex items-center justify-around py-2 border-t border-stone-100 text-[11px] overflow-x-auto space-x-1">
          {isTailor ? <>
              <button
    onClick={() => onSelectTab("studio")}
    className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === "studio" ? "text-amber-700 font-bold" : "text-stone-600"}`}
  >
                <Palette className="w-4 h-4 mb-0.5" />
                <span>Eskiz</span>
              </button>
              <button
    onClick={() => onSelectTab("patterns")}
    className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === "patterns" ? "text-amber-700 font-bold" : "text-stone-600"}`}
  >
                <Scissors className="w-4 h-4 mb-0.5" />
                <span>Lekala</span>
              </button>
              <button
    onClick={() => onSelectTab("upload_sketch")}
    className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === "upload_sketch" ? "text-amber-700 font-bold" : "text-stone-600"}`}
  >
                <Upload className="w-4 h-4 mb-0.5" />
                <span>AI Tekshiruv</span>
              </button>
              <button
    onClick={() => onSelectTab("measurements")}
    className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === "measurements" ? "text-amber-700 font-bold" : "text-stone-600"}`}
  >
                <Ruler className="w-4 h-4 mb-0.5" />
                <span>O'lchov</span>
              </button>
              <button
    onClick={() => onSelectTab("fabric_calc")}
    className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === "fabric_calc" ? "text-amber-700 font-bold" : "text-stone-600"}`}
  >
                <Calculator className="w-4 h-4 mb-0.5" />
                <span>Mato</span>
              </button>
              <button
    onClick={() => onSelectTab("orders")}
    className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === "orders" ? "text-amber-700 font-bold" : "text-stone-600"}`}
  >
                <ShoppingBag className="w-4 h-4 mb-0.5" />
                <span>Buyurtma</span>
              </button>
            </> : <>
              <button
    onClick={() => onSelectTab("my_orders")}
    className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === "my_orders" ? "text-emerald-700 font-bold" : "text-stone-600"}`}
  >
                <ShoppingBag className="w-4 h-4 mb-0.5" />
                <span>Buyurtmalar</span>
              </button>
              <button
    onClick={() => onSelectTab("new_order")}
    className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === "new_order" ? "text-emerald-700 font-bold" : "text-stone-600"}`}
  >
                <Palette className="w-4 h-4 mb-0.5" />
                <span>Yangi Fason</span>
              </button>
              <button
    onClick={() => onSelectTab("fabric_calc")}
    className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === "fabric_calc" ? "text-emerald-700 font-bold" : "text-stone-600"}`}
  >
                <Calculator className="w-4 h-4 mb-0.5" />
                <span>Mato Hisob</span>
              </button>
            </>}
        </div>
      </div>
    </header>;
};
export {
  Navbar
};
