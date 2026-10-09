import { createContext, useContext, useState } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
const ToastContext = createContext(void 0);
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const showToast = (toast) => {
    const id = "toast-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 4500);
  };
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  return <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {
    /* Toast Notification Container */
  }
      <div className="fixed top-5 right-5 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full px-4">
        {toasts.map((toast) => {
    let bgBorder = "bg-white border-stone-200 text-stone-900";
    let icon = <Info className="w-5 h-5 text-sky-600 flex-shrink-0" />;
    if (toast.type === "success") {
      bgBorder = "bg-emerald-50 border-emerald-300 text-emerald-950";
      icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
    } else if (toast.type === "error") {
      bgBorder = "bg-rose-50 border-rose-300 text-rose-950";
      icon = <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />;
    } else if (toast.type === "warning") {
      bgBorder = "bg-amber-50 border-amber-300 text-amber-950";
      icon = <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
    }
    return <div
      key={toast.id}
      className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start space-x-3 transition-all duration-300 transform translate-y-0 ${bgBorder}`}
    >
              {icon}
              <div className="flex-1 text-sm">
                <div className="font-semibold">{toast.title}</div>
                <div className="text-stone-700 text-xs mt-0.5 leading-relaxed">{toast.message}</div>
              </div>
              <button
      onClick={() => removeToast(toast.id)}
      className="text-stone-400 hover:text-stone-700 p-0.5 rounded transition"
    >
                <X className="w-4 h-4" />
              </button>
            </div>;
  })}
      </div>
    </ToastContext.Provider>;
};
const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
export {
  ToastProvider,
  useToast
};
