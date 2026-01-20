// using native fetch

const registerUser = async () => {
    const url = 'http://localhost:8081/api/auth/register';
    const num = Math.floor(Math.random() * 10000);
    const user = {
        name: `Test User ${num}`,
        email: `testuser${num}@example.com`,
        password: 'password123',
        role: 'USER'
    };

    console.log('Attempting to register:', user);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Registration SUCCESS!');
            console.log('Response:', data);
        } else {
            console.error('❌ Registration FAILED');
            console.error('Status:', response.status);
            const text = await response.text();
            console.error('Body:', text);
        }
    } catch (error) {
        console.error('❌ Network Error:', error.message);
    }
};

registerUser();
