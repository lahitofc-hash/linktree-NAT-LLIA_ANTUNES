"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse";
import * as Icons from "lucide-react";

// ============================================================
// COLE OS DOIS LINKS CSV DO GOOGLE SHEETS ABAIXO:
const URL_LINKS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSg2WzGx7rXW7B0aVTVOmv4_0OJ_9T43Ovk_-Y61yOmUhyq_kl5NYDDKV6FtJkUpMknnbGYLbmKExF_/pub?output=csv";
const URL_CONFIG = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSg2WzGx7rXW7B0aVTVOmv4_0OJ_9T43Ovk_-Y61yOmUhyq_kl5NYDDKV6FtJkUpMknnbGYLbmKExF_/pub?output=csv";
// ============================================================

export default function LinktreeProfissional() {
  const [links, setLinks] = useState<any[]>([]);
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca os links da Aba 1
        const resLinks = await fetch(URL_LINKS);
        const textLinks = await resLinks.text();
        const dataLinks = Papa.parse(textLinks, { header: true }).data;

        // Busca as configurações da Aba 2
        const resConfig = await fetch(URL_CONFIG);
        const textConfig = await resConfig.text();
        const dataConfig = Papa.parse(textConfig, { header: true }).data[0];

        setLinks(dataLinks.filter((l: any) => l.label));
        setConfig(dataConfig || {});
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const themeColor = config.color || "#a855f7";

  return (
    <div className="min-h-screen relative text-white flex flex-col items-center px-6 py-16 font-sans overflow-x-hidden">
      
      {/* BACKGROUND DINÂMICO */}
      <div 
        className="fixed inset-0 -z-10"
        style={{ 
          backgroundColor: "#0a0a0a",
          backgroundImage: config.bg_image ? `linear-gradient(to bottom, rgba(10,10,10,0.8), #0a0a0a), url(${config.bg_image})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />

      {/* HEADER DINÂMICO (ABA CONFIG) */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-12 text-center">
        <div 
          className="w-28 h-28 rounded-full border-2 p-1.5 mb-6 shadow-2xl"
          style={{ borderColor: `${themeColor}80`, boxShadow: `0 0 30px ${themeColor}33` }}
        >
          <div className="w-full h-full rounded-full bg-zinc-800 overflow-hidden">
             <img src={config.avatar || "https://picsum.photos"} alt="Avatar" className="object-cover w-full h-full" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tighter uppercase mb-1 drop-shadow-md">
          {config.nome_artista || "NATÁLLIA ANTUNES"}
        </h1>
        <p className="text-zinc-400 text-[10px] tracking-[0.3em] uppercase font-medium">
          {config.bio || "CANTORA"}
        </p>
      </motion.div>

      {/* LINKS DINÂMICOS (ABA LINKS) */}
      <div className="w-full max-w-[400px] space-y-4 z-10">
        <AnimatePresence mode="wait">
          {!loading && links.map((link, index) => {
            // @ts-ignore
            const IconComponent = Icons[link.icon] || Icons.ExternalLink;
            const isHighlighted = String(link.highlight).toLowerCase() === "true";

            return (
              <motion.a
                key={index}
                href={link.url?.startsWith("http") ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className={`group flex items-center p-4 rounded-2xl border transition-all duration-300
                  ${isHighlighted ? "bg-white text-black border-white shadow-xl" : "bg-black/40 backdrop-blur-md border-white/10 hover:bg-black/60"}
                `}
                style={!isHighlighted ? { borderLeftColor: themeColor, borderLeftWidth: '4px' } : {}}
              >
                <div className="mr-4" style={{ color: isHighlighted ? "black" : themeColor }}>
                  <IconComponent size={24} />
                </div>
                <span className="text-[16px] font-bold flex-1 tracking-tight">{link.label}</span>
                <Icons.ArrowUpRight size={18} className="opacity-20" />
              </motion.a>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* SEU RODAPÉ PERSONALIZADO */}
      <footer className="mt-auto pt-20 pb-8 flex flex-col items-center">
        <a 
          href="https://www.instagram.com/le_aohit/" 
          target="_blank" 
          className="text-[9px] text-zinc-600 tracking-[0.4em] uppercase font-bold hover:text-white transition-colors"
        >
          Powered by @la_aohit
        </a>
      </footer>
    </div>
  );
}
