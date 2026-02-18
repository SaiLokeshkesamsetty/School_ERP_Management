const axios = require('axios');

const loginAndFetch = async () => {
    try {
        // 1. Login (Replace with credentials found in debug_users.js or default admin if needed for testing)
        // I will use a known pattern or the user I just found if possible. 
        // If no teacher exists, I might need to create one or use admin if admin has access.
        // Dashboard route has checkRole(['teacher', 'admin'])

        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            username: 'admin', // Admin also has access, let's test with admin first to see if data comes back
            password: 'adminpassword'
        });

        const token = loginRes.data.token;
        console.log('Got Token');

        // 2. Fetch Dashboard
        const dashRes = await axios.get('http://localhost:5000/api/dashboard/teacher', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Dashboard Data:', JSON.stringify(dashRes.data, null, 2));

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

loginAndFetch();
