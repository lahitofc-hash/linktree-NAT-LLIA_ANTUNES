"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse";
import * as Icons from "lucide-react";

// SUBSTITUA PELOS SEUS LINKS DE PUBLICAÇÃO CSV
const URL_CONFIG = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSg2WzGx7rXW7B0aVTVOmv4_0OJ_9T43Ovk_-Y61yOmUhyq_kl5NYDDKV6FtJkUpMknnbGYLbmKExF_/pub?gid=1971191094&single=true&output=csv";
const URL_LINKS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSg2WzGx7rXW7B0aVTVOmv4_0OJ_9T43Ovk_-Y61yOmUhyq_kl5NYDDKV6FtJkUpMknnbGYLbmKExF_/pub?gid=0&single=true&output=csv";

export default function LinktreeProfissional() {
  const [links, setLinks] = useState([]);
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDebugInfo("Carregando configurações...");
        
        const [resConfig, resLinks] = await Promise.all([
          fetch(URL_CONFIG),
          fetch(URL_LINKS)
        ]);

        const textConfig = await resConfig.text();
        const textLinks = await resLinks.text();
        
        setDebugInfo(`Config CSV (primeiros 200 chars): ${textConfig.substring(0, 200)}`);
        
        const dataConfig = Papa.parse(textConfig, { header: true, skipEmptyLines: true }).data;
        const dataLinks = Papa.parse(textLinks, { header: true, skipEmptyLines: true }).data;
        
        console.log("Dados CONFIG:", dataConfig);
        console.log("Dados LINKS:", dataLinks);
        
        // Verifica se tem dados
        if (dataConfig && dataConfig.length > 0) {
          setConfig(dataConfig[0]);
          setDebugInfo(prev => prev + `\nConfig carregada: Nome = ${dataConfig[0].nome_artista || dataConfig[0].nome || "NÃO ENCONTRADO"}`);
        } else {
          setDebugInfo(prev => prev + "\n⚠️ Planilha CONFIG está vazia!");
        }
        
        if (dataLinks && dataLinks.length > 0) {
          const validLinks = dataLinks.filter(link => link.url && link.label);
          setLinks(validLinks);
          setDebugInfo(prev => prev + `\nLinks carregados: ${validLinks.length}`);
        }
        
      } catch (error) {
        console.error("Erro:", error);
        setDebugInfo(`ERRO: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const themeColor = config.color || "#a855f7";
  
  // Dados com fallback para não ficar em branco
  const nomeArtista = config.nome_artista || config.nome || config.NOME || "ARTISTA";
  const bioArtista = config.bio || config.BIO || "CANTORA & COMPOSITORA";
  const avatarUrl = config.avatar || config.AVATAR || "https://randomuser.me/api/portraits/women/68.jpg";
  const bgImageUrl = config.bg_image || config.BG_IMAGE || "";

  return (
    <div className="min-h-screen relative text-white flex flex-col items-center px-6 py-16 font-sans overflow-x-hidden">
      
      {/* DEBUG - REMOVA DEPOIS DE FUNCIONAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 text-white text-[10px] p-2 z-50 font-mono max-h-32 overflow-auto">
        <strong>🔍 DEBUG:</strong> {debugInfo}
      </div>
      
      {/* BACKGROUND */}
      <div 
        className="fixed inset-0 -z-10"
        style={{ 
          backgroundColor: "#0a0a0a",
          backgroundImage: bgImageUrl ? `linear-gradient(to bottom, rgba(10,10,10,0.6), #0a0a0a), url(${bgImageUrl})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-12 text-center">
        <div 
          className="w-28 h-28 rounded-full border-2 p-1.5 mb-6 shadow-2xl overflow-hidden"
          style={{ borderColor: `${themeColor}80`, boxShadow: `0 0 30px ${themeColor}33` }}
        >
          <img 
            src={avatarUrl}
            alt="Avatar" 
            className="w-full h-full rounded-full object-cover bg-zinc-800"
            onError={(e) => { e.target.src = "https://randomuser.me/api/portraits/women/68.jpg"; }}
          />
        </div>
        
        <h1 className="text-2xl font-bold tracking-tighter uppercase mb-1 drop-shadow-md">
          {nomeArtista}
        </h1>

        <p className="text-zinc-400 text-[10px] tracking-[0.3em] uppercase font-medium">
          {bioArtista}
        </p>
      </motion.div>

      {/* LINKS */}
      <div className="w-full max-w-[400px] space-y-4 z-10">
        <AnimatePresence mode="wait">
          {!loading && links.map((link, index) => {
            const iconName = link.icon 
              ? link.icon.charAt(0).toUpperCase() + link.icon.slice(1).toLowerCase() 
              : "ExternalLink";
            
            const IconComponent = Icons[iconName] || Icons.ExternalLink;
            const isHighlighted = String(link.highlight).toLowerCase() === "true";

            return (
              <motion.a
                key={index}
                href={link.url?.startsWith("http") ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group flex items-center p-4 rounded-2xl border transition-all duration-300
                  ${isHighlighted ? "bg-white text-black border-white shadow-xl" : "bg-black/40 backdrop-blur-md border-white/10 hover:bg-black/60"}
                `}
                style={{ 
                  touchAction: "manipulation",
                  ...(!isHighlighted ? { borderLeft: `4px solid ${themeColor}` } : {}) 
                }}
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
        
        {!loading && links.length === 0 && (
          <div className="text-center text-zinc-500 text-sm p-8 bg-black/40 rounded-2xl">
            Nenhum link encontrado. Verifique a planilha LINKS.
          </div>
        )}
      </div>
      
      {/* RODAPÉ */}
      <footer className="mt-auto pt-20 pb-8 flex flex-col items-center">
        <a 
          href="https://www.instagram.com/le_aohit/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[9px] text-zinc-600 tracking-[0.4em] uppercase font-bold hover:text-white transition-colors"
        >
          POWERED BY L'A HIT
        </a>
      </footer>
    </div>
  );
}
