"use client";

import { db } from "@/config/db";
import { Users } from "@/config/schema";
import React, { useContext, useEffect, useState } from "react";
import { UserDetailContext } from "../_context/UserDetailContext";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

function BuyCredits() {
  const Options = [
    {
      id: 1,
      price: 29.99, // Changed to ZAR
      credits: 10,
    },
    {
      id: 2,
      price: 44.99, // Changed to ZAR
      credits: 30,
    },
    {
      id: 3,
      price: 89.99, // Changed to ZAR
      credits: 75,
    },
    {
      id: 4,
      price: 149.99, // Changed to ZAR
      credits: 150,
    },
  ];

  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const { userDetail, setDetailContext } = useContext(UserDetailContext);
  const router = useRouter();
  const notify = (msg: string) => toast(msg);
  const notifyError = (msg: string) => toast.error(msg);

  useEffect(() => {
    if (selectedOption != 0) {
      const price = Options[selectedOption - 1].price;
      setSelectedPrice(price);
    }
  }, [selectedOption]);

  const initiatePayment = async () => {
    if (!selectedOption) {
      notifyError("Please select a credit package");
      return;
    }

    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedPrice,
          credits: Options[selectedOption - 1].credits,
          userEmail: userDetail.userEmail,
          itemName: `${Options[selectedOption - 1].credits} AI Tokens`,
        }),
      });

      if (!response.ok) {
        notifyError("Failed to initiate payment");
        return;
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        notifyError("Failed to initiate payment");
      }
    } catch (error) {
      notifyError("Error initiating payment");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen p-10 md:px-20 lg:px-40 text-center">
      <h2 className="text-4xl gradient-title font-bold">Add More Credits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 pt-10 gap-10 items-center justify-center">
        <div>
          {Options.map((option) => (
            <div
              key={option.id}
              className={`p-6 my-3 border bg-primary text-center rounded-lg cursor-pointer hover:scale-105 transition-all hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-700
                ${selectedOption === option.id && "bg-black"}
              `}
              onClick={() => setSelectedOption(option.id)}
            >
              <h2>
                Get {option.credits} Credits = {option.credits} Story
              </h2>
              <h2 className="font-bold text-2xl">R{option.price}</h2>
            </div>
          ))}
        </div>
        <div>
          {selectedPrice > 0 && (
            <button
              onClick={initiatePayment}
              className="w-full p-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg hover:scale-105 transition-all"
            >
              Pay with PayFast
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BuyCredits;
