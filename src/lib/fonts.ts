import localFont from "next/font/local";
export const jakarta = localFont({
  src: [
    { path: "../../public/fonts/jakarta-400.ttf", weight: "400" },
    { path: "../../public/fonts/jakarta-500.ttf", weight: "500" },
    { path: "../../public/fonts/jakarta-600.ttf", weight: "600" },
    { path: "../../public/fonts/jakarta-700.ttf", weight: "700" },
    { path: "../../public/fonts/jakarta-800.ttf", weight: "800" },
  ],
  variable: "--font-jakarta",
  display: "swap",
  preload: false,
});
export const barlow = localFont({
  src: [
    { path: "../../public/fonts/barlow-500.ttf", weight: "500" },
    { path: "../../public/fonts/barlow-600.ttf", weight: "600" },
    { path: "../../public/fonts/barlow-700.ttf", weight: "700" },
    { path: "../../public/fonts/barlow-800.ttf", weight: "800" },
  ],
  variable: "--font-barlow",
  display: "swap",
  preload: false,
});
