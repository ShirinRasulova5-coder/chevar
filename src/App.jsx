/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from "react";
import { ToastProvider, useToast } from "./components/Toast";
import { AuthModal } from "./components/AuthModal";
import { Navbar } from "./components/Navbar";
import { SketchCanvas } from "./components/TailorStudio/SketchCanvas";
import { SketchUploadModal } from "./components/TailorStudio/SketchUploadModal";
import { MeasurementTool } from "./components/TailorStudio/MeasurementTool";
import { FabricCalculator } from "./components/TailorStudio/FabricCalculator";
import { PatternMaker } from "./components/TailorStudio/PatternMaker";
import { TailorDashboard } from "./components/TailorStudio/TailorDashboard";
import { CustomerDashboard } from "./components/CustomerPortal/CustomerDashboard";
function MainApp() {
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("studio");
  const [sketches, setSketches] = useState([]);
  const [calculatorMeasurements, setCalculatorMeasurements] = useState(void 0);
  const [patternMeasurements, setPatternMeasurements] = useState(void 0);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("chevar_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setActiveTab(parsed.role === "tikuvchi" ? "studio" : "my_orders");
      }
    } catch (e) {
      console.error(e);
    }
  }, []);
  useEffect(() => {
    fetch("/api/sketches").then((res) => res.json()).then((data) => setSketches(data || [])).catch((err) => console.error(err));
  }, []);
  const handleAuthSuccess = (loggedUser) => {
    setUser(loggedUser);
    localStorage.setItem("chevar_user", JSON.stringify(loggedUser));
    setActiveTab(loggedUser.role === "tikuvchi" ? "studio" : "my_orders");
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("chevar_user");
    showToast({
      type: "info",
      title: "Chiqildi",
      message: "Tizimdan muvaffaqiyatli chiqdingiz."
    });
  };
  const handleSelectTab = (tab) => {
    if (user?.role === "mijoz" && (tab === "studio" || tab === "patterns" || tab === "upload_sketch" || tab === "measurements" || tab === "orders")) {
      showToast({
        type: "error",
        title: "Kirish cheklangan",
        message: "Tikuvchilar bo'limiga mijozlar kira olmaydi! Bu faqat tasdiqlangan ustalar uchun."
      });
      return;
    }
    setActiveTab(tab);
  };
  const handleSendToCalculator = (meas) => {
    setCalculatorMeasurements(meas);
    setActiveTab("fabric_calc");
  };
  const handleSendToPatternMaker = (meas) => {
    setPatternMeasurements(meas);
    setActiveTab("patterns");
  };
  return <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {
    /* Mandatory Authentication Modal when user is not logged in */
  }
      <AuthModal isOpen={!user} onSuccess={handleAuthSuccess} />

      {
    /* Main App Bar when logged in */
  }
      {user && <>
          <Navbar
    user={user}
    activeTab={activeTab}
    onSelectTab={handleSelectTab}
    onLogout={handleLogout}
  />

          <main className="flex-1 pb-16">
            {
    /* TIKUVCHI (TAILOR) VIEWS */
  }
            {user.role === "tikuvchi" && <>
                {activeTab === "studio" && <SketchCanvas
    user={user}
    onSaveSketch={(newSketch) => setSketches([newSketch, ...sketches])}
  />}

                {activeTab === "patterns" && <PatternMaker
    user={user}
    initialMeasurements={patternMeasurements}
  />}

                {activeTab === "upload_sketch" && <SketchUploadModal
    user={user}
    onSketchUploaded={(newSketch) => {
      setSketches([newSketch, ...sketches]);
      setActiveTab("studio");
    }}
  />}

                {activeTab === "measurements" && <MeasurementTool
    user={user}
    onSendToCalculator={handleSendToCalculator}
    onSendToPatternMaker={handleSendToPatternMaker}
  />}

                {activeTab === "fabric_calc" && <FabricCalculator initialMeasurements={calculatorMeasurements} />}

                {activeTab === "orders" && <TailorDashboard user={user} />}
              </>}

            {
    /* MIJOZ (CUSTOMER) VIEWS */
  }
            {user.role === "mijoz" && <>
                {(activeTab === "my_orders" || activeTab === "new_order") && <CustomerDashboard user={user} onSelectTab={handleSelectTab} />}

                {activeTab === "fabric_calc" && <FabricCalculator initialMeasurements={calculatorMeasurements} />}
              </>}
          </main>
        </>}
    </div>;
}
function App() {
  return <ToastProvider>
      <MainApp />
    </ToastProvider>;
}
export {
  App as default
};
