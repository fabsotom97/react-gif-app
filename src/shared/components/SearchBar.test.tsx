import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { SearchBar } from "./SearchBar";

describe('SearchBar', () => {

    test('should render the serach bar correctly', () => {

        const { container } = render(<SearchBar onQuery={() => { }} />);

        expect(container).toMatchSnapshot();
        expect(screen.getByRole('textbox')).toBeDefined();
        expect(screen.getByRole('button')).toBeDefined();
    });

    test('should call onQuery with the correct value after debounce', async () => {

        const onQuery = vi.fn();
        render(<SearchBar onQuery={onQuery} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'test' } });

        // ensures to wait for the debounce to finish
        await waitFor(() => {
            expect(onQuery).toHaveBeenCalled();
            expect(onQuery).toHaveBeenCalledWith('test');
            expect(onQuery).not.toHaveBeenCalledWith('test2');
        });
    });

    test('should call only once with the last input (debounce)', async () => {

        const onQuery = vi.fn();
        render(<SearchBar onQuery={onQuery} />);

        const input = screen.getByRole('textbox');
        // re-creating the user typing
        fireEvent.change(input, { target: { value: 't' } });
        fireEvent.change(input, { target: { value: 'te' } });
        fireEvent.change(input, { target: { value: 'tes' } });
        fireEvent.change(input, { target: { value: 'test' } });

        await waitFor(() => {
            expect(onQuery).toHaveBeenCalledOnce();
            expect(onQuery).not.toHaveBeenCalledWith('t');
            expect(onQuery).not.toHaveBeenCalledWith('te');
            expect(onQuery).not.toHaveBeenCalledWith('tes');
            expect(onQuery).toHaveBeenCalledWith('test');
        });
    });

    test('should call onQuery when button is clicked with an input value', () => {

        const onQuery = vi.fn();
        render(<SearchBar onQuery={onQuery} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'test' } });

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(onQuery).toHaveBeenCalledOnce();
        expect(onQuery).toHaveBeenCalledWith('test');
    });

    test('should the input have the correct placeholder value', () => {
        const placeholder = "Search something interesting";
        render(<SearchBar onQuery={() => { }} placeholder={placeholder} />);
        expect(screen.getByPlaceholderText(placeholder)).toBeDefined();
    });
});