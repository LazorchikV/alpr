import {FETCH_METHOD} from '../constants';

export const dataProvider = async (url, method, request) => {
    const {GET, POST, PATCH, DELETE, HEAD} = FETCH_METHOD;
    const headers = {
        'Content-Type': 'application/json',
    };
    let response;

    try {
        if (method === GET) {
            response = await fetch(url, {
                method,
                headers,
            });
        }

        if (method === POST) {
            response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(request)
            });
        }

        if (method === PATCH) {
            response = await fetch(url, {
                method,
                headers,
            });
        }

        if (method === DELETE) {
            response = await fetch(url, {
                method,
                headers,
            });
        }

        if (method === HEAD) {
            response = await fetch(url, {
                method,
                headers,
            });
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

