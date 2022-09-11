const configs = {
    development: {
        apiUrl: 'https://doubtful.herokuapp.com',
        origin: 'https://doubtful.app/api',
    },
    test: {
        apiUrl: 'http://localhost:3000',
        origin: 'http://localhost:3001/api',
    },
    production: {
        apiUrl: 'http://localhost:3000',
        origin: 'http://localhost:3001/api',
    },
};

const environment = process.env.NODE_ENV || 'development';
export const config = configs[environment];
