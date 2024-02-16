function download(title, width, height) {
    let canvas = document.getElementById("ext-vid");

    let time = new Date();
    let timezoneOffset = time.getTimezoneOffset() * 60000;
    let timeString = new Date(time - timezoneOffset).toISOString().replace(":", "_").substring(0, 19);

    let link = document.createElement("a");

    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = title // video.videoWidth;
    tempCanvas.height = width // video.videoHeight;

    let tempContext = tempCanvas.getContext('2d');
    tempContext.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

    link.href = tempCanvas.toDataURL("image/jpeg", 1);
    link.download = `${height}-${timeString}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}