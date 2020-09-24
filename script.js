
// first: get the video element form HTML page
const video = document.getElementById('video');

// 2: promise.all isna constractor excute the all the command inside ti
// we including the face api models; promise work is acysc after uploaded  the models. then startVideo;
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo)

// 3: starting  stream the video was incloded form html  page;(callback function)
function startVideo(){
    navigator.mediaDevices.getUserMedia(
        {
            audio: false,
            video:true
        }).then(stream => {
            video.srcObject = stream;
        }).catch(console.error)
}
//4: event listener when paly the video was included from html, do somthing;
video.addEventListener('play', ()=> {

    // here thers somthing call canvas, what  is that
    const canvas  = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas);

    const displaySize  =  {
        width: video.width,
        height: video.height
    }
    faceapi.matchDimensions(canvas, displaySize)

    setInterval(async ()=>{
        const detection = await faceapi.detectAllFaces(video,
        new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
        .withFaceExpressions()
        
        const resizedDetections = faceapi.resizeResults(detection, displaySize)
        canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas,resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas,resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas,resizedDetections)

    },100)
})

const test  = setInterval(()=>console.log("hello"), 500)