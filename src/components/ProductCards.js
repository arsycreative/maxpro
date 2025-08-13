"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function ProductCards() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);

  // Fetch data from Supabase - limit to 6 products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .neq("category", "Promo")
        .limit(6);

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

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

  // Skeleton Loader Card
  const SkeletonCard = () => (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/60 animate-pulse">
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-gray-200 h-8 w-24 rounded-full"></div>
      </div>
      <div className="absolute top-0 right-0 w-16 h-16 bg-gray-200 rounded-bl-2xl"></div>
      <div className="relative h-56 bg-gray-200"></div>
      <div className="p-8 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="h-16 bg-gray-200 rounded"></div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-12 bg-gray-200 rounded-2xl"></div>
      </div>
    </div>
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
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))
            : products.map((product, idx) => (
                <div
                  key={product.id}
                  onMouseEnter={() => setHoveredCard(product.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`group relative bg-white rounded-3xl overflow-hidden transition-all duration-700 ease-out ${
                    hoveredCard === product.id
                      ? "transform -translate-y-2 shadow-2xl shadow-slate-500/20"
                      : "shadow-lg shadow-slate-200/60"
                  }`}
                  style={{
                    animationDelay: `${idx * 0.1}s`,
                  }}
                >
                  {/* Premium Badge */}
                  <div className="absolute top-6 left-6 z-10">
                    <div className="bg-white/95 backdrop-blur-sm border border-red-100 text-red-600 px-4 py-2 rounded-full text-xs font-semibold shadow-lg">
                      {product.badge || "Premium Choice"}
                    </div>
                  </div>

                  {/* Red accent corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-red-500/20 to-transparent rounded-bl-2xl"></div>

                  {/* Image Container */}
                  <div
                    className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 cursor-pointer"
                    onClick={() => setModalImage(product)}
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={`object-cover transition-all duration-700 ${
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

                    {/* Click indicator on hover */}
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                        hoveredCard === product.id ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                        <svg
                          className="w-6 h-6 text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </div>
                    </div>
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
                              parseInt(product.price) /
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
                          {product.price}
                        </span>
                        <span className="text-slate-500 font-light">/hari</span>
                      </div>
                    </div>

                    {/* Description - maksimal 2 baris */}
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed font-light line-clamp-2">
                      {product.description}
                    </p>

                    {/* Features - maksimal 4 */}
                    <ul className="space-y-3 mb-8">
                      {product.features?.slice(0, 4).map((feat, i) => (
                        <li
                          key={i}
                          className="flex items-center space-x-3 text-slate-600 text-sm"
                        >
                          <div className="flex-shrink-0 w-6 h-6 bg-slate-50 rounded-full flex items-center justify-center">
                            <CheckIcon />
                          </div>
                          <span className="font-light">{feat}</span>
                        </li>
                      )) || (
                        // Fallback jika features tidak ada
                        <li className="flex items-center space-x-3 text-slate-600 text-sm">
                          <div className="flex-shrink-0 w-6 h-6 bg-slate-50 rounded-full flex items-center justify-center">
                            <CheckIcon />
                          </div>
                          <span className="font-light">Kualitas premium</span>
                        </li>
                      )}
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

        {/* No products message */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Belum Ada Produk
            </h3>
            <p className="text-gray-600">
              Produk sedang dalam tahap persiapan. Silakan cek kembali nanti.
            </p>
          </div>
        )}

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

        {/* Modal Image Preview */}
        {modalImage && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto no-scrollbar"
            onClick={() => setModalImage(null)}
          >
            <div
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto no-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setModalImage(null)}
                className="sticky top-2 left-full z-10 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg -ml-6 mb-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Modal Content */}
              <div className="bg-white rounded-xl overflow-hidden shadow-xl">
                {/* Image */}
                <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-200">
                  <Image
                    src={modalImage.image}
                    alt={modalImage.title}
                    fill
                    sizes="(max-width: 672px) 100vw, 672px"
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-4">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                        {modalImage.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400 text-base line-through font-light">
                          {modalImage.originalPrice}
                        </span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                          {modalImage.price}/hari
                        </span>
                      </div>
                    </div>
                    <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-semibold border border-red-100 whitespace-nowrap">
                      {modalImage.badge || "Premium Choice"}
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                    {modalImage.description}
                  </p>

                  {/* Features in modal - tampilkan semua */}
                  {modalImage.features && modalImage.features.length > 0 && (
                    <div className="mb-5">
                      <h4 className="text-base font-semibold text-slate-900 mb-3">
                        Fitur & Kelengkapan:
                      </h4>
                      <div className="grid grid-cols-1 gap-2 max-h-24 overflow-y-auto">
                        {modalImage.features.map((feat, i) => (
                          <div
                            key={i}
                            className="flex items-center space-x-2 text-slate-600 text-sm"
                          >
                            <div className="flex-shrink-0 w-5 h-5 bg-green-50 rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-green-600"
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
                            </div>
                            <span className="font-medium">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA Button in modal */}
                  <button
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-medium py-3 rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center space-x-2"
                    onClick={() => {
                      window.open("https://wa.me/6285712165658", "_blank");
                      setModalImage(null);
                    }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.594z" />
                    </svg>
                    <span>Konsultasi via WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
