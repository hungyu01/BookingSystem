document.querySelectorAll('.reservation-slot').forEach(slot => {
  slot.addEventListener('click', (event) => {
    const space = event.target.dataset.space;
    const time = event.target.dataset.time;

    // 打開一個新的表單，讓用戶選擇新的年月日、開始時間和結束時間
    Swal.fire({
      title: '預約空間',
      html: `
        <input type="date" id="reservation-date" class="swal2-input" value="${new Date().toISOString().split('T')[0]}">
        <input type="time" id="start-time" class="swal2-input" value="${time}">
        <input type="time" id="end-time" class="swal2-input" value="${time}">
        <input type="text" id="reservation-name" class="swal2-input" placeholder="Name">
        <input type="text" id="reservation-purpose" class="swal2-input" placeholder="Purpose">
        <input type="email" id="reservation-email" class="swal2-input" placeholder="Email">
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          date: document.getElementById('reservation-date').value,
          startTime: document.getElementById('start-time').value,
          endTime: document.getElementById('end-time').value,
          name: document.getElementById('reservation-name').value,
          purpose: document.getElementById('reservation-purpose').value,
          email: document.getElementById('reservation-email').value
        };
      }
    }).then(result => {
      if (result.isConfirmed) {
        const reservation = result.value;

        // 發送請求到伺服器保存預約
        fetch('/reserve', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ date, space, startTime, endTime, username, purpose, email })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); // 確保響應是 JSON 格式
        })
        .then(data => {
          console.log(data);
          if (data.success) {
            Swal.fire('Success', data.message, 'success');
          } else {
            Swal.fire('Failed', data.message, 'error');
          }
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
          Swal.fire('Error', 'Unexpected error occurred', 'error');
        });        
      }
    });
  });
});
