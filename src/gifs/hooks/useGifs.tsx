import { useRef, useState } from "react";
import type { Gif } from "../interfaces/gif.interface";
import { getGifsByQuery } from "../actions/get-gifs-by-query.action";

export interface InitialValuesProps {
    gifs: Gif[];
    previousTerms: string[];
}

export const useGifs = (initialValues: InitialValuesProps) => {

    const [gifs, setGifs] = useState<Gif[]>(initialValues.gifs);
    const [previousTerms, setPreviousTerms] = useState<string[]>(initialValues.previousTerms);

    const gifsCache = useRef<Record<string, Gif[]>>({});

    const handleTermClicked = async (term: string) => {
        if (gifsCache.current[term]) {
            setGifs(gifsCache.current[term]);
            return;
        }
        const gifs = await getGifsByQuery(term);
        setGifs(gifs);
    };

    const handleSearch = async (query: string = '') => {
        query = query.trim().toLowerCase();

        if (query.length === 0) return;

        if (previousTerms.includes(query)) return;

        setPreviousTerms([query, ...previousTerms].splice(0, 8));

        const gifs = await getGifsByQuery(query);
        setGifs(gifs);

        gifsCache.current[query] = gifs;
    };

    return {
        gifs,
        previousTerms,
        handleTermClicked,
        handleSearch
    };
};