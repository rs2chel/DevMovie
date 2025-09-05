import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Container, Pagination, Stack, Alert, Typography } from "@mui/material";
import SearchAppBar from "./componets/SearchAppBar.jsx";
import ResultsGrid from "./componets/ResultsGrid.jsx";
import Requisicao from "./controller/requisicao.js";
import HomeFeed from "./componets/HomeFeed.jsx";

import Favorites from "./page/Favorites.jsx";
import Details from "./page/Details.jsx";
import { useFavorites } from "./hooks/useFavorites.js";

export default function App() {
  const [term, setTerm] = useState("");
  const [submitted, setSubmitted] = useState("");
  const navigate = useNavigate();

  const { favorites, favoritesSet, toggleFavorite } = useFavorites();

  const handleSubmit = () => {
    const t = term.trim();
    setSubmitted(t); // vazio => HomeFeed
    navigate("/"); // garante voltar pra home ao pesquisar
  };

  const handleCardClick = (item) => {
    if (!item?.type || !item?.id) return;
    navigate(`/${item.type}/${item.id}`);
  };

  return (
    <>
      <SearchAppBar
        value={term}
        onChange={setTerm}
        onSubmit={handleSubmit}
        favoritesCount={favorites.length}
      />

      <Routes>
        {/* Home: feed ou busca */}
        <Route
          path="/"
          element={
            submitted ? (
              <Requisicao searchTerm={submitted}>
                {({ loading, errorMsg, results, pagination, setPage }) => {
                  const totalPages = Math.min(
                    pagination?.total_pages || 1,
                    500
                  );
                  const page = pagination?.page || 1;
                  const totalResults = pagination?.total_results || 0;

                  return (
                    <Container maxWidth="xl" sx={{ py: 3 }}>
                      {loading && (
                        <Typography color="text.secondary">
                          Carregando…
                        </Typography>
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
                            onCardClick={handleCardClick}
                          />

                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={2}
                            sx={{ mt: 3 }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Resultados: <b>{totalResults}</b> • Página{" "}
                              <b>{page}</b> de <b>{totalPages}</b>
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

                      {!loading &&
                        !errorMsg &&
                        submitted &&
                        results?.length === 0 && (
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
                onCardClick={handleCardClick}
              />
            )
          }
        />

        {/* Favoritos */}
        <Route
          path="/favorites"
          element={
            <Favorites
              favorites={favorites}
              favoritesSet={favoritesSet}
              onToggleFavorite={toggleFavorite}
            />
          }
        />

        {/* Detalhes */}
        <Route path="/:type/:id" element={<Details />} />
      </Routes>
    </>
  );
}
