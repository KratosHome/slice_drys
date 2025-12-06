"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tabsOrder } from "@/data/tabs-order";
import { useEffect } from "react";

const url = process.env.NEXT_URL;

interface StatusCountResponse {
  success: boolean;
  data: {
    new?: number;
    awaitingPayment?: number;
    awaitingShipment?: number;
    shipped?: number;
    awaitingReturn?: number;
    [key: string]: number | undefined;
  };
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; ordersId: string }>;
}) {
  const pathname = usePathname();

  const [status, setStatus] = useState<StatusCountResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${url}/api/orders/get-status-count`);
      const json = await res.json();
      setStatus(json);
    };

    fetchData();
  }, []);

  const statusStyles: Record<string, string> = {
    new: "bg-red-500 text-white",
    "awaiting-payment": "bg-amber-400! text-white",
    "awaiting-shipment": "bg-blue-500 text-white",
    shipped: "bg-green-500 text-whit e",
    "awaiting-return": "bg-orange-500 text-white",
  };

  const orderCountByStatus: Record<string, number> = {
    new: status?.data?.new || 0,
    "awaiting-payment": status?.data?.awaitingPayment || 0,
    "awaiting-shipment": status?.data?.awaitingShipment || 0,
    shipped: status?.data?.shipped || 0,
    "awaiting-return": status?.data?.awaitingReturn || 0,
  };

  return (
    <>
      <div className="flex flex-wrap justify-between gap-1 border-gray-300 bg-transparent">
        {tabsOrder.map((tab) => {
          const isActive = pathname.includes(tab.value);
          const count = orderCountByStatus[tab.value] || 0;
          const badgeStyles = statusStyles[tab.value] || "";

          return (
            <div
              key={tab.value}
              className="relative flex flex-col items-center"
            >
              {count > 0 && (
                <div
                  className={`absolute -top-2 -right-2 flex size-6 items-center justify-center overflow-hidden rounded-full ${badgeStyles}`}
                >
                  {count}
                </div>
              )}

              <Link
                href={`/uk/admin/${tab.value}`}
                className={`flex flex-col items-center gap-2 rounded-md border-[1px] border-black/30 px-2 py-1 ${
                  isActive ? "border-black" : "bg-transparent text-black"
                }`}
              >
                <div className="flex h-full w-full items-center justify-center">
                  {tab.icon}
                </div>
                <div>{tab.label}</div>
              </Link>
            </div>
          );
        })}
      </div>
      <div>{children}</div>
    </>
  );
}
