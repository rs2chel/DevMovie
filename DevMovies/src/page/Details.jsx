import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import tmdb from "../api/tmdb";

import ResultsGrid from "../componets/ResultsGrid.jsx";
import { useFavorites } from "../hooks/useFavorites.js";

import {
  Container,
  Box,
  Grid,
  Stack,
  Typography,
  Chip,
  Rating,
  Button,
} from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function Details() {
  const { type, id } = useParams(); // type: "movie" | "tv"
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState(null);
  const [recs, setRecs] = useState([]);

  const { favoritesSet, toggleFavorite } = useFavorites();
  const isFav = favoritesSet.has(`${type}:${id}`);

  useEffect(() => {
    let ignore = false;

    const run = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const endpoint = type === "movie" ? `/movie/${id}` : `/tv/${id}`;
        const { data } = await tmdb.get(endpoint, {
          params: {
            language: "pt-BR",
            append_to_response: "videos,credits,recommendations",
          },
        });
        if (ignore) return;

        setData(data);

        const mappedRecs = (data.recommendations?.results ?? []).map((it) => ({
          id: it.id,
          type, // recomendações do mesmo tipo da página
          title: it.title || it.name,
          overview: it.overview,
          release_date: it.release_date || it.first_air_date,
          vote_average: it.vote_average,
          poster: it.poster_path
            ? `https://image.tmdb.org/t/p/w500${it.poster_path}`
            : undefined,
        }));
        setRecs(mappedRecs);
      } catch (e) {
        if (!ignore)
          setErrorMsg(
            e?.response?.data?.status_message ||
              e.message ||
              "Erro ao carregar detalhes"
          );
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    run();
    return () => {
      ignore = true;
    };
  }, [type, id]);

  const title = data?.title || data?.name || "";
  const poster = data?.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
    : undefined;
  const backdrop = data?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
    : undefined;

  const year = (data?.release_date || data?.first_air_date || "").slice(0, 4);
  const runtimeMin =
    data?.runtime ||
    (Array.isArray(data?.episode_run_time) ? data.episode_run_time[0] : 0);
  const runtimeTxt = runtimeMin
    ? `${Math.floor(runtimeMin / 60)}h ${runtimeMin % 60}m`
    : null;

  const ratingVal = (data?.vote_average || 0) / 2;

  const trailerKey = useMemo(() => {
    const vids = data?.videos?.results || [];
    const yt = vids.find(
      (v) =>
        v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
    );
    return yt?.key;
  }, [data]);

  const cast = useMemo(() => (data?.credits?.cast || []).slice(0, 10), [data]);

  const handleFav = () => {
    if (!data) return;
    const payload = {
      id: data.id,
      type,
      title,
      overview: data.overview,
      release_date: data.release_date || data.first_air_date,
      vote_average: data.vote_average,
      poster,
    };
    toggleFavorite(payload);
  };

  const goToItem = (item) => navigate(`/${item.type}/${item.id}`);

  return (
    <Container maxWidth="xl" sx={{ pb: 6, px: { xs: 0, sm: 2 } }}>
      {backdrop && (
        <Box
          sx={{
            position: "relative",
            height: { xs: 220, sm: 300, md: 360 },
            mb: 2,
            backgroundImage: `url(${backdrop})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            "&:after": {
              content: '""',
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,.6) 0%, rgba(0,0,0,.85) 100%)",
            },
          }}
        />
      )}

      <Grid container spacing={3} sx={{ px: { xs: 2, sm: 0 } }}>
        {/* Poster */}
        <Grid item xs={12} md={4} lg={3}>
          {poster && (
            <Box
              component="img"
              src={poster}
              alt={title}
              sx={{ width: "100%", borderRadius: 2, boxShadow: 3 }}
            />
          )}
        </Grid>

        {/* Info */}
        <Grid item xs={12} md={8} lg={9}>
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={700}>
              {title}
            </Typography>

            {data?.tagline && (
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                {data.tagline}
              </Typography>
            )}

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              useFlexGap
              flexWrap="wrap"
            >
              <Rating value={ratingVal} readOnly precision={0.5} size="small" />
              <Typography variant="body2" color="text.secondary">
                {data?.vote_average?.toFixed?.(1) ?? "N/A"}
                {year && ` • ${year}`} {runtimeTxt && ` • ${runtimeTxt}`}
              </Typography>
              {data?.genres?.map((g) => (
                <Chip key={g.id} label={g.name} size="small" />
              ))}
            </Stack>

            <Typography variant="body1" sx={{ mt: 1 }}>
              {data?.overview || "Sem sinopse."}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button
                variant="contained"
                color={isFav ? "error" : "primary"}
                onClick={handleFav}
                startIcon={isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              >
                {isFav ? "Remover favorito" : "Favoritar"}
              </Button>

              {trailerKey && (
                <Button
                  variant="outlined"
                  startIcon={<PlayArrowRoundedIcon />}
                  href={`https://www.youtube.com/watch?v=${trailerKey}`}
                  target="_blank"
                  rel="noopener"
                >
                  Trailer
                </Button>
              )}

              <Button
                variant="text"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
              >
                Voltar
              </Button>
            </Stack>

            {cast.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Elenco principal
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {cast.map((c) => (
                    <Chip
                      key={c.cast_id ?? c.credit_id}
                      label={`${c.name}${
                        c.character ? ` — ${c.character}` : ""
                      }`}
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
              </>
            )}
          </Stack>
        </Grid>
      </Grid>

      {recs.length > 0 && (
        <Box sx={{ mt: 4, px: { xs: 2, sm: 0 } }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recomendações
          </Typography>
          <ResultsGrid
            items={recs.slice(0, 12)}
            onCardClick={goToItem}
            favoritesSet={favoritesSet}
            onToggleFavorite={toggleFavorite}
          />
        </Box>
      )}
    </Container>
  );
}
