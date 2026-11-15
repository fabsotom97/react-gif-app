import { beforeEach, describe, expect, test, vi } from 'vitest';
import AxiosMockAdapter from 'axios-mock-adapter';
import { giphyApi } from '../api/giphy.api';
import { getGifsByQuery } from './get-gifs-by-query.action';
import { giphySearchResponseMock } from '../../tests/mocks/giphy.response.data';

describe('getGifsByQuery', () => {

    const mock = new AxiosMockAdapter(giphyApi);

    beforeEach(() => {
        mock.reset();
    });

    test('should return a list of gifs', async () => {

        mock.onGet('/search').reply(200, giphySearchResponseMock);

        const gifs = await getGifsByQuery('goku');
        expect(gifs.length).toBe(10);
        gifs.forEach((gif) => {
            expect(typeof gif.id).toBe('string');
            expect(typeof gif.height).toBe('number');
            expect(typeof gif.width).toBe('number');
        })
    });

    test('should return and empty list if query is empty', async () => {
        const gifs = await getGifsByQuery('');
        // returns zero length but could be false positive due to the fact
        // that I am using a mock and I reset such mock on every test
        expect(gifs.length).toBe(0);
        // making sure it was never called
        expect(mock.history.get.length).toBe(0);
    });

    test('should handle error when the API returns an error', async () => {

        const consoleErrorSpy = vi.spyOn(console, 'error')
            // overriding the actual logging to avoid flooding the console output
            .mockImplementation(() => {})

        mock.onGet('/search').reply(400, {
            data: {
                message: 'Bad Request',
            },
        });

        const gifs = await getGifsByQuery('Goku');
        expect(gifs.length).toBe(0);
        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.anything());
    });
});