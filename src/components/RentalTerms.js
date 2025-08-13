"use client";

import { motion } from "framer-motion";
import { CheckCircle, Clock, CreditCard, ShieldCheck } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const RentalTerms = () => {
  const terms = [
    { id: 1, title: "Menyerahkan KTP + Identitas Lainnya", icon: CreditCard },
    {
      id: 2,
      title: "Wajib DP 50% atau Lunas, DP hangus bila tidak jadi sewa",
      icon: CreditCard,
    },
    {
      id: 3,
      title: "Memiliki Instagram aktif & Follow @MAXPRO.JOGJA",
      icon: CheckCircle,
    },
    { id: 4, title: "Yang punya identitas wajib hadir", icon: ShieldCheck },
    {
      id: 5,
      title:
        "Toleransi keterlambatan 1 jam, denda 10% per jam dari total transaksi",
      icon: Clock,
    },
  ];

  return (
    <section className="py-20 bg-white ">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-14"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Syarat & <span className="text-red-600">Ketentuan Sewa</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Pastikan Anda memahami semua ketentuan berikut sebelum melakukan
            penyewaan.
          </p>
        </motion.div>

        {/* Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {terms.map((term, index) => (
            <motion.div
              key={term.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ delay: index * 0.1 }}
              className="p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                  <term.icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-gray-800 font-medium">{term.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
