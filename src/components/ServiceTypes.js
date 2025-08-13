"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TruckIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

/* Helper: safe icon renderer with fallback */
const SafeIcon = ({ Icon, className = "" }) => {
  if (!Icon) {
    // fallback simple SVG so React doesn't try to render `undefined`
    return (
      <svg
        className={className}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="3"
          fill="currentColor"
          opacity="0.12"
        />
        <path
          d="M7 12h10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return <Icon className={className} aria-hidden="true" />;
};

/* Debug: warn about any missing icon imports */
(() => {
  const missing = [];
  if (!TruckIcon) missing.push("TruckIcon");
  if (!WrenchScrewdriverIcon) missing.push("WrenchScrewdriverIcon");
  if (!UserGroupIcon) missing.push("UserGroupIcon");
  if (!CheckCircleIcon) missing.push("CheckCircleIcon");
  if (!StarIcon) missing.push("StarIcon");
  if (missing.length) {
    // eslint-disable-next-line no-console
    console.warn("[ServiceTypes] missing heroicons:", missing.join(", "));
  }
})();

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const ServiceTypes = () => {
  const serviceTypes = [
    {
      id: 1,
      title: "FULL SERVIS",
      price: "Rp 100.000/hari + Rp 5.000/km",
      features: [
        "Alat diantar jemput sampai lokasi",
        "Setting dan setup alat di lokasi",
        "Operator standby di lokasi",
      ],
      icon: TruckIcon,
      gradient: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-50 to-green-50",
      borderColor: "border-emerald-200 hover:border-emerald-300",
      popular: true,
    },
    {
      id: 2,
      title: "HALF SERVIS",
      price: "Rp 5.000/km (mulai 20.000)",
      features: [
        "Alat diantar jemput sampai lokasi",
        "Setting dan setup alat jika penyewa ada di lokasi",
      ],
      icon: WrenchScrewdriverIcon,
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200 hover:border-blue-300",
    },
    {
      id: 3,
      title: "SELF SERVIS",
      price: "FREE",
      features: ["Penyewa ambil, kembalikan dan setting sendiri."],
      icon: UserGroupIcon,
      gradient: "from-purple-500 to-violet-600",
      bgGradient: "from-purple-50 to-violet-50",
      borderColor: "border-purple-200 hover:border-purple-300",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-red-100/30 to-orange-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-red-50 border border-red-200 rounded-full px-6 py-3 mb-6"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-600 font-semibold text-sm">
              Pilihan Layanan
            </span>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Jenis-Jenis
            <br />
            <span className="bg-gradient-to-r from-red-600 via-red-400 to-red-600 bg-clip-text text-transparent">
              Layanan
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pilih paket layanan yang sesuai dengan kebutuhan dan budget event
            Anda
          </p>
        </motion.div>

        {/* Service Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {serviceTypes.map((service) => {
            const Icon = service.icon || null;

            return (
              <motion.div
                key={service.id}
                variants={scaleIn}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className={`relative bg-gradient-to-br ${service.bgGradient} rounded-2xl p-8 border-2 ${service.borderColor} transition-all duration-500 group shadow-lg hover:shadow-2xl`}
              >
                {service.popular && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                  >
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      <div className="flex items-center space-x-1">
                        <SafeIcon Icon={StarIcon} className="w-4 h-4" />
                        <span>TERPOPULER</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-center mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  >
                    <SafeIcon Icon={Icon} className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-wide">
                    {service.title}
                  </h3>

                  <div className="mb-6">
                    <div
                      className={`text-2xl font-black bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent mb-2`}
                    >
                      {service.price}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start space-x-3 text-left"
                      >
                        <SafeIcon
                          Icon={CheckCircleIcon}
                          className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5"
                        />
                        <span className="text-gray-700 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
