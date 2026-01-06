"use client";

import { useEffect } from "react";

export default function StylesLoader() {
  // useEffect(() => {
  //   // Only load dashboard CSS files (app.css and custom.css)
  //   if (typeof window !== "undefined") {
  //     const existingAppCss = document.querySelector(
  //       'link[href="/css/style.css"]'
  //     );
  //     const existingCustomCss = document.querySelector(
  //       'link[href="/css/custom.css"]'
  //     );

  //     if (!existingAppCss) {
  //       const link1 = document.createElement("link");
  //       link1.rel = "stylesheet";
  //       link1.media = "all";
  //       document.head.appendChild(link1);
  //     }

  //     if (!existingCustomCss) {
  //       const link2 = document.createElement("link");
  //       link2.rel = "stylesheet";
  //       link2.href = "/css/custom.css";
  //       link2.media = "all";
  //       document.head.appendChild(link2);
  //     }
  //   }
  // }, []);

  return null;
}
