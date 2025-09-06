/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Footer from "~~/components/layout/Footer";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
// import { ethers } from "ethers";


// import  Header from "~~/components/layout/Header";

const Home: NextPage = () => {
  
  const { address: connectedAddress } = useAccount();

  const { data: totalListings, isLoading: isTotalListings } = useScaffoldReadContract({
    contractName: "FarmMart",
    functionName: "listings",
    args: [BigInt(2)], // passing args to function as [bigint]
  });
  console.log("totalListings data:", totalListings);

  // const { data: connectedAddressCounter, isLoading: isConnectedAddressCounterLoading } = useScaffoldReadContract({
  //   contractName: "YourContract",
  //   functionName: "userGreetingCounter",
  // });


  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div
          className="min-h-screen flex flex-col font-sans relative bg-gray-50"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* <Header /> */}
          {/* Spacer for sticky header */}
          <div className="h-24" />
          <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 bg-white/20 backdrop-blur-xs rounded-2xl max-w-6xl mx-auto w-full mt-8 shadow-md">
            {/* Hero Section */}
            <section className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-green-700 mb-4">Welcome to FarmMart</h1>
              <p className="text-lg text-gray-700 mb-6">
                Buy and sell fresh farm produce on a decentralized marketplace.
              </p>
              {isTotalListings ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <p className="m-0">{totalListings ? totalListings[1].toString() : connectedAddress}</p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/marketplace"
                  className="bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700 font-semibold"
                >
                  Browse Marketplace
                </a>
                <a
                  href="/sell"
                  className="bg-white border border-green-600 text-green-700 px-6 py-3 rounded-xl shadow hover:bg-green-50 font-semibold"
                >
                  Sell Your Produce
                </a>
              </div>
            </section>

            {/* Benefits Section */}
            <section className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col items-center">
                <span className="text-3xl mb-2">🌱</span>
                <h2 className="font-bold mb-1">Fresh from the farm</h2>
                <p className="text-gray-600 text-sm text-center">
                  Get produce directly from local farmers, no middlemen.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col items-center">
                <span className="text-3xl mb-2">🔗</span>
                <h2 className="font-bold mb-1">Decentralized platform</h2>
                <p className="text-gray-600 text-sm text-center">Powered by Web3 for transparency and security.</p>
              </div>
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col items-center">
                <span className="text-3xl mb-2">💸</span>
                <h2 className="font-bold mb-1">Fair prices</h2>
                <p className="text-gray-600 text-sm text-center">Farmers earn more, buyers pay less.</p>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
