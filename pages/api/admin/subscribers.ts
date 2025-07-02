import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

interface Subscriber {
    id: number;
    name: string;
    email: string;
    subscribed_at: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = req.headers.authorization?.split(' ')[1];
    if (apiKey !== process.env.ADMIN_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });

        const [rows] = await connection.execute(
            'SELECT id, name, email, subscribed_at FROM subscribers ORDER BY subscribed_at DESC'
        );

        const subscribers = rows as Subscriber[];
        await connection.end();

        res.status(200).json(subscribers);
    } catch (error) {
        console.error('DB Error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
}