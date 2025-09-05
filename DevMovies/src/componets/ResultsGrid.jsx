import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Stack,
  Rating,
  IconButton,
  Tooltip,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const defaultPoster = "https://via.placeholder.com/500x750?text=Sem+Imagem";

export default function ResultsGrid({
  items = [],
  favoritesSet = new Set(), // Set de "type:id"
  onToggleFavorite, // (item) => void
  onCardClick, // (item) => void
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: {
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)", // 4 por linha
        },
      }}
    >
      {items.map((item) => {
        const year = (item.release_date || "").slice(0, 4);
        const rating = Number(item.vote_average || 0);
        const favKey = `${item.type}:${item.id}`;
        const isFav = favoritesSet.has(favKey);

        return (
          <Card
            key={favKey}
            sx={{
              height: "100%",
              borderRadius: 3,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Favoritar */}
            <IconButton
              aria-label={
                isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"
              }
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite?.(item);
              }}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "background.paper",
                "&:hover": { bgcolor: "background.paper" },
                zIndex: 2,
              }}
              color={isFav ? "error" : "default"}
            >
              {isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>

            <CardActionArea
              sx={{ height: "100%" }}
              onClick={() => onCardClick?.(item)}
            >
              <CardMedia
                component="img"
                image={item.poster || defaultPoster}
                alt={item.title}
                sx={{ height: 260, objectFit: "cover" }}
                loading="lazy"
              />

              <CardContent
                sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}
              >
                <Tooltip title={item.title} disableInteractive>
                  <Typography
                    variant="subtitle1"
                    noWrap
                    sx={{ fontWeight: 600 }}
                  >
                    {item.title}
                  </Typography>
                </Tooltip>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating
                    value={rating / 2}
                    precision={0.5}
                    size="small"
                    readOnly
                  />
                  <Typography variant="caption" color="text.secondary">
                    {rating ? rating.toFixed(1) : "N/A"}
                    {year ? ` • ${year}` : ""}
                  </Typography>
                </Stack>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: 64,
                  }}
                >
                  {item.overview || "Sinopse não disponível."}
                </Typography>

                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Chip
                    label={item.type === "movie" ? "Filme" : "Série"}
                    size="small"
                  />
                  {year && (
                    <Chip label={year} size="small" variant="outlined" />
                  )}
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </Box>
  );
}
