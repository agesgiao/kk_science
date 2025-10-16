document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded");

  // ====== ターゲットと対応する動画・音声のマッピング ======
  const videoMap = {
    2: "kk1",
    3: "kk2",
    5: "kk3",
    6: "kk4",
    8: "kk5",
    11: "kk6",
    13: "kk7",
  };

  const audioMap = {
    2: "kk1-audio",
    3: "kk2-audio",
    5: "kk3-audio",
    6: "kk4-audio",
    8: "kk5-audio",
    11: "kk6-audio",
    13: "kk7-audio",
  };

  // ====== 成功・失敗時の映像と音声 ======
  const overlaySuccess = document.getElementById("overlay-success");
  const overlayFail = document.getElementById("overlay-fail");
  const videoSuccess = document.getElementById("overlay-video-success");
  const videoFail = document.getElementById("overlay-video-fail");

  const audioSuccess = document.getElementById("kk62-audio");
  const audioFail = document.getElementById("kk61-audio");

  const countdownElement = document.getElementById("countdown");

  // ====== カウントダウン表示関数 ======
  function startCountdown(seconds, callback) {
    let remaining = seconds;
    countdownElement.style.display = "block";
    countdownElement.textContent = remaining;
    const timer = setInterval(() => {
      remaining--;
      countdownElement.textContent = remaining;
      if (remaining <= 0) {
        clearInterval(timer);
        countdownElement.style.display = "none";
        callback();
      }
    }, 1000);
  }

  // ====== MindARターゲット制御 ======
  for (let i = 1; i <= 16; i++) {
    const target = document.getElementById(`target${i}`);
    if (!target) continue;

    target.addEventListener("targetFound", () => {
      console.log(`Target ${i} found`);

      // 該当ターゲットの動画と音声を取得
      const videoId = videoMap[i];
      const audioId = audioMap[i];

      if (videoId) {
        const video = document.getElementById(videoId);
        if (video) {
          video.currentTime = 0;
          video.play().catch((e) => console.warn("Video play error:", e));
        }
      }

      if (audioId) {
        const audio = document.getElementById(audioId);
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch((e) => console.warn("Audio play error:", e));
        }
      }

      // ====== 例：成功 or 失敗アニメーションを確認 ======
      if (i === 11) { // target11 が成功例と仮定
        startCountdown(3, () => {
          playOverlay(true);
        });
      } else if (i === 8) { // target8 が失敗例と仮定
        startCountdown(3, () => {
          playOverlay(false);
        });
      }
    });

    target.addEventListener("targetLost", () => {
      console.log(`Target ${i} lost`);
      const videoId = videoMap[i];
      const audioId = audioMap[i];

      if (videoId) {
        const video = document.getElementById(videoId);
        if (video) {
          video.pause();
        }
      }

      if (audioId) {
        const audio = document.getElementById(audioId);
        if (audio) {
          audio.pause();
        }
      }
    });
  }

  // ====== 成功・失敗のオーバーレイを表示 ======
  function playOverlay(isSuccess) {
    const overlay = isSuccess ? overlaySuccess : overlayFail;
    const video = isSuccess ? videoSuccess : videoFail;
    const audio = isSuccess ? audioSuccess : audioFail;

    overlay.style.display = "flex";
    video.currentTime = 0;
    video.muted = false;
    video.play().catch((e) => console.warn("Overlay video play error:", e));

    // ✅ kk61 / kk62 音声を確実に再生する処理
    if (audio) {
      audio.pause();
      audio.currentTime = 0;

      // 一度ユーザー操作（例えばARターゲット検出）後に再生許可される
      const playAudio = () => {
        audio.play().catch((e) => console.warn("Overlay audio play error:", e));
        document.removeEventListener("click", playAudio);
        document.removeEventListener("touchstart", playAudio);
      };

      // モバイル再生制限対策
      if (audio.paused) {
        document.addEventListener("click", playAudio);
        document.addEventListener("touchstart", playAudio);
      } else {
        audio.play().catch((e) => console.warn("Overlay audio play error:", e));
      }
    }

    // 終了後にフェードアウト
    video.onended = () => {
      overlay.style.display = "none";
      if (audio) audio.pause();
    };
  }
});
