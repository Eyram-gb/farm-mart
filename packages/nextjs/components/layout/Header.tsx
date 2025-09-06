"use client";

// import ConnectButton from '@/lib/wallet-modal';
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// import ConnectButton from '../../lib/wallet-modal';

const Header = () => (
  <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[90%] bg-white/70 backdrop-blur border border-gray-200 shadow-md rounded-full font-sans transition-all">
    <div className="flex justify-between items-center px-6 py-2">
      <h1 className="font-bold text-2xl text-green-700 tracking-tight">FarmMart</h1>
      <nav className="space-x-4 flex items-center">
        <Link href="/" className="text-base text-gray-700 font-semibold hover:text-green-600 transition">
          Home
        </Link>
        <Link href="/marketplace" className="text-base text-gray-700 font-semibold hover:text-green-600 transition">
          Marketplace
        </Link>
        <Link href="/sell" className="text-base text-gray-700 font-semibold hover:text-green-600 transition">
          Sell
        </Link>
        <Link href="/profile" className="text-base text-gray-700 font-semibold hover:text-green-600 transition">
          Profile
        </Link>
        {/* <button
                    className="ml-4 bg-green-600 text-white px-5 py-2 rounded-full font-semibold shadow-md border border-green-600 hover:bg-green-700 transition"
                    onClick={() => alert('Connect wallet logic goes here!')}
                >
                    Connect Wallet
                </button> */}
        <ConnectButton />
      </nav>
    </div>
  </header>
);

export default Header;
