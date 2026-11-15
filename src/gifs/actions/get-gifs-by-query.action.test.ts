import { describe, expect, test } from 'vitest';
import AxiosMockAdapter from 'axios-mock-adapter';
import { giphyApi } from '../api/giphy.api';
import { getGifsByQuery } from './get-gifs-by-query.action';
import { giphySearchResponseMock } from '../../tests/mocks/giphy.response.data';

describe('getGifsByQuery', () => {

    const mock = new AxiosMockAdapter(giphyApi);

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
});