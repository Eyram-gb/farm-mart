/* eslint-disable @next/next/no-img-element */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { parseEther } from "viem";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const SellForm = () => {
  const [form, setForm] = useState({
    produce: "",
    unit: "kg",
    unitPrice: "",
    available: "",
    metadata: "",
    image: null as File | null | string,
  });
    // Fetch all listings from IPFS API
    const fetchAllListings = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/ipfs/upload", {
          method: "GET",
        });
        const data = await res.json();
        console.log("All listings:", data);
        // You can set state here if you want to display listings
        // setListings(data.listings);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };
  const [preview, setPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const { writeContractAsync, isPending } = useScaffoldWriteContract("FarmMart");

  const handleListProduce = async () => {
    console.log('list produce fn')
    try {
      await writeContractAsync(
        {
          functionName: "list",
          args: [
            form.produce,
            form.unit,
            parseEther(form.unitPrice),
            BigInt(form.available),
            form.metadata,
          ],
        },
        {
          onBlockConfirmation: txnReceipt => {
            console.log("📦 Transaction blockHash", txnReceipt.blockHash);
          },
        },
      );
    } catch (e) {
      console.log("Error listing produce", e);
    }
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:4000/api/ipfs/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);
      if (data.success) {
        setForm(prev => ({ ...prev, metadata: data.url })); // 👈 set metadata to IPFS URL
        console.log("✅ Uploaded to IPFS:", data.url);
      } else {
        console.error("❌ Upload failed:", data.error);
      }
    } catch (err) {
      console.error("❌ Error uploading file:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0] || null;
  //   setForm(prev => ({ ...prev, image: file }));
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => setPreview(reader.result as string);
  //     reader.readAsDataURL(file);
  //   } else {
  //     setPreview(null);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    await handleListProduce();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10 px-4">
      {/* Example button to fetch all listings */}
      <button
        type="button"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 font-semibold mt-2"
        onClick={fetchAllListings}
      >
        Fetch All Listings
      </button>
      <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">Sell Your Produce</h1>
      <form
        className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 w-full max-w-md flex flex-col gap-5"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block font-semibold mb-1 text-green-800">Produce Name</label>
          <input
            type="text"
            name="produce"
            value={form.produce}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="e.g. Fresh Tomatoes"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-green-800">Unit</label>
          <input
            type="text"
            name="unit"
            value={form.unit}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="e.g. kg, box, bunch"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-green-800">Unit Price (ETH)</label>
          <input
            type="number"
            name="unitPrice"
            value={form.unitPrice}
            onChange={handleChange}
            required
            min="0"
            step="0.0001"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="e.g. 0.01"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-green-800">Available Quantity</label>
          <input
            type="number"
            name="available"
            value={form.available}
            onChange={handleChange}
            required
            min="1"
            step="1"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="e.g. 100"
          />
        </div>
        {/* <div>
          <label className="block font-semibold mb-1 text-green-800">Description / Metadata</label>
          <textarea
            name="metadata"
            value={form.metadata}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Describe your produce..."
          />
        </div> */}
        <div>
          <label className="block font-semibold mb-1 text-green-800">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {preview && (
            <img src={preview} alt="Preview" className="mt-3 w-32 h-32 object-contain rounded-lg border mx-auto" />
          )}
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 font-semibold mt-2"
        >
          {isPending ? <span className="loading loading-spinner loading-sm"></span> : "List Produce"}
        </button>
        {submitted && (
          <div className="text-green-700 font-semibold text-center mt-4">Your produce has been submitted!</div>
        )}
      </form>
    </div>
  );
};

// export default SellPage;
// import React from 'react'

const Sell = () => {
  return (
    <div>
      <SellForm />
    </div>
  );
};

export default Sell;
