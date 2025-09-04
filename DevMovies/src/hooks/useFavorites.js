import { useEffect, useMemo, useState } from "react";

export function useFavorites(storageKey = "favorites") {
    const [favorites, setFavorites] = useState(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(favorites));
    }, [favorites, storageKey]);

    const favoritesSet = useMemo(
        () => new Set(favorites.map((f) => `${f.type}: ${f.id}`)),
        [favorites]
    );

    const toggleFavorite = (item) => {
        setFavorites((prev) => {
            const key = `${item.type}: ${item.id}`;
            const exists = prev.some((f) => `${f.type}: ${f.id}` === key);
            if (exists) return prev.filter((f) => `${f.type}: ${f.id}` !== key);

            const { id, type, title, poster, vote_average, release_date, overview } = item;
            return [...prev, { id, type, title, poster, vote_average, release_date, overview }];
        });
    };

    return { favorites, favoritesSet, toggleFavorite };
}