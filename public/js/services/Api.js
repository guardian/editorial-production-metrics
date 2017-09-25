import axios from 'axios';
import { pandaFetch } from './pandaFetch';

const buildQueryParams = (startDate, endDate, desk, productionOffice) => ({
    params: {
        startDate: startDate.format(),
        endDate: endDate.format(),
        desk: desk !== 'tracking/commissioningdesk/all' && desk || null,
        productionOffice: productionOffice !== 'all' && productionOffice || null
    }
});

const getOriginatingSystem = (system, startDate, endDate, desk, productionOffice) => 
    pandaFetch(`api/originatingSystem/${system}`, buildQueryParams(startDate, endDate, desk, productionOffice));

const getWorkflowCount = (isInWorkflow, startDate, endDate, desk, productionOffice) =>
    pandaFetch(`api/inWorkflow/${isInWorkflow}`, buildQueryParams(startDate, endDate, desk, productionOffice));

const getCommissioningDesks = () => pandaFetch('api/commissioningDesks', null);

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

export default {
    getComposerVsIncopy,
    getInWorkflowVsNotInWorkflow,
    getCommissioningDesks,
    getForkTime
};