const apiUrl = `${window.location.origin}/api/game`

document.addEventListener('DOMContentLoaded', function () {
        const loader = document.getElementById('loader-container')
        const button = document.getElementById('game-list-btn')
        const table = document.getElementById('game-list-table')
        const thead = table.querySelector('thead')
        const tbody = table.querySelector('tbody')
        const addBtn = document.getElementById('game-add-btn')
        const form = document.getElementById('my-form')
        const game = document.getElementById('game')
        const url = document.getElementById('url')
        loader.style.display = 'flex'
        setTimeout(() => (loader.style.display = 'none'), 1000)
        button.addEventListener('click', async function () {
                loader.style.display = 'flex'
                try {
                        const response = await fetch(`${apiUrl}/all`)
                        if (response.ok) {
                                const games = await response.json()
                                console.log(games)
                                if (!games.length) {
                                        alert('No game found')
                                        return
                                }
                                // Xóa tất cả các hàng cũ trong tbody
                                tbody.innerHTML = ''

                                // Xóa tất cả các tiêu đề cũ trong thead
                                thead.innerHTML = '<tr id="table-header"></tr>'
                                const tableHeaderRow =
                                        thead.querySelector('#table-header')

                                // Lấy danh sách tất cả các khóa từ đối tượng đầu tiên, trừ khóa đầu và cuối
                                const headers = Object.keys(games[0]).slice(
                                        1,
                                        -1,
                                )

                                // Tạo và thêm các tiêu đề cột, trừ cột đầu và cuối
                                headers.forEach((header) => {
                                        const th = document.createElement('th')
                                        th.textContent = header
                                        tableHeaderRow.appendChild(th)
                                })

                                // Thêm tiêu đề cột cho nút hành động
                                const actionTh = document.createElement('th')
                                actionTh.textContent = 'Actions'
                                tableHeaderRow.appendChild(actionTh)

                                // Tạo các hàng dữ liệu
                                games.forEach((game) => {
                                        const row = document.createElement('tr')
                                        headers.forEach((header) => {
                                                const td =
                                                        document.createElement(
                                                                'td',
                                                        )
                                                td.classList.add(header)
                                                td.textContent = game[header]
                                                row.appendChild(td)
                                        })

                                        // Thêm cột cho nút hành động
                                        const actionTd =
                                                document.createElement('td')

                                        const updateButton =
                                                document.createElement('button')
                                        updateButton.textContent = 'Update'
                                        updateButton.classList.add(
                                                'btn',
                                                'btn-update',
                                        ) // Thêm lớp CSS cho nút Update
                                        updateButton.onclick = () => {
                                                // Xử lý cập nhật ở đây
                                                console.log(
                                                        `Update ${game._id}`,
                                                )
                                                alert(
                                                        'Hiện không thể update game\n Vui lòng xóa game và thêm lại game',
                                                )
                                        }

                                        const deleteButton =
                                                document.createElement('button')
                                        deleteButton.textContent = 'Delete'
                                        deleteButton.classList.add(
                                                'btn',
                                                'btn-delete',
                                        ) // Thêm lớp CSS cho nút Delete
                                        deleteButton.onclick = () => {
                                                // Xử lý xóa ở đây
                                                console.log(
                                                        `Delete ${game._id}`,
                                                )
                                                deleteGame(game._id)
                                        }

                                        actionTd.appendChild(updateButton)
                                        actionTd.appendChild(deleteButton)

                                        row.appendChild(actionTd)

                                        tbody.appendChild(row)
                                })
                        } else {
                                console.error('Error fetching games')
                        }
                } catch (error) {
                        console.error('Error:', error)
                }
                setTimeout(() => (loader.style.display = 'none'), 1000)
        })

        addBtn.addEventListener('click', function () {
                if (
                        form.style.display === 'none' ||
                        form.style.display === ''
                ) {
                        form.style.display = 'block'
                } else {
                        form.style.display = 'none'
                }
        })

        form.addEventListener('submit', async function (e) {
                e.preventDefault()
                const gameName = game.value
                const gameUrl = url.value
                const body = { game: gameName, url: gameUrl }
                addGame(body)
                form.reset()
                form.style.display = 'none'
                game.value = ''
                url.value = ''
        })
})

// Hàm để xóa trò chơi
const deleteGame = async (id) => {
        try {
                const response = await fetch(`${apiUrl}/delete/${id}`, {
                        method: 'DELETE',
                })
                if (response.ok) {
                        alert('Game deleted successfully')
                        document.getElementById('game-list-btn').click() // Cập nhật danh sách sau khi xóa
                } else {
                        console.error('Failed to delete game')
                        alert('Failed to delete game')
                }
        } catch (error) {
                console.error('Error:', error)
                alert('Error deleting game')
        }
        location.reload()
}

const addGame = async (body) => {
        try {
                const response = await fetch(`${apiUrl}/create`, {
                        method: 'POST',
                        headers: {
                                'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(body),
                })
                if (response.ok) {
                        alert('Game added successfully')
                        document.getElementById('game-list-btn').click() // Cập nhật danh sách sau khi thêm
                } else {
                        console.error('Failed to add game')
                        alert('Failed to add game')
                }
        } catch (error) {
                console.error('Error:', error)
                alert('Error adding game')
        }
        location.reload()
}
