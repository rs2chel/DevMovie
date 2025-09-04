import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Stack,
  Pagination,
  Alert,
  CircularProgress,
} from "@mui/material";
import ResultsGrid from "./ResultsGrid.jsx";
import tmdb from "../api/tmdb";

export default function HomeFeed({ favoritesSet, onToggleFavorite }) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total_pages: 1,
    total_results: 0,
  });

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const { data } = await tmdb.get("/trending/all/day", {
          params: { page },
        });
        const filtered = (data.results || [])
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
              : undefined,
          }));

        setResults(filtered);
        setPagination({
          page: data.page || page,
          total_pages: data.total_pages || 1,
          total_results: data.total_results ?? filtered.length ?? 0,
        });
      } catch (e) {
        setErrorMsg(
          e?.response?.data?.status_message ||
            e.message ||
            "Erro ao carregar feed"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, [page]);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Em alta hoje
      </Typography>

      {loading && <CircularProgress />}
      {!loading && errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      {!loading && !errorMsg && results.length > 0 && (
        <>
          <ResultsGrid
            items={results}
            favoritesSet={favoritesSet}
            onToggleFavorite={onToggleFavorite}
          />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{ mt: 3 }}
          >
            <Typography variant="body2" color="text.secondary">
              Resultados: <b>{pagination.total_results}</b> • Página{" "}
              <b>{pagination.page}</b> de{" "}
              <b>{Math.min(pagination.total_pages, 500)}</b>
            </Typography>

            <Pagination
              color="primary"
              page={pagination.page}
              count={Math.min(pagination.total_pages, 500)}
              onChange={(_, p) => setPage(p)}
              siblingCount={1}
              boundaryCount={1}
            />
          </Stack>
        </>
      )}
    </Container>
  );
}
