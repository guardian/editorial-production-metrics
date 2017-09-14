import axios from 'axios';
import moment from 'moment';

export const httpClient = axios.create({
    timeout: 5000,
    withCredentials: true
});

const getOriginatingSystem = (system, startDate, endDate, desk, productionOffice) =>
    httpClient.get(`api/originatingSystem/${system}`, {
        params: {
            startDate: startDate.format(),
            endDate: endDate.format(),
            desk: desk !== 'tracking/commissioningdesk/all' && desk || null,
            productionOffice: productionOffice !== 'all' && productionOffice || null
        }
    });

const getComposerVsIncopy = (startDate, endDate, desk, productionOffice) =>
    axios.all([
        getOriginatingSystem('composer', startDate, endDate, desk, productionOffice),
        getOriginatingSystem('incopy', startDate, endDate, desk, productionOffice)
    ]).then(
        axios.spread((composerResponse, inCopyResponse) => {
            return { composerResponse, inCopyResponse };
        })
    );

const getWorkflowCount = (isInWorkflow, startDate, endDate, desk, productionOffice) =>
    httpClient.get(`api/inWorkflow/${isInWorkflow}`, {
        params: {
            startDate: startDate.format(),
            endDate: endDate.format(),
            desk: desk !== 'tracking/commissioningdesk/all' && desk || null,
            productionOffice: productionOffice !== 'all' && productionOffice || null
        }
    });

const getInWorkflowVsNotInWorkflow = (startDate, endDate, desk, productionOffice) =>
    axios.all([
        getWorkflowCount('true', startDate, endDate, desk, productionOffice),
        getWorkflowCount('false', startDate, endDate, desk, productionOffice)
    ]).then(
        axios.spread((inWorkflowResponse, notInWorkflowResponse) => {
            return { inWorkflowResponse, notInWorkflowResponse };
        })
    );

const getCommissioningDesks = () => httpClient.get('api/commissioningDesks');

export default {
    getComposerVsIncopy,
    getInWorkflowVsNotInWorkflow,
    getCommissioningDesks
};
