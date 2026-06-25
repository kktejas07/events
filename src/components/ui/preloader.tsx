"use client";

import { useEffect, useState } from "react";

export function Preloader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloader.style.display = "none";
      }
      document.body.classList.add("loaded");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div id="preloader" className="preloader">
      <div className="animation-preloader">
        <div className="spinner"></div>
        <div className="txt-loading">
          <span data-text-preloader="E" className="letters-loading">E</span>
          <span data-text-preloader="V" className="letters-loading">V</span>
          <span data-text-preloader="E" className="letters-loading">E</span>
          <span data-text-preloader="N" className="letters-loading">N</span>
          <span data-text-preloader="T" className="letters-loading">T</span>
          <span data-text-preloader="S" className="letters-loading">S</span>
        </div>
        <p className="text-center">Loading</p>
      </div>
      <div className="loader">
        <div className="row">
          <div className="col-3 loader-section section-left"><div className="bg"></div></div>
          <div className="col-3 loader-section section-left"><div className="bg"></div></div>
          <div className="col-3 loader-section section-right"><div className="bg"></div></div>
          <div className="col-3 loader-section section-right"><div className="bg"></div></div>
        </div>
      </div>
    </div>
  );
}