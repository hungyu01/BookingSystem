    // Sweet Alert for reservation details
    document.querySelectorAll('.reservation-slot').forEach(slot => {
        slot.addEventListener('click', () => {
          Swal.fire({
            title: 'Reserve this slot',
            html: `
              <input type="text" id="name" class="swal2-input" placeholder="Name">
              <input type="text" id="phone" class="swal2-input" placeholder="Phone">
              <input type="email" id="email" class="swal2-input" placeholder="Email">
              <input type="text" id="purpose" class="swal2-input" placeholder="Purpose">
            `,
            confirmButtonText: 'Submit',
            preConfirm: () => {
              const name = Swal.getPopup().querySelector('#name').value;
              const phone = Swal.getPopup().querySelector('#phone').value;
              const email = Swal.getPopup().querySelector('#email').value;
              const purpose = Swal.getPopup().querySelector('#purpose').value;
              return { name, phone, email, purpose };
            }
          }).then(result => {
            if (result.isConfirmed) {
              // Send the reservation data to the server
              // You need to handle the AJAX request here
            }
          });
        });
      });