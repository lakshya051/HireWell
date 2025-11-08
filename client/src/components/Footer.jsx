import React from "react";

function Footer() {
  return (
    <footer className="bg-transparent text-gray-400 py-10 px-6 font-inter border-t border-white/10">
      <div className="max-w-7xl mx-auto text-center text-sm">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold bg-gradient-to-r from-fuchsia-500 to-purple-500 text-gradient">HireWell</span> — All rights reserved.
        </p>
        <p className="mt-2">Developed with ❤️ by LAKSHYA VARSHNEY</p>
      </div>
    </footer>
  );
}

export default Footer;