"use client";

import * as React from "react";

export function Switch({ className = "", ...props }) {
  return (
    <label className={`relative inline-flex items-center cursor-pointer ${className}`}>
      <input type="checkbox" className="sr-only peer" {...props} />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform duration-200"></div>
    </label>
  );
}