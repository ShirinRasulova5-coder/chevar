import { useState } from "react";
import { useToast } from "./Toast";
import { Scissors, User as UserIcon, Lock, Mail, Phone, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
const AuthModal = ({ isOpen, onSuccess }) => {
  const { showToast } = useToast();
  const [role, setRole] = useState("mijoz");
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [tailorCode, setTailorCode] = useState("");
  const [salonName, setSalonName] = useState("");
  if (!isOpen) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLoginMode) {
        const payload = {
          role,
          loginKey: role === "tikuvchi" ? phone : email,
          password: role === "tikuvchi" ? tailorCode : password
        };
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) {
          showToast({
            type: "error",
            title: "Kirishda xatolik",
            message: data.error || "Login yoki parol noto'g'ri"
          });
          setIsLoading(false);
          return;
        }
        showToast({
          type: "success",
          title: "Xush kelibsiz!",
          message: data.message || "Tizimga muvaffaqiyatli kirdingiz"
        });
        onSuccess(data.user);
      } else {
        if (!firstName.trim() || !lastName.trim()) {
          showToast({
            type: "warning",
            title: "Ma'lumot yetarli emas",
            message: "Iltimos, ism va familiyangizni to'liq kiriting"
          });
          setIsLoading(false);
          return;
        }
        if (role === "tikuvchi") {
          if (tailorCode.trim() !== "10@188") {
            showToast({
              type: "error",
              title: "Maxsus parol noto'g'ri!",
              message: "Tikuvchining shaxsiy maxsus paroli noto'g'ri. Mijozlar bu bo'limdan o'ta olmaydi."
            });
            setIsLoading(false);
            return;
          }
          if (!phone.trim()) {
            showToast({
              type: "warning",
              title: "Telefon raqam shart",
              message: "Tikuvchi telefon raqamini kiritishi shart"
            });
            setIsLoading(false);
            return;
          }
        } else {
          if (!email.trim() || !password.trim()) {
            showToast({
              type: "warning",
              title: "Email va parol shart",
              message: "Mijoz email va parolni to'liq kiritishi kerak"
            });
            setIsLoading(false);
            return;
          }
        }
        const payload = {
          role,
          firstName,
          lastName,
          email,
          phone,
          password,
          tailorCode,
          salonName
        };
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) {
          showToast({
            type: "error",
            title: "Ro'yxatdan o'tishda xatolik",
            message: data.error || "Ma'lumotlarni saqlab bo'lmadi"
          });
          setIsLoading(false);
          return;
        }
        showToast({
          type: "success",
          title: "Tabriklaymiz!",
          message: "Siz muvaffaqiyatli ro'yxatdan o'tdingiz! Platformaga xush kelibsiz.",
          duration: 6e3
        });
        onSuccess(data.user);
      }
    } catch (err) {
      console.error(err);
      showToast({
        type: "error",
        title: "Tizim xatoligi",
        message: "Server bilan bog'lanishda xatolik yuz berdi"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const fillDemoTailor = () => {
    setRole("tikuvchi");
    setFirstName("Mohira");
    setLastName("Usmonova");
    setPhone("+998 90 123 45 67");
    setTailorCode("10@188");
    setSalonName("Atelier Mohira Couture");
  };
  const fillDemoCustomer = () => {
    setRole("mijoz");
    setFirstName("Zuhra");
    setLastName("Aliyeva");
    setEmail("zuhra@example.com");
    setPassword("password123");
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {
    /* Header Banner */
  }
        <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 mb-3 shadow-inner">
            <Scissors className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="text-2xl font-serif font-bold tracking-tight text-white">ChevarMaster</h2>
          <p className="text-stone-300 text-xs mt-1 max-w-xs mx-auto">
            Tikuvchilar uchun professional eskiz studiyasi va mijozlar buyurtma portali
          </p>
        </div>

        {
    /* Role Selection Tabs */
  }
        <div className="p-6 pb-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
            Kim sifatida kirmoqchisiz?
          </label>
          <div className="grid grid-cols-2 gap-3 p-1 bg-stone-100 rounded-2xl">
            <button
    type="button"
    onClick={() => {
      setRole("mijoz");
      setIsLoginMode(false);
    }}
    className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${role === "mijoz" ? "bg-white text-stone-900 shadow-md font-semibold" : "text-stone-600 hover:text-stone-900"}`}
  >
              <UserIcon className="w-4 h-4 text-emerald-600" />
              <span>Mijoz (Buyurtmachi)</span>
            </button>
            <button
    type="button"
    onClick={() => {
      setRole("tikuvchi");
      setIsLoginMode(false);
    }}
    className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${role === "tikuvchi" ? "bg-white text-stone-900 shadow-md font-semibold" : "text-stone-600 hover:text-stone-900"}`}
  >
              <Scissors className="w-4 h-4 text-amber-600" />
              <span>Tikuvchi (Usta)</span>
            </button>
          </div>
        </div>

        {
    /* Mode Toggle: Register vs Login */
  }
        <div className="px-6 flex justify-between items-center text-xs text-stone-500 border-b border-stone-100 pb-3">
          <span className="font-medium text-stone-700">
            {role === "tikuvchi" ? "✂️ Tikuvchilar Ustaxonasi (Maxsus kod talab etiladi)" : "👗 Mijozlar Portali (Faqat email va parol)"}
          </span>
          <button
    type="button"
    onClick={() => setIsLoginMode(!isLoginMode)}
    className="text-amber-700 hover:text-amber-900 font-semibold underline transition"
  >
            {isLoginMode ? "Yangi hisob ochish (Ro'yxatdan o'tish)" : "Menda allaqachon hisob bor (Kirish)"}
          </button>
        </div>

        {
    /* Form Body */
  }
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLoginMode && <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Ismingiz *</label>
                <input
    type="text"
    required
    placeholder="Ism"
    value={firstName}
    onChange={(e) => setFirstName(e.target.value)}
    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
  />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Familiyangiz *</label>
                <input
    type="text"
    required
    placeholder="Familiya"
    value={lastName}
    onChange={(e) => setLastName(e.target.value)}
    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
  />
              </div>
            </div>}

          {
    /* Role specific inputs */
  }
          {role === "mijoz" ? <>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Email manzilingiz *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
    type="email"
    required
    placeholder="misol@gmail.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Parolingiz *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
    type="password"
    required
    placeholder="Maxfiy parolingiz"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
  />
                </div>
              </div>
            </> : (
    // Tikuvchi Form
    <>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Telefon raqamingiz *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
      type="tel"
      required
      placeholder="+998 90 123 45 67"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
    />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-amber-900 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Tikuvchining Shaxsiy Maxsus Paroli *10@188</span>
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-amber-500 absolute left-3.5 top-3" />
                  <input
      type="password"
      required
      placeholder="Maxsus parolingizni kiriting"
      value={tailorCode}
      onChange={(e) => setTailorCode(e.target.value)}
      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
    />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Ushbu maxsus paroldan faqat ro'yxatdan o'tgan professional tikuvchilar foydalana oladi. Mijozlar kirishi taqiqlangan.
                </p>
              </div>

              {!isLoginMode && <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Atelier yoki Salon nomi (Ixtiyoriy)
                  </label>
                  <input
      type="text"
      placeholder="Masalan: Dilfuza Couture Atelier"
      value={salonName}
      onChange={(e) => setSalonName(e.target.value)}
      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
    />
                </div>}
            </>
  )}

          {
    /* Submit Button */
  }
          <button
    type="submit"
    disabled={isLoading}
    className="w-full mt-2 py-3 px-4 bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white font-medium text-sm rounded-xl shadow-lg shadow-stone-900/10 flex items-center justify-center space-x-2 transition disabled:opacity-50"
  >
            {isLoading ? <span>Tekshirilmoqda...</span> : <>
                <span>
                  {isLoginMode ? role === "tikuvchi" ? "Tikuvchi Ustaxonasiga Kirish" : "Mijoz Portaliga Kirish" : "Ro'yxatdan O'tish va Kirish"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>}
          </button>

          {
    /* Quick Demo Pre-fill for Testing */
  }
          <div className="pt-3 border-t border-stone-100">
            <div className="text-[11px] text-stone-400 text-center mb-2 flex items-center justify-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Tezkor sinab ko'rish uchun tayyor namunalar:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
    type="button"
    onClick={fillDemoCustomer}
    className="py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition text-left"
  >
                👤 <b>Mijoz namuna</b> (Zuhra)
              </button>
              <button
    type="button"
    onClick={fillDemoTailor}
    className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg transition text-left border border-amber-200/50"
  >
                ✂️ <b>Tikuvchi namuna</b> (Usta)
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>;
};
export {
  AuthModal
};
