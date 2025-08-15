"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Check,
  MessageCircle,
  ArrowLeft,
  Zap,
  Shield,
  Clock,
  Award,
  Eye,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function CatalogDetailPage({ params }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const router = useRouter();

  // POPOVER state & refs
  // openFrom: null | "main" | "final"
  const [openFrom, setOpenFrom] = useState(null);
  const [popoverPos, setPopoverPos] = useState({
    top: 0,
    left: 0,
    placeAbove: false,
  });
  const mainBtnRef = useRef(null);
  const finalBtnRef = useRef(null);

  // Fetch product detail by ID
  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);

      try {
        const storedProduct = localStorage.getItem("selectedProduct");

        if (storedProduct) {
          const currentProduct = JSON.parse(storedProduct);
          setProduct(currentProduct);
          setLoading(false);

          const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", unwrappedParams.id)
            .single();

          if (!error && data) {
            setProduct(data);
            localStorage.setItem("selectedProduct", JSON.stringify(data));
          }
        } else {
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", unwrappedParams.id)
            .single();

          if (error) {
            console.error("Error fetching product:", error);
            router.push("/catalog");
            return;
          }

          if (data) {
            setProduct(data);
            localStorage.setItem("selectedProduct", JSON.stringify(data));
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in fetchProductDetail:", error);
        setLoading(false);
        router.push("/catalog");
      }
    };

    if (unwrappedParams?.id) {
      fetchProductDetail();
    }
  }, [unwrappedParams?.id, router]);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;

      setRelatedLoading(true);

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("category", product.category)
          .neq("id", product.id)
          .limit(3);

        if (error) {
          console.error("Error fetching related products:", error);
        } else {
          setRelatedProducts(data || []);
        }
      } catch (error) {
        console.error("Error in fetchRelatedProducts:", error);
      }

      setRelatedLoading(false);
    };

    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  const handleRelatedProductClick = (relatedProduct) => {
    localStorage.setItem("selectedProduct", JSON.stringify(relatedProduct));
    router.push(`/catalog/${relatedProduct.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Loading skeleton component
  const DetailSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <section className="relative pt-24 pb-12 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="container mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-6 w-32 bg-gray-600 rounded mb-6"></div>
          </div>
        </div>
      </section>

      <section className="py-8 lg:py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start animate-pulse">
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                <div className="aspect-square bg-gray-200"></div>
              </div>
              <div className="space-y-6">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  // POPOVER helpers
  function computePopoverPosition(rect, popWidth = 240, popHeight = 92) {
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = spaceAbove > popHeight + 12 && spaceAbove > spaceBelow;
    let top = placeAbove ? rect.top - popHeight - 8 : rect.bottom + 8;

    let left = rect.right - popWidth;
    const minLeft = 8;
    const maxLeft = window.innerWidth - popWidth - 8;
    if (left < minLeft) left = minLeft;
    if (left > maxLeft) left = maxLeft;

    return { top, left, placeAbove };
  }

  const openPopover = (which) => {
    const btn = which === "main" ? mainBtnRef.current : finalBtnRef.current;
    if (!btn) {
      setPopoverPos({
        top: Math.max(80, window.innerHeight / 2 - 46),
        left: Math.max(8, window.innerWidth / 2 - 120),
        placeAbove: false,
      });
    } else {
      const rect = btn.getBoundingClientRect();
      setPopoverPos(computePopoverPosition(rect));
    }
    setOpenFrom(which);
  };

  const closePopover = () => setOpenFrom(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!openFrom) return;
      const pop = document.getElementById("catalog-popover");
      if (pop && pop.contains(e.target)) return;
      const origin =
        openFrom === "main" ? mainBtnRef.current : finalBtnRef.current;
      if (origin && origin.contains(e.target)) return;
      setOpenFrom(null);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpenFrom(null);
    }

    if (openFrom) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keyup", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keyup", onKey);
    };
  }, [openFrom]);

  useEffect(() => {
    if (!openFrom) return;
    function recompute() {
      const btn =
        openFrom === "main" ? mainBtnRef.current : finalBtnRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      setPopoverPos(computePopoverPosition(rect));
    }
    recompute();
    window.addEventListener("resize", recompute);
    window.addEventListener("scroll", recompute, true);
    return () => {
      window.removeEventListener("resize", recompute);
      window.removeEventListener("scroll", recompute, true);
    };
  }, [openFrom]);

  const openWhatsApp = (context = "tanya produk") => {
    const phone = "6285712165658";
    const text =
      openFrom === "final"
        ? `Halo MAXPRO! Saya ingin menyewa ${product?.title} dengan harga ${product?.price}/hari. Mohon konfirmasi ketersediaan dan detail pembayaran.`
        : `Halo MAXPRO! Saya tertarik dengan ${product?.title}. Mohon info lebih lanjut untuk sewa produk ini.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    closePopover();
  };

  const openPortal = () => {
    window.open(
      "https://whatsform.com/10Gv8D",
      "_blank",
      "noopener,noreferrer"
    );
    closePopover();
  };

  if (loading) return <DetailSkeleton />;
  if (!product)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Produk tidak ditemukan</p>
          <button
            onClick={() => router.push("/catalog")}
            className="bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors duration-300"
          >
            Kembali ke Katalog
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Header */}
      <section className="relative pt-24 pb-12 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => router.push("/catalog")}
              className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali ke Katalog</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start"
            >
              {/* Product Image */}
              <motion.div variants={fadeInUp} className="lg:sticky lg:top-8">
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl">
                  <div className="aspect-square relative">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Product Details */}
              <motion.div
                variants={fadeInUp}
                className="space-y-6 lg:space-y-8"
              >
                {/* Badge & Category */}
                <div className="flex items-center gap-4">
                  {product.badge && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-full text-sm font-semibold">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      {product.badge}
                    </div>
                  )}
                  <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                </div>

                {/* Title & Rating */}
                <div>
                  <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    {product.title}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 lg:w-6 lg:h-6 ${
                            i < Math.floor(product.rating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-base lg:text-lg text-gray-600 font-medium">
                      {product.rating || 0}/5 Rating Excellent
                    </span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 lg:p-6 rounded-2xl border border-red-100">
                  {product.originalPrice && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 mb-2">
                      <span className="text-gray-500 text-lg lg:text-xl line-through">
                        {product.originalPrice}
                      </span>
                      <div className="px-3 py-2 bg-red-500 text-white text-xs lg:text-sm font-bold rounded-full w-fit">
                        HEMAT{" "}
                        {(() => {
                          const price =
                            parseInt(
                              String(product.price || "").replace(/\D/g, "")
                            ) || 0;
                          const originalPrice =
                            parseInt(
                              String(product.originalPrice || "").replace(
                                /\D/g,
                                ""
                              )
                            ) || 0;
                          if (!price || !originalPrice) return 0;
                          return Math.round((1 - price / originalPrice) * 100);
                        })()}
                        %
                      </div>
                    </div>
                  )}
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-2">
                    {product.price}
                    <span className="text-lg lg:text-xl text-gray-600 font-normal">
                      /hari
                    </span>
                  </div>
                  <p className="text-sm lg:text-base text-gray-600">
                    Harga sudah termasuk semua kelengkapan dan free setup
                  </p>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                    Deskripsi Produk
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-base lg:text-lg">
                    {product.description}
                  </p>
                </div>

                {/* Features */}
                {product.features && Array.isArray(product.features) && (
                  <div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">
                      Kelengkapan yang Didapat
                    </h3>
                    <div className="grid gap-3 lg:gap-4">
                      {product.features.map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-start space-x-3 bg-white p-3 lg:p-4 rounded-xl border border-gray-100 shadow-sm"
                        >
                          <Check className="w-4 h-4 lg:w-5 lg:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 font-medium text-sm lg:text-base">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Benefits */}
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">
                    Mengapa Pilih Produk Ini?
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
                    <div className="flex items-start space-x-3 lg:space-x-4 p-3 lg:p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2 text-sm lg:text-base">
                          Siap Pakai
                        </h4>
                        <p className="text-gray-600 text-xs lg:text-sm">
                          Setup cepat dan mudah, langsung bisa digunakan
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 lg:space-x-4 p-3 lg:p-4 bg-green-50 rounded-xl border border-green-100">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2 text-sm lg:text-base">
                          Kualitas Terjamin
                        </h4>
                        <p className="text-gray-600 text-xs lg:text-sm">
                          Peralatan premium dengan performa terbaik
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 lg:space-x-4 p-3 lg:p-4 bg-purple-50 rounded-xl border border-purple-100">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2 text-sm lg:text-base">
                          Support 24/7
                        </h4>
                        <p className="text-gray-600 text-xs lg:text-sm">
                          Tim teknis siap membantu kapan saja
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 lg:space-x-4 p-3 lg:p-4 bg-orange-50 rounded-xl border border-orange-100">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2 text-sm lg:text-base">
                          Garansi Puas
                        </h4>
                        <p className="text-gray-600 text-xs lg:text-sm">
                          Jaminan kepuasan atau uang kembali
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4 lg:pt-6">
                  <motion.button
                    ref={mainBtnRef}
                    onClick={() => openPopover("main")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full group bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-3 lg:py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3"
                  >
                    <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6" />
                    <span className="text-base lg:text-lg">Sewa Sekarang</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-8 lg:mb-12"
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Informasi Penting
              </h2>
              <p className="text-gray-600">
                Yang perlu Anda ketahui sebelum menyewa
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-6 lg:gap-8"
            >
              <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-lg text-center">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Durasi Sewa</h3>
                <p className="text-sm lg:text-base text-gray-600">
                  Fleksibel sesuai kebutuhan
                </p>
              </div>
              <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-lg text-center">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Jaminan</h3>
                <p className="text-sm lg:text-base text-gray-600">
                  Peralatan dalam kondisi prima
                </p>
              </div>
              <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-lg text-center">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Free Setup</h3>
                <p className="text-sm lg:text-base text-gray-600">
                  Instalasi dan testing gratis
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-8 lg:mb-12"
              >
                <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-4">
                  Produk Terkait
                </h2>
                <p className="text-lg lg:text-xl text-gray-600">
                  Produk lain dalam kategori {product.category} yang mungkin
                  Anda butuhkan
                </p>
              </motion.div>

              {relatedLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 animate-pulse"
                    >
                      <div className="h-48 lg:h-56 bg-gray-200"></div>
                      <div className="p-4 lg:p-6 space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8"
                >
                  {relatedProducts.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      onClick={() => handleRelatedProductClick(item)}
                      className="group relative bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 cursor-pointer hover:transform hover:-translate-y-2 hover:shadow-2xl"
                    >
                      {/* Image */}
                      <div className="relative h-48 lg:h-56 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                        {/* View Details Overlay */}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 z-10">
                          <div className="flex items-center space-x-2 text-white font-medium text-sm lg:text-base">
                            <Eye className="w-4 h-4 lg:w-5 lg:h-5" />
                            <span>Lihat Detail</span>
                            <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 lg:p-6">
                        {item.badge && (
                          <div className="flex justify-start mb-3">
                            <div className="bg-red-50 border border-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                              {item.badge}
                            </div>
                          </div>
                        )}

                        <div className="mb-4">
                          <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                            {item.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 lg:w-4 lg:h-4 ${
                                    i < Math.floor(item.rating || 0)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs lg:text-sm text-gray-600">
                              {item.rating || 0}/5
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          {item.originalPrice && (
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-gray-400 text-xs lg:text-sm line-through">
                                {item.originalPrice}
                              </span>
                              <div className="px-2 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full">
                                Save{" "}
                                {(() => {
                                  const price =
                                    parseInt(
                                      String(item.price || "0").replace(
                                        /\D/g,
                                        ""
                                      )
                                    ) || 0;
                                  const original =
                                    parseInt(
                                      String(item.originalPrice || "0").replace(
                                        /\D/g,
                                        ""
                                      )
                                    ) || 0;
                                  if (!original || original <= price) return 0;
                                  return Math.round(
                                    (1 - price / original) * 100
                                  );
                                })()}
                                %
                              </div>
                            </div>
                          )}
                          <div className="text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                            {item.price}/hari
                          </div>
                        </div>

                        <p className="text-gray-600 text-xs lg:text-sm line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-center mt-8 lg:mt-12"
              >
                <button
                  onClick={() => router.push("/catalog")}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold px-6 lg:px-8 py-3 lg:py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1 text-sm lg:text-base"
                >
                  <span>Lihat Semua Produk</span>
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-red-500 via-pink-500 to-orange-500">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-4 lg:mb-6">
              Siap Sewa {product.title}?
            </h2>
            <p className="text-base lg:text-lg xl:text-xl text-white/90 mb-6 lg:mb-8">
              Dapatkan harga terbaik dan kelengkapan lengkap. Tim MAXPRO siap
              membantu event Anda sukses!
            </p>
            <motion.button
              ref={finalBtnRef}
              onClick={() => openPopover("final")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-3 bg-white text-red-500 font-bold px-6 lg:px-8 py-3 lg:py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-sm lg:text-base xl:text-lg"
            >
              <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6" />
              <span>Pesan Sekarang</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* POPOVER - fixed */}
      {openFrom && (
        <motion.div
          id="catalog-popover"
          initial={{ opacity: 0, scale: 0.98, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 6 }}
          transition={{ duration: 0.12 }}
          style={{
            position: "fixed",
            top: popoverPos.top,
            left: popoverPos.left,
            width: 240,
            zIndex: 80,
          }}
          className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
          role="menu"
        >
          <button
            onClick={() => openWhatsApp()}
            className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50"
            role="menuitem"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
            </svg>
            <span className="text-sm text-gray-700">WhatsApp</span>
          </button>

          <button
            onClick={() => openPortal()}
            className="w-full text-left px-4 py-3 flex items-center gap-3 border-t border-gray-100 hover:bg-gray-50"
            role="menuitem"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 14L21 3m0 0v7m0-7h-7M3 21h18"
              />
            </svg>
            <span className="text-sm text-gray-700">Portal Penyewaan</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
