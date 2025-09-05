import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  alpha,
  Box,
  IconButton,
  Badge,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.common.white, 0.08),
  "&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.14) },
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.2, 1.2, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
  },
}));

export default function SearchAppBar({
  value,
  onChange,
  onSubmit,
  favoritesCount = 0,
}) {
  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mr: 1 }}>
          DevMovies
        </Typography>

        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit?.();
          }}
          sx={{ flex: 1, maxWidth: 720 }}
        >
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Buscar filmes e séries…"
              inputProps={{ "aria-label": "search" }}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </Search>
        </Box>

        <Tooltip title="Início">
          <IconButton component={Link} to="/" edge="end">
            <HomeRoundedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Favoritos">
          <IconButton component={Link} to="/favorites" edge="end">
            <Badge color="error" badgeContent={favoritesCount}>
              <FavoriteBorderIcon />
            </Badge>
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
