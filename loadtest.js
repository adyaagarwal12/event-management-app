import http from 'k6/http';
import { check } from 'k6';

export const options = {
    scenarios: {
        load_test: {
            executor: 'shared-iterations',
            vus: 10,
            iterations: 1000,
            maxDuration: '5m'
        }
    }
};

export default function () {
    const res = http.get('http://host.docker.internal/api/events');

    check(res, {
        'status is 200': (r) => r.status === 200
    });
}