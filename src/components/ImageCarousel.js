"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Eye, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const AdvancedImageCarousel = () => {
  const [images, setImages] = useState([]); // akan diisi dari Supabase
  const [previewIndex, setPreviewIndex] = useState(null);
  const [translateX, setTranslateX] = useState(0);
  const animationRef = useRef(null);
  const containerRef = useRef(null);

  // --- Fetch hanya kolom yang diperlukan ---
  useEffect(() => {
    let mounted = true;
    const fetchGallery = async () => {
      try {
        const { data: rows, error } = await supabase
          .from("gallery")
          .select("id, title, description, image_url, image_path, category")
          .order("created_at", { ascending: false })
          .limit(200); // ubah kalau perlu

        if (error) {
          console.error("Supabase error:", error);
          return;
        }
        if (!rows) return;

        const processed = rows
          .map((row) => {
            let url = row.image_url || null;

            // Jika memakai Supabase Storage path, buat public url
            // Ganti 'gallery' di bawah dengan nama bucket storage Anda
            if (!url && row.image_path) {
              const { publicURL } = supabase.storage
                .from("gallery")
                .getPublicUrl(row.image_path);
              url = publicURL;
            }

            return {
              id: row.id,
              url,
              title: row.title || "Untitled",
              description: row.description || "",
              category: row.category || "",
              alt: row.title || "gallery image",
            };
          })
          // buang entri tanpa url
          .filter((item) => item.url);

        if (mounted) setImages(processed);
      } catch (err) {
        console.error("Fetch exception:", err);
      }
    };

    fetchGallery();

    return () => {
      mounted = false;
    };
  }, []);

  // --- Carousel animation (infinite) ---
  // kartu lebar (width + gap) tetap, tapi pastikan responsif sesuai desain
  const cardWidth = 320;
  const duplicatedImages = [...images, ...images];
  const totalWidth = duplicatedImages.length * cardWidth;

  useEffect(() => {
    if (images.length === 0) return; // jangan animate kalau kosong

    const animate = () => {
      setTranslateX((prev) => {
        const newValue = prev - 1;
        if (Math.abs(newValue) >= images.length * cardWidth) {
          return 0;
        }
        return newValue;
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [images.length, cardWidth]);

  // --- Render ---
  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-20 overflow-hidden min-h-screen flex items-center">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-16 px-6">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-red-600 to-gray-900 bg-clip-text text-transparent">
            Galeri Equipment
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Koleksi lengkap peralatan multimedia profesional untuk segala
            kebutuhan event Anda
          </p>
        </div>

        {/* Infinite Carousel Container */}
        <div className="relative h-[400px] overflow-visible px-8">
          <div
            className="flex absolute top-0 left-0 h-full"
            style={{
              transform: `translateX(${translateX}px)`,
              width: `${totalWidth}px`,
            }}
            ref={containerRef}
          >
            {duplicatedImages.map((image, index) => {
              // index di duplicatedImages, tapi index % images.length
              const originalIndex = index % images.length;
              const item = duplicatedImages[index];
              return (
                <div
                  key={`${item.id}-${Math.floor(index / images.length)}`}
                  className="flex-shrink-0 w-90 h-full px-4 group cursor-pointer"
                  onClick={() => setPreviewIndex(originalIndex)}
                >
                  <div className="relative w-full h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 hover:border-red-500/50 transition-all duration-700 hover:scale-105 hover:-translate-y-4 z-10">
                    <Image
                      src={item.url}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      draggable={false}
                      sizes="320px"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 transition-opacity duration-500"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transition-all duration-500">
                      <h3 className="text-xl font-bold mb-2 drop-shadow-lg">
                        {item.title}
                      </h3>
                      <p className="text-sm opacity-90 drop-shadow-md leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewIndex(originalIndex);
                        }}
                        className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-xl border border-white/30"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-red-500/0 via-red-500/0 to-red-500/0 group-hover:from-red-500/20 group-hover:via-pink-500/20 group-hover:to-red-500/20 blur-xl transition-all duration-700 -z-10"></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute top-0 left-0 w-20 md:w-40 h-full bg-gradient-to-r from-gray-200 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-20 md:w-40 h-full bg-gradient-to-l from-gray-200 to-transparent z-20 pointer-events-none"></div>
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-16 px-6">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-lg font-medium">Live Gallery</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-gray-400"></div>
            <span className="text-lg font-medium">
              {images.length} Equipment Categories
            </span>
            <div className="hidden md:block w-px h-6 bg-gray-400"></div>
            <span className="text-lg font-medium">Premium Quality</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {previewIndex !== null && images[previewIndex] && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-6">
          <div className="relative max-w-6xl max-h-full animate-in zoom-in-95 duration-500">
            <Image
              src={images[previewIndex].url}
              alt={images[previewIndex].alt}
              width={1000}
              height={1000}
              className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl border-4 border-white/20"
            />
            <button
              onClick={() => setPreviewIndex(null)}
              className="absolute top-6 right-6 bg-black/50 backdrop-blur-md text-white p-4 rounded-full hover:bg-black/70 transition-all duration-300 hover:scale-110 shadow-2xl border border-white/30"
            >
              <X className="w-7 h-7" />
            </button>
            <div className="absolute bottom-8 left-8 text-white max-w-2xl">
              <h3 className="text-4xl font-bold mb-4 drop-shadow-2xl">
                {images[previewIndex].title}
              </h3>
              <p className="text-xl opacity-90 drop-shadow-lg leading-relaxed">
                {images[previewIndex].description}
              </p>
            </div>
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-red-500/20 via-pink-500/20 to-red-500/20 blur-2xl -z-10"></div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes zoom-in-95 {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-in {
          animation-fill-mode: both;
        }

        .zoom-in-95 {
          animation-name: zoom-in-95;
        }

        .duration-500 {
          animation-duration: 500ms;
        }
      `}</style>
    </section>
  );
};

export default AdvancedImageCarousel;
