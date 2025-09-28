document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const messageElement = document.getElementById('message');
    const viewRegistrationsBtn = document.getElementById('viewRegistrationsBtn');
    const registrationsListDiv = document.getElementById('registrationsList');

    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!name || !email) {
            displayMessage('Name and Email are required.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            displayMessage('Please enter a valid email address.', 'error');
            return;
        }

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
            });

            const data = await response.json();

            if (response.ok) {
                displayMessage(data.message, 'success');
                registrationForm.reset();
            } else {
                displayMessage(data.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            displayMessage('An error occurred during registration.', 'error');
        }
    });

    viewRegistrationsBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/registrations');
            const registrations = await response.json();

            if (response.ok) {
                displayRegistrations(registrations);
            } else {
                displayMessage(registrations.message, 'error');
            }
        } catch (error) {
            console.error('Error fetching registrations:', error);
            displayMessage('An error occurred while fetching registrations.', 'error');
        }
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function displayMessage(msg, type) {
        messageElement.textContent = msg;
        messageElement.className = `message ${type}`;
        messageElement.classList.remove('hidden');
        setTimeout(() => {
            messageElement.classList.add('hidden');
        }, 3000);
    }

    function displayRegistrations(registrations) {
        registrationsListDiv.innerHTML = '';
        if (registrations.length === 0) {
            registrationsListDiv.innerHTML = '<p>No registrations found.</p>';
        } else {
            const ul = document.createElement('ul');
            registrations.forEach(reg => {
                const li = document.createElement('li');
                li.textContent = `Name: ${reg.name}, Email: ${reg.email}`;
                ul.appendChild(li);
            });
            registrationsListDiv.appendChild(ul);
        }
        registrationsListDiv.classList.remove('hidden');
    }
});