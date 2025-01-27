const myVideo = document.querySelector("#myVideo");
const videos = document.querySelectorAll("aside button");
const playPauseBtn = document.querySelector("#playPauseBtn");
const previousBtn = document.querySelector("#previousBtn");
const nextBtn = document.querySelector("#nextBtn");
const soundBtn = document.querySelector("#soundBtn");
const volumeBar = document.querySelector("#volumeBar");
const fullScreenBtn = document.querySelector("#fullScreenBtn");
const videoControls = document.querySelector(".videoControls");
// const tracks = document.querySelectorAll("track");
const subtitleDiv = document.querySelector(".videoSubtitles");

const videoLinks = [
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
];

videos.forEach((video, index) => {
  video.addEventListener("click", () => {
    myVideo.src = videoLinks[index % videoLinks.length];
    myVideo.play();
    videos.forEach((video) => video.classList.remove("selected"));
    video.classList.add("selected");
  });
});

myVideo.parentElement.addEventListener("click", handlePlayPause);
playPauseBtn.addEventListener("click", handlePlayPause);
nextBtn.addEventListener("click", handleNextVideo);
previousBtn.addEventListener("click", handlePreviousVideo);
soundBtn.addEventListener("click", handleMute);
fullScreenBtn.addEventListener("click", handleFullScreenChange);
myVideo.addEventListener("dblclick", handleFullScreenChange);
volumeBar.addEventListener("input", handleVolumeChange);

videoControls.addEventListener("click", (e) => {
  e.stopPropagation();
});
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowDown":
      handleNextVideo();
      break;
    case "ArrowUp":
      handlePreviousVideo();
      break;
    case " ":
      handlePlayPause();
      break;
    case "ArrowRight":
      myVideo.currentTime += 5;
      break;
    case "ArrowLeft":
      myVideo.currentTime -= 5;
      break;
    case "f":
      handleFullScreenChange();
      break;
    case "m":
      handleMute();
  }
});

function handleVolumeChange() {
  myVideo.volume = +volumeBar.value;
  if (myVideo.volume) {
    soundBtn.children[0].src = "./images/icons/sound.svg";
  } else {
    soundBtn.children[0].src = "./images/icons/muted.svg";
  }
}
function handlePlayPause() {
  if (myVideo.paused) {
    myVideo.play();
    playPauseBtn.children[0].src = "./images/icons/pause.svg";
  } else {
    myVideo.pause();
    playPauseBtn.children[0].src = "./images/icons/play.svg";
  }
}
function handleMute() {
  if (myVideo.volume) {
    myVideo.volume = 0;
    volumeBar.value = 0;
    soundBtn.children[0].src = "./images/icons/muted.svg";
  } else {
    volumeBar.value = 1;
    myVideo.volume = 1;
    soundBtn.children[0].src = "./images/icons/sound.svg";
  }
}
function handleFullScreenChange() {
  if (document.fullscreenElement) {
    fullScreenBtn.children[0].src = "./images/icons/enterFullScreen.svg";
    document.exitFullscreen();
  } else {
    fullScreenBtn.children[0].src = "./images/icons/exitFullScreen.svg";
    myVideo.parentElement.requestFullscreen();
  }
}
function handleNextVideo() {
  previousBtn.style.display = "block";
  playPauseBtn.children[0].src = "./images/icons/pause.svg";
  if (!videos[videos.length - 1].classList.contains("selected")) {
    videos[
      Array.from(videos).findIndex((video) =>
        video.classList.contains("selected")
      ) + 1
    ].click();
  }
  if (videos[videos.length - 1].classList.contains("selected"))
    nextBtn.style.display = "none";
}
function handlePreviousVideo() {
  playPauseBtn.children[0].src = "./images/icons/pause.svg";
  if (!videos[0].classList.contains("selected")) {
    videos[
      Array.from(videos).findIndex((video) =>
        video.classList.contains("selected")
      ) - 1
    ].click();
  }
  if (videos[0].classList.contains("selected"))
    previousBtn.style.display = "none";
}

const track = myVideo.textTracks[0];
track.addEventListener("cuechange", () => {
  const activeCue = track.activeCues[0];
  if (activeCue) {
    subtitleDiv.textContent = activeCue.text;
  } else {
    subtitleDiv.textContent = "";
  }
});
