"use client";

import React, { useEffect, useState } from "react";
import { parseEther } from "viem";
// Listings fetched from API
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Marketplace = () => {
  // Helper to convert wei to ETH
  // const formatEth = (wei: string | number | bigint) => {
  //   if (!wei) return "0";
  //   const eth =
  //     typeof wei === "bigint" ? Number(wei) / 1e18 : typeof wei === "number" ? wei / 1e18 : Number(wei) / 1e18;
  //   return eth.toLocaleString(undefined, { maximumFractionDigits: 6 });
  // };
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state for buying
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { writeContractAsync, isPending } = useScaffoldWriteContract("FarmMart");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/listings", {
          method: "GET",
        });
        const data = await res.json();
        setProducts(data.listings || data);
      } catch {
        setError("Failed to fetch listings");
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const openBuyModal = (product: any) => {
    setSelectedProduct(product);
    setQuantity(1);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setIsSubmitting(true);
    try {
      // Validate unitPrice
      const priceWei = selectedProduct.unitPrice;
      if (priceWei === undefined || priceWei === null || isNaN(Number(priceWei))) {
        alert("Unit price is invalid or missing for this listing.");
        setIsSubmitting(false);
        return;
      }
      // Convert wei to ETH number before multiplying
      const priceEth = Number(priceWei) / 1e18;
      const totalEth = (priceEth * quantity).toString();
      console.log(selectedProduct);
      console.log(quantity);
      await writeContractAsync(
        {
          functionName: "buy",
          args: [BigInt(selectedProduct.listingId), BigInt(quantity)],
          value: parseEther(totalEth),
        },
        {
          onBlockConfirmation: txnReceipt => {
            console.log("📦 Transaction blockHash", txnReceipt.blockHash);
          },
        },
      );
      closeModal();
    } catch (err) {
      console.error("Error placing order", err);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">Marketplace</h1>
      {loading ? (
        <div className="text-center text-gray-500">Loading listings...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500">No listings found.</div>
          ) : (
            products.map((product, idx) => (
              <div
                key={product.id || idx}
                className="bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col items-center hover:shadow-lg transition-shadow max-w-xs overflow-hidden pb-6"
              >
                <img
                  src={product.image || product.metadata || "https://via.placeholder.com/400x200?text=No+Image"}
                  alt={product.produce || product.name || "Produce"}
                  className="w-full h-44 object-cover mb-4"
                />
                <h2 className="font-bold text-lg mb-1 text-green-800">{product.produce || product.name}</h2>
                <p className="text-gray-600 text-sm mb-2 text-center">
                  {product.description || product.metadata || "No description provided."}
                </p>
                <div className="font-semibold text-green-700 text-xl mb-4">
                  {product.unitPrice ? `${Number(product.unitPrice) / 1e18} ETH` : "$--"}
                </div>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 font-semibold"
                  onClick={() => openBuyModal(product)}
                >
                  Buy Now
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal for buying */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={closeModal}>
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-green-700">
              Buy {selectedProduct.produce || selectedProduct.name}
            </h2>
            <form onSubmit={handleBuy} className="flex flex-col gap-4">
              <div>
                <label className="block font-semibold mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={selectedProduct.available || 1}
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div className="text-gray-700">
                Total Price: {selectedProduct.unitPrice ? (Number(selectedProduct.unitPrice) / 1e18) * quantity : 0} ETH
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 font-semibold mt-2"
                disabled={isPending || isSubmitting}
              >
                {isPending || isSubmitting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Place Order"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
