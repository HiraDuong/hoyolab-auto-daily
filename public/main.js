const apiUrl = `${window.location.origin}/api/accounts`;
document.addEventListener('DOMContentLoaded', function() {
    const hi3 = document.getElementById('hi3');
    const gi = document.getElementById('gi');
    const hsr = document.getElementById('hsr');
    const form = document.getElementById('my-form'); // Sửa id form thành accountForm
    const nicknameD = document.getElementById('nickname');
    const tokenD = document.getElementById('token');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const nickname = nicknameD.value;
        const token = tokenD.value;
        const hi3Value = hi3.checked;
        const giValue = gi.checked;
        const hsrValue = hsr.checked;
        const account = { nickname, token, hi3: hi3Value, gi: giValue, hsr: hsrValue };

        const apiEndpoint = `${apiUrl}`;

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(account)
            });

            if (response.ok) {
                const newAccount = await response.json();
                console.log(newAccount);
            } else {
                console.error('Cannot create account');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
