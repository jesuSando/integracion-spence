import dotenv from 'dotenv';
dotenv.config();

export default{
    trackerApi: process.env.TRACKER_API,
    trackerHash: process.env.TRACKER_HASH,
    wisetrackUrl: process.env.WISETRACK_URL,
    wisetrackToken: process.env.WISETRACK_TOKEN
};