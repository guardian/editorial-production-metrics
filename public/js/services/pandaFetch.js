import { reEstablishSession } from 'panda-session';
import axios from 'axios';

const httpClient = axios.create({
    timeout: 5000,
    withCredentials: true
});

const checkStatus = (res) => {
    if (res.status >= 200 && res.status < 300) {
        return res;
    } else {
        throw res;
    }
};

export const pandaFetch = (url, params) => {
    return new Promise(function(resolve, reject) {
        httpClient.get(url, params)
            .then(checkStatus)
            .then(res => resolve(res))
            .catch(err => {
                if (err.response.status === 419) {
                    reEstablishSession('/reauth', 5000).then(
                        () => {
                            httpClient.get(url, params)
                                .then(checkStatus)
                                .then(res => resolve(res))
                                .catch(err => reject(err));
                        },
                        error => {
                            throw error;
                        });

                } else {
                    reject(err);
                }
            });
    });
};