/*
 * Note: This is the vanilla JS version of this function for the popout window.
 *    The CameraStream component "download" button uses a seperate function, defined in 
 *    the CameraStream.jsx file. If you make changes to this function, you need to 
 *    make corresponding changes to the CameraStream.jsx file.
 */
function download(title, width, height) {
    let canvas = document.getElementById("ext-vid");

    let time = new Date();
    let timezoneOffset = time.getTimezoneOffset() * 60000;
    let timeString = new Date(time - timezoneOffset).toISOString().replace(":", "_").substring(0, 19);

    let link = document.createElement("a");

    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;

    let tempContext = tempCanvas.getContext('2d');
    tempContext.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

    link.href = tempCanvas.toDataURL("image/jpeg", 1);
    link.download = `${title}-${timeString}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}