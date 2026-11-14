import { useState } from "react";
import type { Gif } from "../interfaces/gif.interface";
import { getGifsByQuery } from "../actions/get-gifs-by-query.action";

export interface InitialValuesProps {
    gifs: Gif[];
    previousTerms: string[];
}
// outside the hook to avoid re-rendering the component when the cache is updated
const gifsCache: Record<string, Gif[]> = {};

export const useGifs = (initialValues: InitialValuesProps) => {

    const [gifs, setGifs] = useState<Gif[]>(initialValues.gifs);
    const [previousTerms, setPreviousTerms] = useState<string[]>(initialValues.previousTerms);

    const handleTermClicked = async (term: string) => {
        if (gifsCache[term]) {
            setGifs(gifsCache[term]);
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

        gifsCache[query] = gifs;
    };

    return {
        gifs,
        previousTerms,
        handleTermClicked,
        handleSearch
    };
};