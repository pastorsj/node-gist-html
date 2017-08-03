'use strict';
import axios from 'axios';

const api = axios.create({
    timeout: 20000,
    headers: {}
});

export default api;
