// src/components/Requisicao.jsx
import { useEffect, useMemo, useState } from "react";
import tmdb from "../api/tmdb";

const defaultPoster = "https://via.placeholder.com/500x750?text=Sem+Imagem";

export default function Requisicao({ searchTerm, children }) {
    const [currentTerm, setCurrentTerm] = useState(searchTerm || "");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        total_pages: 1,
        total_results: 0,
    });

    // Restaura estado do localStorage ao montar
    useEffect(() => {
        try {
            const savedResults = localStorage.getItem("results");
            const savedPage = localStorage.getItem("page");
            const savedPagination = localStorage.getItem("pagination");
            const savedTerm = localStorage.getItem("searchTerm");

            if (savedResults) setResults(JSON.parse(savedResults));
            if (savedPage) setPage(JSON.parse(savedPage));
            if (savedPagination) setPagination(JSON.parse(savedPagination));
            if (savedTerm) setCurrentTerm(savedTerm);
        } catch {
            // ignore JSON parse errors
        }
    }, []);

    // Sincroniza quando a prop searchTerm mudar externamente
    useEffect(() => {
        if (searchTerm && searchTerm !== currentTerm) {
            setCurrentTerm(searchTerm);
            setPage(1); // nova busca volta para página 1
        }
    }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

    const canQuery = useMemo(
        () => currentTerm && currentTerm.trim().length > 0,
        [currentTerm]
    );

    // Busca na TMDB quando termo/página mudarem
    useEffect(() => {
        if (!canQuery) return;


        if (!import.meta.env.VITE_TMDB_TOKEN) {
            setErrorMsg("Faltando VITE_TMDB_TOKEN no .env");
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setErrorMsg("");
            try {
                const { data } = await tmdb.get("/search/multi", {
                    params: {
                        query: currentTerm,
                        page,
                        include_adult: false,
                        language: "pt-BR",
                    },
                });

                if (!data?.results) {
                    setResults([]);
                    setPagination({ page: 1, total_pages: 1, total_results: 0 });
                    return;
                }

                setPagination({
                    page: data.page,
                    total_pages: data.total_pages,
                    total_results: data.total_results,
                });

                const filtered = data.results
                    .filter((it) => it.media_type === "movie" || it.media_type === "tv")
                    .map((it) => ({
                        id: it.id,
                        type: it.media_type,
                        title: it.title || it.name,
                        overview: it.overview,
                        release_date: it.release_date || it.first_air_date,
                        vote_average: it.vote_average,
                        poster: it.poster_path
                            ? `https://image.tmdb.org/t/p/w500${it.poster_path}`
                            : defaultPoster,
                    }));

                setResults(filtered);

                // Salva estado no localStorage
                localStorage.setItem("results", JSON.stringify(filtered));
                localStorage.setItem("page", JSON.stringify(page));
                localStorage.setItem(
                    "pagination",
                    JSON.stringify({
                        page,
                        total_pages: data.total_pages,
                        total_results: data.total_results,
                    })
                );
                localStorage.setItem("searchTerm", currentTerm);
            } catch (e) {
                setErrorMsg(
                    e?.response?.data?.status_message ||
                    e.message ||
                    "Erro ao carregar resultados"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentTerm, page, canQuery]); // eslint-disable-line react-hooks/exhaustive-deps

    // Se o componente receber children como função (render-prop),
    // expõe o estado para o pai renderizar com MUI (Grid, Cards, Pagination etc.)
    if (typeof children === "function") {
        return children({
            loading,
            errorMsg,
            results,
            pagination,
            setPage,
            currentTerm,
            setCurrentTerm,
        });
    }

    // Caso não use render-prop, não renderiza UI aqui (deixa a tela responsável por isso)
    return null;
}