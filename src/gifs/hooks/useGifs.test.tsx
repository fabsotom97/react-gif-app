import { describe, expect, test, vi } from "vitest";
import { act, renderHook } from '@testing-library/react';
import { useGifs } from "./useGifs";
import * as gifActions from "../actions/get-gifs-by-query.action";
import { gifsMock } from "../../tests/mocks/gifs.data";

describe('useGifs', () => {

    test('should return default values and methods', () => {

        const { result } = renderHook(() => useGifs());
        expect(result.current.gifs.length).toBe(0);
        expect(result.current.previousTerms.length).toBe(0);
        expect(result.current.handleSearch).toBeDefined();
        expect(result.current.handleTermClicked).toBeDefined();
    });

    test('should return a list of gifs', async () => {

        const { result } = renderHook(() => useGifs());

        // preventing from calling the actual API
        vi.spyOn(gifActions, 'getGifsByQuery')
            .mockResolvedValue(gifsMock);

        await act(async () => {
            // invoke/fire the search
            await result.current.handleSearch('goku');
        })

        expect(result.current.gifs.length).toBe(10);
    });

    test('should return a list of gifs when handleTermClicked is called', async () => {

        const { result } = renderHook(() => useGifs());
        await act(async () => {
            // invoke/fire the search
            await result.current.handleTermClicked('goku');
        })

        expect(result.current.gifs.length).toBe(10);
    });

    test('should return a list of gis from cache', async () => {
        const { result } = renderHook(() => useGifs());
        // preventing from calling the actual API
        vi.spyOn(gifActions, 'getGifsByQuery')
            .mockResolvedValue(gifsMock);

        await act(async () => {
            // invoke/fire the search
            await result.current.handleTermClicked('goku');
        })

        expect(result.current.gifs.length).toBe(10);

        // provoking a failure to make sure it didnt get up to this point
        // during the second call
        // note: there has to be a better way of making sure the expected behaviour
        vi.spyOn(gifActions, 'getGifsByQuery')
            .mockRejectedValue(new Error('Oops, something went wrong!'));

        await act(async () => {
            // invoke/fire the search
            await result.current.handleTermClicked('goku');
        });
        expect(result.current.gifs.length).toBe(10);
    });

    test('should not return more than 8 previous terms', async () => {

        const { result } = renderHook(() => useGifs());
        // preventing from calling the actual API
        vi.spyOn(gifActions, 'getGifsByQuery')
            .mockResolvedValue([]);

        // setting up an array for a total of 10 search items
        const searchItems = new Array(10)
            .fill('goku')
            .map((value, i) => `${value} ${i + 1}`);
        // for loop to make sequential calls
        for (const item of searchItems) {
            await act(async () => {
                // no need for try catch since the spy is set up
                // to respond with an empty array
                await result.current.handleSearch(item);
            });
        }

        expect(result.current.previousTerms.length).toBe(8);
        // since the latest term is stored at the beginning...
        expect(result.current.previousTerms[0]).toBe('goku 10')
        expect(result.current.previousTerms[7]).toBe('goku 3');
    });
});