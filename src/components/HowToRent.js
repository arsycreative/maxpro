// components/HowToRent.js
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HowToRent() {
  const steps = [
    {
      id: "1",
      title: "WhatsApp Admin",
      description: "Ceritakan detail tanggal, lokasi, dan kebutuhan acaramu.",
      image:
        "https://imgsrv2.voi.id/CIr-uKm0lGrzoKPl6TwDkReqLuDKtLnPXKchbdywPL4/auto/1200/675/sm/1/bG9jYWw6Ly8vcHVibGlzaGVycy8xMDQ4MjIvdm9pLWNhcmEtY2VrLWtvbnRhay13aGF0c2FwcC15YW5nLXNlcmluZy1jaGF0LmpwZw.jpg",
      gradient: "from-indigo-600 to-blue-700",
      iconBg: "bg-indigo-500",
    },
    {
      id: "2",
      title: "Booking Unit",
      description: "Booking unit via DP untuk mengunci jadwal unit.",
      image:
        "https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit%2Cfl_lossy%2Ch_9000%2Cw_1200%2Cf_auto%2Cq_auto/8103728/225639_419736.jpeg",
      gradient: "from-emerald-600 to-teal-700",
      iconBg: "bg-emerald-500",
    },
    {
      id: "3",
      title: "Delivery",
      description: "Unit diantar sesuai waktu yang disepakati.",
      image:
        "https://theoneupgroup.com/wp-content/uploads/2023/06/Rigging-Staging-The-One-Up-Group-scaled.jpeg",
      gradient: "from-violet-600 to-purple-700",
      iconBg: "bg-violet-500",
    },
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50"></div>

      {/* Sophisticated Background Elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-blue-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-violet-200/30 to-purple-300/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-emerald-200/20 to-teal-300/20 rounded-full blur-3xl"></div>
      </div>

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Elegant Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-11"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-block mb-6"
          ></motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            Cara Menyewa Alat
            <br />
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Multimedia
            </span>
          </h2>
        </motion.div>

        {/* Horizontal Layout like in reference */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group relative flex-1 max-w-sm"
              >
                {/* Clean Card Design */}
                <div className="bg-white rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-500 overflow-hidden relative">
                  {/* Step Number - Inside card like reference */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xl font-bold text-gray-800">
                        {step.id}
                      </span>
                    </div>
                  </div>

                  {/* Image Section - Taller and rounded like reference */}
                  <div className="relative h-64 overflow-hidden rounded-t-2xl">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>

                  {/* Content - Taller padding */}
                  <div className="p-8 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow connector for desktop - similar to reference */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                    <div className="text-gray-300 text-2xl">→</div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-11"
        >
          <div className="inline-block bg-amber-50 border border-amber-200 rounded-2xl px-8 py-6 shadow-lg">
            <p className="text-amber-800 font-semibold text-lg">
              <span className="font-bold">Area Layanan:</span> Yogyakarta,
              Bantul, Sleman, Gunung Kidul, Kulonprogo
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
