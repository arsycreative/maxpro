"use client";

import React, { useState } from "react";

export default function ProductCards() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const products = [
    {
      id: 1,
      title: "Sewa Proyektor Bermacam Lumens",
      originalPrice: "400k",
      discountPrice: "300k",
      unit: "/unit",
      badge: "Premium Choice",
      description:
        "Cocok untuk acara di ruang tertutup, dengan berbagai opsi lumens sesuai screen.",
      features: [
        "Kualitas bagus",
        "Free HDMI",
        "Lumens sesuai kebutuhan",
        "Indoor only",
      ],
      image:
        "https://images.unsplash.com/photo-1495125175509-8fddf00e56cd?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      gradient: "from-slate-50 via-blue-50 to-indigo-50",
      shadowColor: "shadow-blue-500/10",
    },
    {
      id: 2,
      title: "Sewa TV LED Top Brand",
      originalPrice: "400k",
      discountPrice: "350k",
      unit: "/unit",
      badge: "Premium Choice",
      description:
        "Ideal untuk pameran atau presentasi, membuat acara lebih menarik.",
      features: [
        "Samsung / LG",
        "Standing Bracket opsional",
        "Ukuran 32-70 inch",
        "Indoor only",
      ],
      image:
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      gradient: "from-slate-50 via-emerald-50 to-teal-50",
      shadowColor: "shadow-emerald-500/10",
    },
    {
      id: 3,
      title: "Sewa TOA Megaphone",
      originalPrice: "200k",
      discountPrice: "115k",
      unit: "/unit",
      badge: "Premium Choice",
      description: "Megaphone TOA untuk outdoor events dan tour guide.",
      features: [
        "Brand TOA",
        "Battery C x6",
        "Suara nyaring",
        "Mudah digunakan",
      ],
      image:
        "https://img.freepik.com/free-photo/closeup-photo-megaphone-female-hand_627829-9405.jpg",
      gradient: "from-slate-50 via-yellow-50 to-orange-50",
      shadowColor: "shadow-yellow-500/10",
    },

    {
      id: 4,
      title: "Sewa Speaker Portable",
      originalPrice: "450k",
      discountPrice: "350k",
      unit: "/unit",
      badge: "Premium Choice",
      description: "Speaker portabel ringan, cocok indoor & outdoor.",
      features: [
        "Free 2x Mic Wireless",
        "12 inch speaker",
        "Battery-powered",
        "Mudah digunakan",
      ],
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      gradient: "from-slate-50 via-purple-50 to-violet-50",
      shadowColor: "shadow-purple-500/10",
    },
    {
      id: 5,
      title: "Sewa Flipchart Kokoh",
      originalPrice: "300k",
      discountPrice: "125k",
      unit: "/unit",
      badge: "Premium Choice",
      description: "Flipchart kokoh dengan kertas & penghapus gratis.",
      features: [
        "60x90 cm",
        "Kertas 10 lembar",
        "Mudah digunakan",
        "Free penghapus",
      ],
      image:
        "https://images.unsplash.com/photo-1652388274774-e312506edea5?q=80&w=1353&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      gradient: "from-slate-50 via-indigo-50 to-blue-50",
      shadowColor: "shadow-indigo-500/10",
    },
    {
      id: 6,
      title: "Sewa Screen Layar",
      originalPrice: "400k",
      discountPrice: "250k",
      unit: "/unit",
      badge: "Premium Choice",
      description: "Berbagai ukuran layar untuk hasil proyeksi optimal.",
      features: [
        "Banyak ukuran",
        "Indoor only",
        "Mudah digunakan",
        "Cocok untuk semua proyektor",
      ],
      image:
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      gradient: "from-slate-50 via-orange-50 to-amber-50",
      shadowColor: "shadow-orange-500/10",
    },
  ];

  const CheckIcon = () => (
    <svg
      className="w-4 h-4 text-slate-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );

  const WhatsAppIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.594z" />
    </svg>
  );

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-20 relative">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-[1.1]">
            Koleksi Produk
            <br />
            <span className="bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Premium Terlengkap
            </span>
          </h2>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
            Koleksi peralatan multimedia premium dengan standar kualitas
            internasional
          </p>

          {/* Red decorative line */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-red-300"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-red-300"></div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <div
              key={product.id}
              onMouseEnter={() => setHoveredCard(product.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative bg-white rounded-3xl overflow-hidden transition-all duration-700 ease-out ${
                hoveredCard === product.id
                  ? `transform -translate-y-2 shadow-2xl ${product.shadowColor}`
                  : "shadow-lg shadow-slate-200/60"
              }`}
              style={{
                animationDelay: `${idx * 0.1}s`,
              }}
            >
              {/* Premium Badge */}
              <div className="absolute top-6 left-6 z-10">
                <div className="bg-white/95 backdrop-blur-sm border border-red-100 text-red-600 px-4 py-2 rounded-full text-xs font-semibold shadow-lg">
                  {product.badge}
                </div>
              </div>

              {/* Red accent corner */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-red-500/20 to-transparent rounded-bl-2xl"></div>

              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                <img
                  src={product.image}
                  alt={product.title}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    hoveredCard === product.id
                      ? "scale-110 rotate-1"
                      : "scale-105"
                  }`}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent transition-opacity duration-500 ${
                    hoveredCard === product.id ? "opacity-70" : "opacity-40"
                  }`}
                ></div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Title */}
                <h3 className="text-xl font-semibold text-slate-900 mb-4 leading-tight">
                  {product.title}
                </h3>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-slate-400 text-lg line-through font-light">
                      {product.originalPrice}
                    </span>
                    <div className="px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-100">
                      Hemat{" "}
                      {Math.round(
                        (1 -
                          parseInt(product.discountPrice) /
                            parseInt(product.originalPrice)) *
                          100
                      )}
                      %
                    </div>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-sm text-slate-500 font-light">
                      Mulai dari
                    </span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                      {product.discountPrice}
                    </span>
                    <span className="text-slate-500 font-light">
                      {product.unit}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-sm mb-6 leading-relaxed font-light">
                  {product.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {product.features.map((feat, i) => (
                    <li
                      key={i}
                      className="flex items-center space-x-3 text-slate-600 text-sm"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-slate-50 rounded-full flex items-center justify-center">
                        <CheckIcon />
                      </div>
                      <span className="font-light">{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full group/btn relative overflow-hidden bg-gradient-to-r from-green-600 to-green-500 text-white font-medium py-4 rounded-2xl transition-all duration-300 ${
                    hoveredCard === product.id
                      ? "shadow-xl shadow-green-500/25 scale-[1.02]"
                      : "shadow-lg"
                  }`}
                  onClick={() =>
                    window.open("https://wa.me/6285712165658", "_blank")
                  }
                >
                  <div className="relative z-10 flex items-center justify-center space-x-3">
                    <WhatsAppIcon />
                    <span>Konsultasi Sekarang</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>

              {/* Subtle corner accent */}
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-red-500/5 to-transparent rounded-tr-3xl"></div>
            </div>
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center space-x-4 text-slate-400">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-red-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm font-light uppercase tracking-wider">
                Premium Quality Guaranteed
              </span>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-red-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
