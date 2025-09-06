import React from "react";

interface ProductCardProps {
  name: string;
  price: string;
  image: string;
  description: string;
  farmer: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, image, description, farmer }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex flex-col max-w-xs">
    <img src={image} alt={name} className="w-full h-40 object-cover rounded-md mb-2" />
    <h2 className="text-lg font-bold mb-1">{name}</h2>
    <p className="text-green-600 font-semibold mb-1">{price}</p>
    <p className="text-gray-700 mb-2">{description}</p>
    <p className="text-xs text-gray-500 mb-2">Farmer: {farmer}</p>
    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Buy Now</button>
  </div>
);

export default ProductCard;
