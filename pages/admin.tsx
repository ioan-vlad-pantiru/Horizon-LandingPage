import { useEffect, useState } from 'react';

interface Subscriber {
    id: number;
    name: string;
    email: string;
    phone?: string;
    intention?: string;
    linkedin?: string;
    status?: string;
    subscribed_at?: string;
    created_at?: string;
    updated_at?: string;
}

export default function AdminPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL =
        process.env.NODE_ENV === 'development'
            ? 'https://horizon-hud.eu/api/subscribers.php' // full URL to production API
            : '/api/subscribers.php'; // relative when static site is live on cPanel


    useEffect(() => {
        fetch('https://horizon-hud.eu/api/subscribers.php', {
            headers: {
                Authorization: 'Bearer horizonhud_admin', // Use your actual admin key!
            },
        })
            .then(async (res) => {
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.message || `HTTP ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setSubscribers(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h1>📋 Subscribed Users</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>Error: {error}</p>
            ) : subscribers.length === 0 ? (
                <p>No subscribers found.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Intention</th>
                        <th>Status</th>
                        <th>Subscribed At</th>
                    </tr>
                    </thead>
                    <tbody>
                    {subscribers.map((sub) => (
                        <tr key={sub.id}>
                            <td>{sub.id}</td>
                            <td>{sub.name}</td>
                            <td>{sub.email}</td>
                            <td>{sub.phone || '-'}</td>
                            <td>{sub.intention || '-'}</td>
                            <td>{sub.status || '-'}</td>
                            <td>{sub.created_at ? new Date(sub.created_at).toLocaleString() : '-'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

AdminPage.getLayout = (page: any) => page;