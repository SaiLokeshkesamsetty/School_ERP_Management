
async function testLogin() {
    try {
        console.log('Attempting login...');
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: '2005' })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Login Success:', data);
        } else {
            console.log('Login Failed:', response.status, response.statusText);
            const text = await response.text();
            console.log('Response:', text);
        }
    } catch (error) {
        console.error('Connection Failed:', error.cause ? error.cause : error.message);
    }
}
testLogin();
