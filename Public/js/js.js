
    const fileInput = document.querySelector('input[type="file"]');
    const alertBox = document.getElementById('imageAlert');

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            alertBox.classList.remove('d-none'); // Uyarıyı göster
        }
    });

