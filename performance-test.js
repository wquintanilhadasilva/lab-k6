//Find crocodile  by id
/**
 * Ramp up 10 VU in 10s
 * Load 10 VU for 10s
 * Ramp down 0 VU in 10s
 * 
 * Limits - Thresholds:
 * Success requests > 95%
 * Request time p(90) < 200
 * 
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

export const options = {
    stages: [
        {duration: '10s', target: 10},
        {duration: '10s', target: 10},
        {duration: '10s', target: 0}
    ],
    thresolds: {
        checks: ['rate > 0.95'],
        http_req_duration: ['p(95) < 200']
    }
}

const data = new SharedArray("Leitura do json", function() {
    return JSON.parse(open('data/crocodiles.json')).crocodilos;
});

export default function() {
    const crocodilo =- data[Math.floor(Math.random() * data.length)].id;
    const BASE_URL = `http://test-api.k6.io/public/crocodiles/${crocodilo}`;
    const res = http.get(BASE_URL);
    check( res, {
        'status code 200': (r) => r.status === 200
    });

    // Ensure One request by second
    sleep(1);
}


