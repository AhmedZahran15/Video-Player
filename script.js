import videos from "./VideoDatabase.js";

const myVideo = document.querySelector("#myVideo");
const playPauseBtn = document.querySelector("#playPauseBtn");
const previousBtn = document.querySelector("#previousBtn");
const nextBtn = document.querySelector("#nextBtn");
const soundBtn = document.querySelector("#soundBtn");
const volumeBar = document.querySelector("#volumeBar");
const fullScreenBtn = document.querySelector("#fullScreenBtn");
const videoControls = document.querySelector(".videoControls");
const videoTitle = document.querySelector("#videoTitle");
const subtitleDiv = document.querySelector(".videoSubtitles");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#currentTime");
const progress = document.querySelector(".progress");
const progressBar = document.querySelector(".progressBar");
const videosButtons = renderVideos(videos);

myVideo.parentElement.addEventListener("click", handlePlayPause);
playPauseBtn.addEventListener("click", handlePlayPause);
nextBtn.addEventListener("click", handleNextVideo);
previousBtn.addEventListener("click", handlePreviousVideo);
soundBtn.addEventListener("click", handleMute);
fullScreenBtn.addEventListener("click", handleFullScreen);
myVideo.addEventListener("dblclick", handleFullScreen);
volumeBar.addEventListener("input", handleVolumeChange);
myVideo.addEventListener("ended", handleNextVideo);
myVideo.addEventListener("timeupdate", updateTime);
progress.addEventListener("click", handleProgressClick);

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
      handleFullScreen();
      break;
    case "m":
      handleMute();
      break;
  }
});

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    fullScreenBtn.children[0].src = "./images/icons/enterFullScreen.svg";
  } else {
    fullScreenBtn.children[0].src = "./images/icons/exitFullScreen.svg";
  }
});

myVideo.parentElement.addEventListener("mousemove", () => {
  if (!myVideo.paused) {
    videoControls.style.opacity = 1;
    videoTitle.style.opacity = 1;
  }
  setTimeout(() => {
    if (myVideo.paused) return;
    videoControls.style.opacity = 0;
    videoTitle.style.opacity = 0;
  }, 3000);
});

function renderVideos(videos) {
  videos.forEach((video, index) => {
    const button = document.createElement("button");
    button.textContent = `Video ${index + 1}`;
    document.querySelector(".videos").appendChild(button);
  });
  const buttons = document.querySelectorAll(".videos button");
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      myVideo.src = videos[index].sources[0];
      myVideo.poster = videos[index].thumb;
      videoTitle.textContent = videos[index].title;
      buttons.forEach((video) => video.classList.remove("selected"));
      button.classList.add("selected");
      playPauseBtn.children[0].src = "./images/icons/play.svg";
      videoControls.style.opacity = 1;
      videoTitle.style.opacity = 1;
    });
  });
  buttons[0].click();
  return buttons;
}
function updateTime() {
  currentTime.textContent = formatTime(myVideo.currentTime);
  duration.textContent = formatTime(myVideo.duration);
  progressBar.style.width = `${
    (myVideo.currentTime / myVideo.duration) * 100
  }%`;
}

function handleProgressClick(e) {
  const rect = progress.getBoundingClientRect();
  const pos = (e.clientX - rect.left) / progress.offsetWidth;
  myVideo.currentTime = pos * myVideo.duration;
}
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
function handleFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    myVideo.parentElement.requestFullscreen();
  }
}
function handleNextVideo() {
  previousBtn.style.display = "block";
  if (!videosButtons[videosButtons.length - 1].classList.contains("selected")) {
    videosButtons[
      Array.from(videosButtons).findIndex((video) =>
        video.classList.contains("selected")
      ) + 1
    ].click();
  }
  if (videosButtons[videosButtons.length - 1].classList.contains("selected"))
    nextBtn.style.display = "none";
}
function handlePreviousVideo() {
  nextBtn.style.display = "block";
  if (!videosButtons[0].classList.contains("selected")) {
    videosButtons[
      Array.from(videosButtons).findIndex((video) =>
        video.classList.contains("selected")
      ) - 1
    ].click();
  }
  if (videosButtons[0].classList.contains("selected"))
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

function formatTime(time) {
  if (!isNaN(time)) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours > 9 ? hours.toString().padStart(2, "0") + ":" : ""}${
      minutes > 9 ? minutes.toString().padStart(2, "0") : minutes
    }:${seconds.toString().padStart(2, "0")}`;
  } else {
    return "00:00";
  }
}
