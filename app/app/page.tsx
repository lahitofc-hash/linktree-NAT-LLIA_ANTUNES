"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse";
import * as Icons from "lucide-react"; // Importa todos os ícones dinamicamente

// Substitua pelo link da sua planilha publicada em CSV
const SHEET_URL = "SUA_URL_DO_GOOGLE_SHEETS_AQUI_FINAL_CSV";

interface LinkItem {
  label: string;
  url: string;
  icon: string; // Nome do ícone (ex: "Instagram", "Music2")
}

export default function LinktreeDynamic() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      complete: (results) => {
        setLinks(results.data as LinkItem[]);
        setLoading(false);
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-12">
      {/* Avatar & Nome Fixo ou vindo da Planilha */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 mb-4" />
        <h1 className="text-lg font-bold tracking-widest uppercase">Artista Name</h1>
      </div>

      <div className="w-full max-w-md space-y-4">
        <AnimatePresence>
          {loading ? (
            // Skeleton de Carregamento
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="h-14 w-full bg-white/5 animate-pulse rounded-xl" />
            ))
          ) : (
            links.map((link, index) => {
              // @ts-ignore - Busca o componente do ícone pelo nome vindo da planilha
              const IconComponent = Icons[link.icon] || Icons.ExternalLink;

              return (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.1)" }}
                  className="flex items-center p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  <IconComponent className="w-5 h-5 mr-4 text-purple-400" />
                  <span className="text-sm font-medium">{link.label}</span>
                </motion.a>
              );
            })
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-20 text-[10px] opacity-30 uppercase tracking-widest">
        Updated via Google Sheets
      </footer>
    </div>
  );
}
