import { useState } from "react";
import type { Gif } from "../interfaces/gif.interface";
import { getGifsByQuery } from "../actions/get-gifs-by-query.action";

export interface InitialValues {
    gifs: Gif[];
    previousTerms: string[];
}

export interface UseGifsProps {
    initialValues: InitialValues;
}

export const useGifs = (props: UseGifsProps) => {

    const [gifs, setGifs] = useState<Gif[]>(props.initialValues.gifs);
    const [previousTerms, setPreviousTerms] = useState<string[]>(props.initialValues.previousTerms);

    const handleTermClicked = (term: string) => {
        console.log({ term });
    };

    const handleSearch = async (query: string = '') => {
        query = query.trim().toLowerCase();

        if (query.length === 0) return;

        if (previousTerms.includes(query)) return;

        setPreviousTerms([query, ...previousTerms].splice(0, 8));

        const gifs = await getGifsByQuery(query);
        setGifs(gifs);
    };

    return {
        gifs,
        previousTerms,
        handleTermClicked,
        handleSearch
    };
};