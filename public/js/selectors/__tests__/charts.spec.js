import createTestStore from "./createTestStore";
import {
    getRawComposerVsIncopy,
    getComposerVsIncopyData,
    getComposerVsIncopy
} from "../charts";

const isValidDataPoint = ({ x, y, label }) =>
    x > -1 && y > -1 && typeof label === "string";

describe("Chart selectors", () => {
    let store;

    beforeEach(() => {
        store = createTestStore();
    });

    describe("getRawComposerVsIncopy", () => {
        it("returns the right part of the state", () => {
            expect(getRawComposerVsIncopy(store)).toBe(
                store.charts.composerVsInCopy
            );
        });
    });

    describe("getComposerVsIncopyData", () => {
        let result;

        beforeEach(() => {
            result = getComposerVsIncopyData.resultFunc(
                store.charts.composerVsInCopy
            );
        });

        it("returns the correct number of series", () => {
            expect(result.absolute.length).toBe(2);
        });

        it("has the correct number of valid data points in each series", () => {
            result.absolute.forEach(({ data }) => {
                expect(data).length === 3;
                data.forEach(dataPoint =>
                    expect(isValidDataPoint(dataPoint)).toBe(true)
                );
            });
        });

        it("memoizes the data correctly", () => {
            getComposerVsIncopyData.resetRecomputations();
            const result1 = getComposerVsIncopyData(store);
            const result2 = getComposerVsIncopyData(store);

            expect(getComposerVsIncopyData.recomputations()).toBe(1);

            expect(result1).toBe(result2);
        });

        it("returns an empty data set while pending", () => {
            store.charts.composerVsInCopy.pending = true;

            result = getComposerVsIncopyData.resultFunc(
                store.charts.composerVsInCopy
            );

            expect(result).toEqual({
                absolute: [],
                percent: []
            });
        });
    });

    describe("getComposerVsIncopy", () => {
        it("returns a valid chart state object", () => {
            const result = getComposerVsIncopy.resultFunc(
                {
                    error: false,
                    isStacked: true
                },
                []
            );

            expect(result).toEqual({
                error: false,
                isStacked: true,
                data: []
            });
        });
    });
});
