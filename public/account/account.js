const apiUrl = `${window.location.origin}/api/accounts`
const updateAccount = async (id, body) => {
        try {
                const response = await fetch(`${apiUrl}/${id}`, {
                        method: 'PUT',
                        headers: {
                                'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(body),
                })
                if (response.ok) {
                        const updatedAccount = await response.json()
                        console.log(updatedAccount)
                        alert('Account updated successfully')
                } else {
                        console.error('Cannot update account')
                        alert('Account updated successfully')
                }
        } catch (err) {
                console.error('Error:', err)
        }
        location.reload()
}
const deleteAccount = async (id) => {
        try {
                const response = await fetch(`${apiUrl}/${id}`, {
                        method: 'DELETE',
                })
                if (response.ok) {
                        console.log('Account deleted successfully')
                        alert('Account deleted successfully')
                } else {
                        console.error('Cannot delete account')
                        alert('Cannot delete account')
                }
        } catch (err) {
                console.error('Error:', err)
        }

        location.reload()
}
document.addEventListener('DOMContentLoaded', function () {
        const button = document.getElementById('account-list-btn')
        const table = document.getElementById('account-list-table')
        const thead = table.querySelector('thead')
        const tbody = table.querySelector('tbody')
        const loader = document.getElementById('loader-container')
        loader.style.display = 'flex'
        setTimeout(() => {
                loader.style.display = 'none'
        }, 1000)
        button.addEventListener('click', async () => {
                loader.style.display = 'flex'
                try {
                        const response = await fetch(apiUrl)
                        const data = await response.json()
                        console.log(data)
                        if (!data.length) {
                                alert('No accounts found')
                                return
                        }
                        // Xóa tất cả các hàng cũ trong tbody
                        tbody.innerHTML = ''

                        // Xóa tất cả các tiêu đề cũ trong thead
                        thead.innerHTML = '<tr id="table-header"></tr>'
                        const tableHeaderRow =
                                thead.querySelector('#table-header')

                        // Lấy danh sách tất cả các khóa từ đối tượng đầu tiên, trừ khóa đầu và cuối
                        const headers = Object.keys(data[0]).slice(1, -1)

                        // Tạo và thêm các tiêu đề cột, trừ cột đầu và cuối
                        headers.map((header) => {
                                const th = document.createElement('th')
                                th.textContent = header
                                tableHeaderRow.appendChild(th)
                        })

                        // Thêm tiêu đề cột cho nút hành động
                        const actionTh = document.createElement('th')
                        actionTh.textContent = 'Actions'
                        tableHeaderRow.appendChild(actionTh)

                        // Tạo các hàng dữ liệu
                        data.map((account) => {
                                const row = document.createElement('tr')
                                headers.map((header) => {
                                        const td = document.createElement('td')
                                        td.classList.add(header)
                                        td.textContent = account[header]
                                        row.appendChild(td)
                                })

                                // Thêm cột cho nút hành động
                                const actionTd = document.createElement('td')

                                const updateButton =
                                        document.createElement('button')
                                updateButton.textContent = 'Update'
                                updateButton.classList.add('btn', 'btn-update') // Thêm lớp CSS cho nút Update
                                updateButton.onclick = () => {
                                        // Xử lý cập nhật ở đây
                                        console.log(`Update ${account._id}`)
                                        alert(
                                                'Hiện không thể update account\n Vui lòng xóa account và thêm lại account',
                                        )
                                }

                                const deleteButton =
                                        document.createElement('button')
                                deleteButton.textContent = 'Delete'
                                deleteButton.classList.add('btn', 'btn-delete') // Thêm lớp CSS cho nút Delete
                                deleteButton.onclick = () => {
                                        // Xử lý xóa ở đây
                                        console.log(`Delete ${account._id}`)
                                        deleteAccount(account._id)
                                }

                                actionTd.appendChild(updateButton)
                                actionTd.appendChild(deleteButton)

                                row.appendChild(actionTd)

                                tbody.appendChild(row)
                        })
                } catch (e) {
                        console.error(e)
                        alert('Có lỗi xảy ra')
                }
                setTimeout(() => {
                        loader.style.display = 'none'
                }, 1000)
        })
})
