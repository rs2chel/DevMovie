import { useEffect, useMemo, useState } from "react";
import tmdb from "../api/tmdb";

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Alert,
  Pagination,
  Stack,
  Skeleton,
} from "@mui/material";

const defaultPoster = "https://via.placeholder.com/500x750?text=Sem+Imagem";

function Requisicao({ searchTerm }) {
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

  // restaura do localStorage ao montar
  useEffect(() => {
    const savedResults = localStorage.getItem("results");
    const savedPage = localStorage.getItem("page");
    const savedPagination = localStorage.getItem("pagination");
    const savedTerm = localStorage.getItem("searchTerm");

    if (savedResults) setResults(JSON.parse(savedResults));
    if (savedPage) setPage(JSON.parse(savedPage));
    if (savedPagination) setPagination(JSON.parse(savedPagination));
    if (savedTerm) setCurrentTerm(savedTerm);
  }, []);

  // mantém currentTerm sincronizado com prop (quando mudar externamente)
  useEffect(() => {
    if (searchTerm && searchTerm !== currentTerm) {
      setCurrentTerm(searchTerm);
      setPage(1); // quando muda busca, volta pra página 1
    }
  }, [searchTerm]);

  const canQuery = useMemo(
    () => currentTerm && currentTerm.trim().length > 0,
    [currentTerm]
  );

  // busca TMDB sempre que termo/página mudar
  useEffect(() => {
    if (!canQuery) return;

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

        // salva estado
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
  }, [currentTerm, page, canQuery]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {!canQuery && (
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          Digite um termo para buscar filmes/séries.
        </Typography>
      )}

      {loading && (
        <Grid container spacing={2}>
          {Array.from({ length: 12 }).map((_, i) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={i}>
              <Skeleton variant="rectangular" height={256} />
              <Skeleton sx={{ mt: 1 }} />
              <Skeleton width="60%" />
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      {!loading && canQuery && results.length === 0 && !errorMsg && (
        <Typography align="center" sx={{ py: 4 }}>
          Nenhum resultado encontrado.
        </Typography>
      )}

      {!loading && results.length > 0 && (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Resultados: {pagination.total_results}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Página {pagination.page} de {pagination.total_pages}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {results.map((item) => (
              <Grid
                item
                xs={6}
                sm={4}
                md={3}
                lg={2}
                key={`${item.type}-${item.id}`}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "background.paper",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item.poster}
                    alt={item.title}
                    sx={{ height: 256, objectFit: "cover" }}
                    loading="lazy"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="subtitle2"
                      noWrap
                      title={item.title}
                      gutterBottom
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      ⭐ {item.vote_average?.toFixed(1) || "N/A"}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.5 }}
                      noWrap
                    >
                      {item.overview || "Sinopse não disponível."}
                    </Typography>
                    <Chip
                      size="small"
                      label={item.type === "movie" ? "Filme" : "Série"}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {pagination.total_pages > 1 && (
            <Stack alignItems="center" sx={{ mt: 3 }}>
              <Pagination
                color="primary"
                page={pagination.page}
                count={Math.min(pagination.total_pages, 500)} // TMDB limita a 500
                onChange={(_, p) => setPage(p)}
              />
            </Stack>
          )}
        </>
      )}
    </Container>
  );
}

export default Requisicao;
