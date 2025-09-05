import { Container, Typography } from "@mui/material";
import ResultsGrid from "../componets/ResultsGrid";
import { useNavigate } from "react-router-dom";

export default function Favorites({
  favorites = [], // array salvo no useFavorites
  favoritesSet = new Set(), // Set com chaves "type:id"
  onToggleFavorite, // (item) => void
}) {
  const navigate = useNavigate();

  const handleCardClick = (item) => {
    if (!item?.type || !item?.id) return;
    navigate(`/${item.type}/${item.id}`); // -> Details.jsx faz a nova req na TMDB
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Meus Favoritos
      </Typography>

      {favorites.length > 0 ? (
        <>
          <ResultsGrid
            items={favorites}
            favoritesSet={favoritesSet}
            onToggleFavorite={onToggleFavorite}
            onCardClick={handleCardClick}
          />

          {/* total alinhado ao padrão do app */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, textAlign: { xs: "center", sm: "right" } }}
          >
            Total: <b>{favorites.length}</b>
          </Typography>
        </>
      ) : (
        <Typography align="center" sx={{ py: 6 }} color="text.secondary">
          Você ainda não favoritou nada.
        </Typography>
      )}
    </Container>
  );
}
