// 獲取空間和時間段數據
async function fetchData() {
    const spacesResponse = await fetch('/api/spaces');
    const spaces = await spacesResponse.json();
    const timeSlotsResponse = await fetch('/api/timeslots');
    const timeSlots = await timeSlotsResponse.json();
    return { spaces, timeSlots };
}

// 創建預約表格
function createBookingTable(spaces, timeSlots) {
    const table = document.createElement('table');
    // 創建表頭
    const headerRow = table.insertRow();
    headerRow.insertCell().textContent = '時間 / 空間';
    spaces.forEach(space => {
        headerRow.insertCell().textContent = space.name;
    });
    
    // 創建表格內容
    timeSlots.forEach(timeSlot => {
        const row = table.insertRow();
        row.insertCell().textContent = `${timeSlot.start} - ${timeSlot.end}`;
        spaces.forEach(space => {
            const cell = row.insertCell();
            cell.classList.add('booking-cell');
            cell.dataset.spaceId = space._id;
            cell.dataset.timeSlotId = timeSlot._id;
            cell.addEventListener('click', openBookingForm);
        });
    });
    
    document.getElementById('booking-table').appendChild(table);
}

// 打開預約表單
function openBookingForm(event) {
    const cell = event.target;
    const form = document.getElementById('booking-form');
    form.style.display = 'block';
    form.dataset.spaceId = cell.dataset.spaceId;
    form.dataset.timeSlotId = cell.dataset.timeSlotId;
}

// 提交預約
async function submitBooking(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const bookingData = {
        space: form.dataset.spaceId,
        timeSlot: form.dataset.timeSlotId,
        date: new Date(),
        name: formData.get('name'),
        email: formData.get('email'),
        purpose: formData.get('purpose')
    };
    
    const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
    });
    
    if (response.ok) {
        alert('預約成功！');
        form.reset();
        document.getElementById('booking-form').style.display = 'none';
    } else {
        alert('預約失敗，請稍後再試。');
    }
}

// 初始化
async function init() {
    const { spaces, timeSlots } = await fetchData();
    createBookingTable(spaces, timeSlots);
    document.getElementById('booking-form-fields').addEventListener('submit', submitBooking);
}

init();