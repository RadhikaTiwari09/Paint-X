const bgUpload = document.getElementById('bgUpload');
let bgImage = null;

bgUpload.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            bgImage = img;
            drawBackground();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (bgImage) {
        const scale = Math.min(canvas.width / bgImage.width, canvas.height / bgImage.height);
        const x = (canvas.width / 2) - (bgImage.width / 2) * scale;
        const y = (canvas.height / 2) - (bgImage.height / 2) * scale;
        ctx.drawImage(bgImage, x, y, bgImage.width * scale, bgImage.height * scale);
    }
}

/* ----------------------------------------------------------------------- */
const shareBtn = document.getElementById('shareBtn');

shareBtn.addEventListener('click', async () => {
    if (navigator.canShare && navigator.canShare({ files: [] })) {
        canvas.toBlob(async (blob) => {
            const file = new File([blob], 'drawing.png', { type: 'image/png' });

            try {
                await navigator.share({
                    files: [file],
                    title: 'My PaintX art',
                    text: 'Check out my PaintX art',
                });
                console.log('Shared successfully');
            } catch (err) {
                console.error('Share failed:', err);
            }
        });
    } else {
        alert('Sharing not supported on this browser. Please save the image and share manually.');
    }
});

/* ----------------------------------------------------------------------- */