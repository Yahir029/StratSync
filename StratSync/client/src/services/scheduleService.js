import axios from 'axios';

// scheduleService.js
const API_BASE_URL = 'http://localhost:5000/api/horarios';

export const getAllSchedules = () => axios.get(API_BASE_URL);
export const createSchedule = (data) => axios.post(API_BASE_URL, data);
