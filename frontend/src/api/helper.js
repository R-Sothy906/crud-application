// src/services/request.js
import axios from 'axios';
import { config } from '../api/api';

export const request = async (url = "", method = "get", data = {}) => {
  try {
    const response = await axios({
      url: config.base_url + url,
      method: method.toLowerCase(),
      data: method.toLowerCase() !== 'get' ? data : undefined,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
    
  } catch (err) {
    console.error('Request error:', err);
    
    if (err.response) {
      return err.response.data;
    } else if (err.request) {
      throw new Error('Cannot connect to server');
    } else {
      throw new Error(err.message);
    }
  }
};

export const get = (url) => request(url, 'get');
export const post = (url, data) => request(url, 'post', data);
export const put = (url, data) => request(url, 'put', data);
export const del = (url) => request(url, 'delete');