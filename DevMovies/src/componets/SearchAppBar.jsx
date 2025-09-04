// src/components/SearchAppBar.jsx
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  alpha,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.common.white, 0.08),
  "&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.14) },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: { marginLeft: theme.spacing(1), width: "auto" },
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
    width: "100%",
    [theme.breakpoints.up("md")]: { width: "40ch" },
  },
}));

export default function SearchAppBar({ value, onChange, onSubmit }) {
  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          DevMovies
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit?.();
          }}
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
      </Toolbar>
    </AppBar>
  );
}
