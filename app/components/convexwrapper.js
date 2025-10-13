'use client';
import { ConvexReactClient } from "convex/react";
import { ConvexProvider } from "convex/react";
import React from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined");
}
const convex = new ConvexReactClient(convexUrl);

/**
 * @typedef {Object} ConvexProviderWrapperProps
 * @property {React.ReactNode} children - The child components.
 */

/**
 * ConvexProviderWrapper component
 * @param {ConvexProviderWrapperProps} props
 */
export const ConvexProviderWrapper = ({ children }) => {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
};