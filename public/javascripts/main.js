document.getElementById('add-space').addEventListener('click', async () => {
  const name = document.getElementById('new-space').value;
  if (name) {
    const response = await fetch('/profile/add-space', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    const data = await response.json();
    if (data.success) {
      const ul = document.getElementById('spaces-list');
      const li = document.createElement('li');
      li.innerHTML = `${name} <button class="delete-space" data-id="${data.space._id}">Delete</button>`;
      ul.appendChild(li);
      document.getElementById('new-space').value = '';
      // Bind delete event to the new button
      bindDeleteEvent(li.querySelector('.delete-space'));
    } else {
      alert(data.message);
    }
  }
});

function bindDeleteEvent(button) {
  button.addEventListener('click', async (event) => {
    const spaceId = event.target.dataset.id;
    try {
      const response = await fetch(`/profile/spaces/${spaceId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert('空間已成功刪除');
        location.reload();
      } else {
        alert('空間刪除失敗');
      }
    } catch (error) {
      alert('刪除空間時發生錯誤');
    }
  });
}

// Initial binding
document.querySelectorAll('.delete-space').forEach(button => {
  bindDeleteEvent(button);
});

document.getElementById('time-range-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;
  const password = prompt('Enter your password to confirm changes:');
  if (password) {
    const response = await fetch('/profile/update-time-range', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ startTime, endTime, password })
    });
    const data = await response.json();
    if (data.success) {
      alert('Time range updated successfully.');
    } else {
      alert(data.message);
    }
  }
});
