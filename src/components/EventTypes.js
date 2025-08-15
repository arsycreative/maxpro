// components/EventTypes.js
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function EventTypes() {
  const eventTypes = [
    {
      id: 1,
      title: "Meeting",
      subtitle: "(3-10 orang)",
      image:
        "https://images.pexels.com/photos/1181395/pexels-photo-1181395.jpeg",
      description: "Solusi lengkap untuk meeting kecil dan presentasi bisnis",
      features: ["Proyektor HD", "Screen portabel", "Speaker kecil"],
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/30 hover:border-blue-500/60",
    },
    {
      id: 2,
      title: "Seminar",
      subtitle: "(>30 orang)",
      image:
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop&crop=center",
      description: "Peralatan profesional untuk seminar dan workshop besar",
      features: ["Proyektor High Lumens", "Screen besar", "Sound system"],
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400",
      borderColor: "border-green-500/30 hover:border-green-500/60",
    },
    {
      id: 3,
      title: "Wedding",
      subtitle: "indoor gedung",
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop&crop=center",
      description:
        "Buat momen spesial menjadi tak terlupakan dengan AV terbaik",
      features: ["TV LED besar", "Sound romantic", "Lighting mood"],
      gradient: "from-pink-500/20 to-rose-500/20",
      iconColor: "text-pink-400",
      borderColor: "border-pink-500/30 hover:border-pink-500/60",
    },
    {
      id: 4,
      title: "Pameran",
      subtitle: "indoor hall",
      image:
        "https://images.squarespace-cdn.com/content/v1/5423dde2e4b00c40b1ccf4cb/b5ba2efe-21aa-4bc3-80d2-012999f58fd4/IMG_9791_textron_aviation_australasia_customer_conference_2020_novasoma_photography.jpg",
      description: "Display produk dengan teknologi multimedia terdepan",
      features: ["TV LED multiple", "Digital signage", "Interactive display"],
      gradient: "from-purple-500/20 to-violet-500/20",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/30 hover:border-purple-500/60",
    },
  ];

  // state: id event yang popovernya terbuka (null = tidak ada)
  const [openContactForId, setOpenContactForId] = useState(null);
  // posisi popover di viewport (fixed)
  const [popoverPos, setPopoverPos] = useState({
    top: 0,
    left: 0,
    placeAbove: true,
  });

  // refs untuk button tiap kartu
  const buttonRefs = useRef({});

  // Hitung posisi popover berdasarkan bounding rect tombol
  function computePopoverPosition(rect) {
    const popoverW = 220; // px target width for popover
    const popoverH = 84; // estimated height

    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    const placeAbove = spaceAbove > popoverH + 12;
    let top = placeAbove ? rect.top - popoverH - 8 : rect.bottom + 8;

    // Align popover right edge with button right edge, then clamp
    let left = rect.right - popoverW;
    const minLeft = 8;
    const maxLeft = window.innerWidth - popoverW - 8;
    if (left < minLeft) left = minLeft;
    if (left > maxLeft) left = maxLeft;

    return { top, left, placeAbove };
  }

  useEffect(() => {
    function handleDocClick(e) {
      // if clicked outside any button and popover -> close
      if (!openContactForId) return;
      const btn = buttonRefs.current[openContactForId];
      if (btn && !btn.contains(e.target)) {
        // also check popover element by id
        const pop = document.getElementById("eventtypes-popover");
        if (pop && pop.contains(e.target)) return; // clicked inside popover
        setOpenContactForId(null);
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") setOpenContactForId(null);
    }

    if (openContactForId !== null) {
      document.addEventListener("mousedown", handleDocClick);
      document.addEventListener("keyup", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keyup", handleEscape);
    };
  }, [openContactForId]);

  // recompute position on resize/scroll when open
  useEffect(() => {
    if (openContactForId == null) return;
    function recompute() {
      const btn = buttonRefs.current[openContactForId];
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
  }, [openContactForId]);

  // open whatsapp (with nomor & pesan)
  const openWhatsApp = (title) => {
    const phone = "6285712165658"; // ganti jika perlu
    const text = `Halo, saya mau tanya tentang ${title}`;
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
    setOpenContactForId(null);
  };

  // open portal
  const openPortal = (portalUrl = "https://whatsform.com/10Gv8D") => {
    window.open(portalUrl, "_blank", "noopener,noreferrer");
    setOpenContactForId(null);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-black/30 relative">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(circle at center, black 60%, transparent 100%)",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Pilih Jenis <span className="text-gradient">Event Anda</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Apapun acaranya,{" "}
            <span className="text-red-500 font-semibold">MAXPRO</span>{" "}
            pilihanya.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {eventTypes.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              className={`card-glass rounded-2xl overflow-hidden bg-gradient-to-br ${event.gradient} border-2 ${event.borderColor} transition-all duration-300 group backdrop-blur-sm`}
            >
              {/* Image (Next/Image) */}
              <div className="relative h-48 lg:h-52 overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                    {event.title}
                  </h3>
                  <p className={`text-lg font-medium ${event.iconColor}`}>
                    {event.subtitle}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8">
                <p className="text-gray-300 text-sm lg:text-base mb-6 leading-relaxed">
                  {event.description}
                </p>

                {/* Features */}
                <div className="mb-8">
                  <ul className="space-y-2">
                    {event.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                        viewport={{ once: true }}
                        className="text-gray-400 text-sm flex items-center space-x-2"
                      >
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></div>
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* WhatsApp Button (we only store ref, popover rendered outside) */}
                <div className="relative">
                  <motion.button
                    ref={(el) => (buttonRefs.current[event.id] = el)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const btn = buttonRefs.current[event.id];
                      if (!btn) {
                        setOpenContactForId(null);
                        return;
                      }
                      const rect = btn.getBoundingClientRect();
                      setPopoverPos(computePopoverPosition(rect));
                      setOpenContactForId((prev) =>
                        prev === event.id ? null : event.id
                      );
                    }}
                    aria-haspopup="menu"
                    aria-expanded={openContactForId === event.id}
                    className="btn-whatsapp w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-green-600 hover:bg-green-700"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                    </svg>
                    <span>Konsultasi</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Flow Indicator to Next Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-center mt-16"
        >
          {/* Animated Arrow */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
            <div className="w-px h-8 bg-gradient-to-b from-red-500/60 to-transparent"></div>
          </motion.div>
        </motion.div>

        {/* POPOVER rendered here as fixed element so it won't be clipped by card overflow */}
        {openContactForId && (
          <motion.div
            id="eventtypes-popover"
            initial={{ opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
            transition={{ duration: 0.12 }}
            style={{
              position: "fixed",
              top: popoverPos.top,
              left: popoverPos.left,
              width: 220,
              zIndex: 60,
            }}
            className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
            role="menu"
          >
            <button
              onClick={() => {
                const ev = eventTypes.find((e) => e.id === openContactForId);
                if (ev) openWhatsApp(ev.title);
              }}
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
              onClick={() => openPortal("https://whatsform.com/10Gv8D")}
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
    </section>
  );
}
