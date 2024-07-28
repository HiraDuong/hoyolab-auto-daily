const apiUrl = `${window.location.origin}/api/accounts`
const gameApiUrl = `${window.location.origin}/api/game`

const getGames = async () => {
        try {
                const games = await fetch(`${gameApiUrl}/all`)
                        .then((res) => res.json())
                        .then((data) => data)
                return games
        } catch (error) {
                console.error('Error:', error)
        }
}

document.addEventListener('DOMContentLoaded', async function () {
        const loader = document.getElementById('loader-container')
        const form = document.getElementById('my-form') // Sửa id form thành accountForm
        const nicknameD = document.getElementById('nickname')
        const tokenD = document.getElementById('token')
        const check_box_list = document.getElementById('check-box-list')
        const getCookieBtn = document.getElementById('get-cookie-btn')
        loader.style.display = 'flex'
        const games = await getGames()

        games.forEach((game) => {
                console.log(game)
                const listChild = document.createElement('div')
                listChild.classList.add('list-group-item')
                const label = document.createElement('label')
                label.htmlFor = game.game
                label.textContent = game.game + ':'
                listChild.appendChild(label)

                const input = document.createElement('input')
                input.type = 'checkbox'
                input.id = game.game
                input.name = game.game
                input.value = game.game
                listChild.appendChild(input)

                check_box_list.appendChild(listChild)
        })
        setTimeout(() => (loader.style.display = 'none'), 1000)

        form.addEventListener('submit', async function (e) {
                loader.style.display = 'flex'
                e.preventDefault()

                const nickname = nicknameD.value
                const token = tokenD.value

                // Thu thập giá trị của các checkbox được chọn
                const selectedGames = {}
                games.forEach((game) => {
                        const checkbox = document.getElementById(game.game)
                        selectedGames[game.game] = checkbox.checked
                })

                const account = {
                        nickname,
                        token,
                        ...selectedGames, // Thêm các giá trị checkbox vào đối tượng account
                }
                cons
                const apiEndpoint = `${apiUrl}`

                try {
                        const response = await fetch(apiEndpoint, {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(account),
                        })

                        if (response.ok) {
                                const newAccount = await response.json()
                                console.log(newAccount)
                                alert('Account created successfully')
                        } else {
                                console.error('Cannot create account')
                                alert('Failed to create account')
                        }
                } catch (error) {
                        console.error('Error:', error)
                }
                location.reload()
        })

        getCookieBtn.addEventListener('click', function () {
                alert(
                        'Sorry this feature is not available yet\nPlease try again later',
                )
        })
})
