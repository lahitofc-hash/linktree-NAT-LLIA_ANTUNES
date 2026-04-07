"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse";
import * as Icons from "lucide-react";

// 1. PUBLIQUE SUA PLANILHA COMO CSV E COLE O LINK ABAIXO:
const SHEET_URL = "SUA_URL_AQUI_TERMINANDO_EM_OUTPUT_CSV";

interface LinkItem {
  label: string;
  url: string;
  icon: string;
  highlight: string;
}

export default function LinktreeArtista() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      if (!SHEET_URL || SHEET_URL.includes("SUA_URL_AQUI")) {
        setLoading(false);
        return;
      }

      Papa.parse(SHEET_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Filtra apenas linhas que possuem label e url válidos
          const validLinks = (results.data as LinkItem[]).filter(
            (l) => l.label && l.url
          );
          setLinks(validLinks);
          setLoading(false);
        },
        error: () => setLoading(false)
      });
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col items-center px-6 py-16 font-sans">
      
      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-12 text-center"
      >
        <div className="w-24 h-24 rounded-full border-2 border-purple-500/50 p-1.5 mb-4 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <div className="w-full h-full rounded-full bg-zinc-800 overflow-hidden">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src="https://picsum.photos" alt="Artista" className="object-cover w-full h-full" />
          </div>
        </div>
        <h1 className="text-xl font-bold tracking-tighter uppercase">Nome da Artista</h1>
        <p className="text-zinc-500 text-xs mt-1 tracking-widest uppercase">Cantora & Compositora</p>
      </motion.div>

      {/* LISTA DE LINKS */}
      <div className="w-full max-w-[400px] space-y-4">
        <AnimatePresence mode="wait">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[68px] w-full bg-zinc-900/50 border border-white/5 rounded-2xl animate-pulse" />
            ))
          ) : (
            links.map((link, index) => {
              // @ts-ignore - Busca dinâmica de ícone
              const IconComponent = Icons[link.icon] || Icons.ExternalLink;
              const isHighlighted = String(link.highlight).toLowerCase() === "true";

              return (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    group flex items-center p-4 rounded-2xl border transition-all duration-300
                    ${isHighlighted 
                      ? "bg-white text-black border-white shadow-[0_10px_30px_rgba(255,255,255,0.1)]" 
                      : "bg-zinc-900/40 border-white/10 hover:border-purple-500/50 hover:bg-zinc-900/80"}
                  `}
                >
                  <div className={`mr-4 ${isHighlighted ? "text-black" : "text-purple-400 group-hover:text-purple-300"}`}>
                    <IconComponent size={22} />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="text-[15px] font-semibold tracking-tight">{link.label}</span>
                  </div>
                  <Icons.ChevronRight size={16} className="opacity-30" />
                </motion.a>
              );
            })
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-auto pt-16 flex flex-col items-center gap-4">
        <p className="text-[10px] text-zinc-600 tracking-[0.3em] uppercase">Powered by L'A HIT</p>
      </footer>
    </div>
  );
}
