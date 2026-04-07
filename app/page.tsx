// ============================================================
// COLE SEU LINK DO GOOGLE SHEETS (PUBLICAÇÃO EM CSV) AQUI:
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSg2WzGx7rXW7B0aVTVOmv4_0OJ_9T43Ovk_-Y61yOmUhyq_kl5NYDDKV6FtJkUpMknnbGYLbmKExF_/pub?output=csv";
// ============================================================

interface LinkItem {
  label: string;
  url: string;
  icon: string;
  highlight: string;
  color?: string;
  bio?: string;
  avatar?: string;
  nome_artista?: string;
  bg_image?: string;
}

export default function LinktreeFullDynamic() {
  const [data, setData] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Configurações globais extraídas da primeira linha de dados
  const config = {
    color: data[0]?.color || "#a855f7",
    bio: data[0]?.bio || "Bio não configurada",
    avatar: data[0]?.avatar || "https://picsum.photos",
    nome: data[0]?.nome_artista || "NOME DA ARTISTA",
    bg: data[0]?.bg_image || ""
  };

  useEffect(() => {
    if (!SHEET_URL || SHEET_URL.includes("SEU_LINK_AQUI")) {
      setLoading(false);
      return;
    }
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data as LinkItem[]);
        setLoading(false);
      },
      error: () => setLoading(false)
    });
  }, []);

  return (
    <div className="min-h-screen relative text-zinc-100 flex flex-col items-center px-6 py-16 font-sans overflow-x-hidden">
      
      {/* BACKGROUND DINÂMICO */}
      <div 
        className="fixed inset-0 -z-10 transition-all duration-1000"
        style={{ 
          backgroundColor: "#0a0a0a",
          backgroundImage: config.bg ? `linear-gradient(to bottom, rgba(10,10,10,0.8), #0a0a0a), url(${config.bg})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-12 text-center">
        <div 
          className="w-28 h-28 rounded-full border-2 p-1.5 mb-6 shadow-2xl transition-all duration-1000"
          style={{ borderColor: `${config.color}80`, boxShadow: `0 0 30px ${config.color}33` }}
        >
          <div className="w-full h-full rounded-full bg-zinc-800 overflow-hidden border border-white/5">
             <img src={config.avatar} alt="Avatar" className="object-cover w-full h-full hover:scale-110 transition-transform duration-500" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tighter uppercase mb-1 drop-shadow-md">{config.nome}</h1>
        <p className="text-zinc-400 text-[10px] tracking-[0.3em] uppercase font-medium">{config.bio}</p>
      </motion.div>

      {/* LINKS */}
      <div className="w-full max-w-[400px] space-y-4 z-10">
        <AnimatePresence mode="wait">
          {loading ? (
           .map((i) => <div key={i} className="h-[72px] bg-zinc-900/40 rounded-2xl animate-pulse border border-white/5" />)
          ) : (
            data.map((link, index) => {
              if (!link.label) return null;
              // @ts-ignore
              const IconComponent = Icons[link.icon] || Icons.ExternalLink;
              const isHighlighted = String(link.highlight).toLowerCase() === "true";

              return (
                <motion.a
                  key={index}
                  href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                  target="_blank"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  className={`group flex items-center p-4 rounded-2xl border transition-all duration-300
                    ${isHighlighted ? "bg-white text-black border-white shadow-xl" : "bg-black/40 backdrop-blur-md border-white/10 hover:bg-black/60"}
                  `}
                  style={!isHighlighted ? { borderLeftColor: config.color, borderLeftWidth: '4px' } : {}}
                >
                  <div className="mr-4" style={{ color: isHighlighted ? "black" : config.color }}>
                    <IconComponent size={24} />
                  </div>
                  <span className="text-[16px] font-bold flex-1 tracking-tight">{link.label}</span>
                  <Icons.ArrowUpRight size={18} className="opacity-20" />
                </motion.a>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER PERSONALIZADO */}
<footer className="mt-auto pt-20 pb-8 flex flex-col items-center gap-2">
  <div className="h-px w-12 bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-4" />
  
  <a 
    href="https://www.instagram.com/le_aohit/" // SEU LINK (Instagram, Portfólio ou WhatsApp)
    target="_blank"
    rel="noopener noreferrer"
    className="group flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity"
  >
    <span className="text-[9px] text-zinc-600 tracking-[0.4em] uppercase font-bold group-hover:text-purple-500 transition-colors">
      Designed by LE_AOHIT
    </span>
    <div className="h-[1px] w-0 bg-purple-500 group-hover:w-full transition-all duration-300" />
  </a>
</footer>
