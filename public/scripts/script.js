const apiBase = 'http://localhost:3000'

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const username = document.getElementById('reg-username').value
    const email = document.getElementById('reg-email').value
    const password = document.getElementById('reg-password').value

    try {
        const response = await fetch(`${apiBase}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        })

        if (response.ok) {
            alert('Registration successful!')
            document.getElementById('register').style.display = 'none'
            document.getElementById('login').style.display = 'block'
        } else {
            const error = await response.json()
            alert(`Error: ${error.error}`)
        }
    } catch (err) {
        console.error('Registration error:', err)
    }
})

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const username = document.getElementById('login-username').value
    const password = document.getElementById('login-password').value

    try {
        const response = await fetch(`${apiBase}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const text = await response.text()
        console.log('Response text:', text)

        if (response.ok) {
            const data = JSON.parse(text)
            document.getElementById('welcome-message').textContent = data.message
            document.getElementById('dashboard').style.display = 'inline'
        } else {
            console.log('Error response:', text)
            alert(`Error: ${text}`)
        }
    } catch (err) {
        console.error('Login error:', err)
    }
})


document.getElementById('change-password-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const newPassword = document.getElementById('new-password').value
    const username = document.getElementById('login-username').value

    try {
        const response = await fetch(`${apiBase}/change-password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, newPassword }),
        })

        if (response.ok) {
            alert('Password changed successfully!')
        } else {
            const error = await response.json()
            alert(`Error: ${error.error}`)
        }
    } catch (err) {
        console.error('Change password error:', err)
    }
})

document.getElementById('logout').addEventListener('click', () => {
    document.getElementById('register').style.display = 'block'
    document.getElementById('login').style.display = 'block'
    document.getElementById('dashboard').style.display = 'none'
})

async function toggleUserData() {
    const usersList = document.getElementById('users-list')
    const usersSection = document.getElementById('users-section')
    const button = document.getElementById('fetch-users')

    if (usersSection.style.display === 'block') {
        usersList.innerHTML = ''
        usersSection.style.display = 'none'
        button.textContent = 'Fetch Users'
    } else {
        try {
            const response = await fetch(`${apiBase}/users`)

            if (response.ok) {
                const users = await response.json()
                
                usersList.innerHTML = ''
                users.forEach(user => {
                    const userElement = document.createElement('div')
                    userElement.classList.add('user')
                    userElement.innerHTML = `<strong>User:</strong>${user.username}<br><strong>Email:</strong>${user.email}`
                    usersList.appendChild(userElement)
                })

                usersSection.style.display = 'block'
                button.textContent = 'Clear Users'
            } else {
                const error = await response.json()
                alert(`Error: ${error.error}`)
            }
        } catch (err) {
            console.error('Fel vid hämtning av användardata:', err)
        }
    }
}

document.getElementById('fetch-users').addEventListener('click', toggleUserData)
