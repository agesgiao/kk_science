document.addEventListener("DOMContentLoaded", () => {
  const voiceMap = {};
  for (let i = 1; i <= 8; i++) {
    voiceMap[`voice${i}`] = document.getElementById(`voice${i}`);
  }

  const videoMap = {
    kk1: document.getElementById("kk1"),
    kk2: document.getElementById("kk2"),
    kk3: document.getElementById("kk3"),
    kk4: document.getElementById("kk4"),
    kk5: document.getElementById("kk5"),
    kk6: document.getElementById("kk6"),
    kk7: document.getElementById("kk7"),
    kk61: document.getElementById("kk61"),
    kk62: document.getElementById("kk62")
  };

  const audioMap = {
    kk1: document.getElementById("kk1-audio"),
    kk2: document.getElementById("kk2-audio"),
    kk3: document.getElementById("kk3-audio"),
    kk4: document.getElementById("kk4-audio"),
    kk5: document.getElementById("kk5-audio"),
    kk6: document.getElementById("kk6-audio"),
    kk7: document.getElementById("kk7-audio"),
  };

  const overlaySuccess = document.getElementById("overlay-success");
  const overlayFail = document.getElementById("overlay-fail");
  const overlayVideoSuccess = document.getElementById("overlay-video-success");
  const overlayVideoFail = document.getElementById("overlay-video-fail");
  const countdownEl = document.getElementById("countdown");

  let challengeStarted = false;
  let endingTriggered = false;
  let countdownInterval, timeoutId;

  const voiceQueue = [];
  let currentVoice = null;

  function enqueueVoice(id) {
    if (currentVoice || voiceQueue.includes(id)) return;
    voiceQueue.push(id);
    tryPlayNextVoice();
  }

  function tryPlayNextVoice() {
    if (currentVoice || voiceQueue.length === 0) return;

    const nextId = voiceQueue.shift();
    const next = voiceMap[nextId];
    if (!next) {
      tryPlayNextVoice();
      return;
    }

    currentVoice = next;
    currentVoice.currentTime = 0;
    currentVoice.play();
    currentVoice.onended = () => {
      currentVoice = null;
      tryPlayNextVoice();
    };
  }

  function resetMedia() {
    Object.values(videoMap).forEach(v => {
      v.pause();
      v.currentTime = 0;
    });
    Object.values(audioMap).forEach(a => {
      a.pause();
      a.currentTime = 0;
    });
    Object.values(voiceMap).forEach(v => {
      v.pause();
      v.currentTime = 0;
    });
  }

  function resetOverlay() {
    overlaySuccess.style.display = "none";
    overlayFail.style.display = "none";
    overlayVideoSuccess.pause();
    overlayVideoSuccess.currentTime = 0;
    overlayVideoFail.pause();
    overlayVideoFail.currentTime = 0;
  }

  function resetAll() {
    resetMedia();
    resetOverlay();
    countdownEl.style.display = "none";
    clearTimeout(timeoutId);
    clearInterval(countdownInterval);
    challengeStarted = false;
    endingTriggered = false;
    voiceQueue.length = 0;
    currentVoice = null;
  }

  function startCountdown() {
    if (challengeStarted) return;
    challengeStarted = true;
    let count = 30;
    countdownEl.textContent = count;
    countdownEl.style.display = "block";

    countdownInterval = setInterval(() => {
      count--;
      countdownEl.textContent = count;
      if (count <= 0) {
        clearInterval(countdownInterval);
        countdownEl.style.display = "none";
      }
    }, 1000);

timeoutId = setTimeout(() => {
  if (!endingTriggered) {
    overlayFail.style.display = "flex";
    overlayVideoFail.play();

    setTimeout(() => {
      overlayVideoFail.currentTime = 0;
      audioMap.kk61.currentTime = 0;
      overlayVideoFail.muted = false;
      audioMap.kk61.muted = false;
      overlayVideoFail.play();
      audioMap.kk61.play();
    }, 300);

    challengeStarted = false;
    endingTriggered = true;
  }
}, 30000);

// 成功時
setTimeout(() => {
  overlayVideoSuccess.currentTime = 0;
  audioMap.kk62.currentTime = 0;
  overlayVideoSuccess.muted = false;
  audioMap.kk62.muted = false;
  overlayVideoSuccess.play();
  audioMap.kk62.play();
}, 300);

  overlayVideoSuccess.onended = () => { overlaySuccess.style.display = "none"; };
  overlayVideoFail.onended = () => { overlayFail.style.display = "none"; };

  for (let i = 1; i <= 16; i++) {
    const el = document.getElementById(`target${i}`);
    if (!el) continue;

    el.addEventListener("targetFound", () => {
      if (challengeStarted && i !== 1 && !endingTriggered) return;

      switch (i) {
        case 1:
        if (challengeStarted && !endingTriggered) {
            clearTimeout(timeoutId);
            clearInterval(countdownInterval);
            countdownEl.style.display = "none";
            overlaySuccess.style.display = "flex";
            overlayVideoSuccess.play();

            setTimeout(() => {
              if (videoMap.kk62 && audioMap.kk62) {
                videoMap.kk62.currentTime = 0;
                audioMap.kk62.currentTime = 0;
                videoMap.kk62.muted = false;
                audioMap.kk62.muted = false;
                videoMap.kk62.play();
                audioMap.kk62.play();
              }
            }, 300);

            challengeStarted = false;
            endingTriggered = true;
          } else if (!challengeStarted) {
            enqueueVoice("voice1");
          }
          break;

        case 2:
          videoMap.kk1.play();
          audioMap.kk1.play();
          break;

        case 3:
          videoMap.kk2.play();
          audioMap.kk2.play();
          break;

        case 4:
          enqueueVoice("voice2");
          break;

        case 5:
          videoMap.kk3.play();
          audioMap.kk3.play();
          break;

        case 6:
          videoMap.kk4.play();
          audioMap.kk4.play();
          break;

        case 7:
          enqueueVoice("voice3");
          break;

        case 8:
          videoMap.kk5.play();
          audioMap.kk5.play();
          break;

        case 9:
          enqueueVoice("voice4");
          break;

        case 10:
          enqueueVoice("voice5");
          break;

        case 11:
          videoMap.kk6.play();
          audioMap.kk6.play();
          break;

        case 12:
          enqueueVoice("voice6");
          break;

        case 13:
          videoMap.kk7.play();
          audioMap.kk7.play();
          break;

        case 14:
          enqueueVoice("voice7");
          break;

        case 15:
          enqueueVoice("voice8");
          voiceMap.voice8.onended = () => {
            startCountdown();
          };
          break;

        case 16:
          resetAll();
          break;
      }
    });
  }

  resetAll();
});
