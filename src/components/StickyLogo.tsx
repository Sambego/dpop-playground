"use client";

export default function StickyLogo() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60]">
      <button
        onClick={scrollToTop}
        className="bg-black/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 hover:bg-black/20 cursor-pointer transition-all duration-300 hover:scale-105"
      >
        <h2 className="text-xl font-bold text-white">
          dpop.info
        </h2>
      </button>
    </div>
  );
}
