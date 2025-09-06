import React from "react";

const ImageUploader = () => (
  <div className="mb-4">
    <label className="block mb-1 font-medium text-gray-700">Image</label>
    <input type="file" className="w-full border border-gray-300 rounded px-3 py-2" disabled />
    <p className="text-xs text-gray-400 mt-1">Web3 image upload coming soon...</p>
  </div>
);

export default ImageUploader;
