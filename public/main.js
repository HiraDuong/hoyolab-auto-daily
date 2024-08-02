const apiUrl = `${window.location.origin}/api/accounts`
const gameApiUrl = `${window.location.origin}/api/game`
const proxyUrl = `${window.location.origin}/proxy`
const getCookiesUrl = `${window.location.origin}/get-cookies`

const getGames = async () => {
        try {
                const response = await fetch(`${gameApiUrl}/all`)
                const data = await response.json()
                return data
        } catch (error) {
                console.error('Error:', error)
        }
}

document.addEventListener('DOMContentLoaded', async function () {
        const loader = document.getElementById('loader-container')
        const form = document.getElementById('my-form')
        const nicknameD = document.getElementById('nickname')
        const tokenD = document.getElementById('token')
        const check_box_list = document.getElementById('check-box-list')
        const getCookieBtn = document.getElementById('get-cookie-btn')
        const loginDoneBtn = document.getElementById('login-done-btn')

        loader.style.display = 'flex'
        const games = await getGames()

        games.forEach((game) => {
                const listChild = document.createElement('div')
                listChild.classList.add('list-group-item')

                const label = document.createElement('label')
                label.htmlFor = game.game
                label.textContent = `${game.game}:`
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
                loader.style.display = 'none'
        })

        getCookieBtn.addEventListener('click', async function () {
                loginDoneBtn.style.display = 'block'
                try {
                        const response = await fetch(proxyUrl, {
                                method: 'GET',
                                credentials: 'include', // Đảm bảo rằng các cookie sẽ được gửi kèm theo yêu cầu
                        })
                        console.log('browser open: ' + JSON.stringify(response))
                } catch (error) {
                        console.error('Có lỗi xảy ra khi lấy dữ liệu:', error)
                }
        })
        loginDoneBtn.addEventListener('click', async function () {
                loader.style.display = 'flex'

                try {
                        const response = await fetch(getCookiesUrl, {
                                method: 'GET',
                                credentials: 'include',
                        })

                        const cookies = await response.json()

                        // Chuyển đổi danh sách cookie thành chuỗi
                        const cookieString = cookies
                                .map(
                                        (cookie) =>
                                                `${cookie.name}=${cookie.value}`,
                                )
                                .join('; ')
                        tokenD.value = cookieString
                        console.log('cookie string: ' + cookieString)
                        cookies.forEach((cookie) => {
                                console.log(
                                        `Name: ${cookie.name}, Value: ${cookie.value}`,
                                )
                        })
                        loader.style.display = 'none'
                } catch (error) {
                        console.error('Error:', error)
                }
        })
})
