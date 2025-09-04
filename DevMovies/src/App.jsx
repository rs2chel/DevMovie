// src/App.jsx
import { useState } from "react";
import { Container, Pagination, Stack, Alert, Typography } from "@mui/material";
import SearchAppBar from "./componets/SearchAppBar";
import ResultsGrid from "./componets/ResultsGrid";
import Requisicao from "./controller/requisicao";
import HomeFeed from "./componets/HomeFeed";
import { useFavorites } from "./hooks/useFavorites";

export default function App() {
  const [term, setTerm] = useState("");
  const [submitted, setSubmitted] = useState("");

  // favoritos (persistidos no localStorage)
  const { favoritesSet, toggleFavorite } = useFavorites();

  const handleSubmit = () => {
    const t = term.trim();
    setSubmitted(t); // vazio => mostra HomeFeed
  };

  return (
    <>
      <SearchAppBar value={term} onChange={setTerm} onSubmit={handleSubmit} />

      {submitted ? (
        <Requisicao searchTerm={submitted}>
          {({ loading, errorMsg, results, pagination, setPage }) => {
            const totalPages = Math.min(pagination?.total_pages || 1, 500);
            const page = pagination?.page || 1;
            const totalResults = pagination?.total_results || 0;

            return (
              <Container maxWidth="xl" sx={{ py: 3 }}>
                {loading && (
                  <Typography color="text.secondary">Carregando…</Typography>
                )}

                {!loading && errorMsg && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {errorMsg}
                  </Alert>
                )}

                {!loading && !errorMsg && results?.length > 0 && (
                  <>
                    <ResultsGrid
                      items={results}
                      favoritesSet={favoritesSet}
                      onToggleFavorite={toggleFavorite}
                    />

                    {/* Totais + paginação lado a lado */}
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={2}
                      sx={{ mt: 3 }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Resultados: <b>{totalResults}</b> • Página <b>{page}</b>{" "}
                        de <b>{totalPages}</b>
                      </Typography>

                      <Pagination
                        color="primary"
                        page={page}
                        count={totalPages}
                        onChange={(_, p) => setPage(p)}
                        siblingCount={1}
                        boundaryCount={1}
                      />
                    </Stack>
                  </>
                )}

                {!loading && !errorMsg && results?.length === 0 && (
                  <Typography
                    align="center"
                    sx={{ py: 6 }}
                    color="text.secondary"
                  >
                    Nenhum resultado encontrado.
                  </Typography>
                )}
              </Container>
            );
          }}
        </Requisicao>
      ) : (
        <HomeFeed
          favoritesSet={favoritesSet}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </>
  );
}
