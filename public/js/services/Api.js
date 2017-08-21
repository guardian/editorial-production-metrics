import axios from 'axios';
import moment from 'moment';

export const httpClient = axios.create({
    // baseURL: 'https://productionmetrics.local.dev-gutools.co.uk/', // Use this url in dev. TODO: Add proper ENV management
    baseURL: 'https://productionmetrics.gutools.co.uk/',
    timeout: 10000,
    headers: {
    }
});

const getOriginatingSystem = (system, startDate, endDate, desk) =>
    httpClient.get(`api/originatingSystem/${system}`, {
        params: {
            startDate: moment(startDate).format(),
            endDate: moment(endDate).format(),
            desk: desk !== 'tracking/commissioningdesk/all' && desk || null
        }
    });

const getComposerVsIncopy = (startDate, endDate, desk) =>
    axios.all([
        getOriginatingSystem('composer', startDate, endDate, desk),
        getOriginatingSystem('incopy', startDate, endDate, desk)
    ]).then(
        axios.spread((composerResponse, inCopyResponse) => {
            return { composerResponse, inCopyResponse };
        })
    );

const getCommissioningDesks = () => httpClient.get('api/commissioningDesks');

export default {
    getOriginatingSystem,
    getComposerVsIncopy,
    getCommissioningDesks
};