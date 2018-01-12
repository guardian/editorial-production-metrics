import axios from 'axios';
import { pandaFetch } from './pandaFetch';

const buildQueryParams = (startDate, endDate, desk, productionOffice) => ({
    params: {
        startDate: startDate,
        endDate: endDate,
        desk: desk !== 'tracking/commissioningdesk/all' && desk || null,
        productionOffice: productionOffice !== 'all' && productionOffice || null
    }
});

const getOriginatingSystem = (system, startDate, endDate, desk, productionOffice) => 
    pandaFetch(`api/originatingSystem/${system}`, buildQueryParams(startDate, endDate, desk, productionOffice));

const getWorkflowCount = (isInWorkflow, startDate, endDate, desk, productionOffice) =>
    pandaFetch(`api/inWorkflow/${isInWorkflow}`, buildQueryParams(startDate, endDate, desk, productionOffice));

const getCommissioningDesks = () => pandaFetch('api/commissioningDesks', null);

const getNewspaperBooks = () => pandaFetch('api/newspaperBooks', null);

const getForkTime = (startDate, endDate, newspaperBook) => pandaFetch(`api/fork/${newspaperBook}`, buildQueryParams(startDate, endDate));

const getComposerVsIncopy = (startDate, endDate, desk, productionOffice) =>
    axios.all([
        getOriginatingSystem('composer', startDate, endDate, desk, productionOffice),
        getOriginatingSystem('incopy', startDate, endDate, desk, productionOffice)
    ]).then(
        axios.spread((composerResponse, inCopyResponse) => {
            return { composerResponse, inCopyResponse };
        })
    );

const getInWorkflowVsNotInWorkflow = (startDate, endDate, desk, productionOffice) =>
    axios.all([
        getWorkflowCount('true', startDate, endDate, desk, productionOffice),
        getWorkflowCount('false', startDate, endDate, desk, productionOffice)
    ]).then(
        axios.spread((inWorkflowResponse, notInWorkflowResponse) => {
            return { inWorkflowResponse, notInWorkflowResponse };
        })
    );

const getWordCount = (startDate, endDate, desk, productionOffice) =>
    pandaFetch(
        "api/wordCount/groupedWordCounts",
        buildQueryParams(startDate, endDate, desk, productionOffice)
    );

const getCommissionedLength = (startDate, endDate, desk, productionOffice) =>
    pandaFetch(
        "api/wordCount/groupedWordCounts", // TODO: change
        buildQueryParams(startDate, endDate, desk, productionOffice)
    );

const getWordCountArticles = (startDate, endDate, desk, productionOffice) =>
    pandaFetch(
        "api/wordCount/articles",
        buildQueryParams(startDate, endDate, desk, productionOffice)
    );

export default {
    getComposerVsIncopy,
    getInWorkflowVsNotInWorkflow,
    getCommissioningDesks,
    getNewspaperBooks,
    getForkTime,
    getWordCount,
    getCommissionedLength,
    getWordCountArticles
};