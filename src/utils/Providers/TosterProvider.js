"use client"

import { Toaster } from "sonner"

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      expand
      richColors
      closeButton
      duration={4000}
    />
  )}