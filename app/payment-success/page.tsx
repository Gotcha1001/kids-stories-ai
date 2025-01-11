"use client"; // Make sure you're using a client-side component

import React from "react";
import Head from "next/head";
import { useSearchParams } from "next/navigation";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const itemName = searchParams.get("item_name");
  const amount = searchParams.get("amount");

  return (
    <>
      <Head>
        <title>Payment Success</title>
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-black to-white">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Successful Payment
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Thank you for your payment
          </p>
          <div className="w-64 h-64 mx-auto mb-8">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdr1DMONakU9MUecTXVHg290MknEaXlFRhrA&s"
              alt="Success"
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
          <p className="text-lg text-gray-700 mb-4">Item: {itemName}</p>
          <p className="text-lg text-gray-700 mb-4">Amount: ${amount}</p>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccessPage;
