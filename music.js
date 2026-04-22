const recommendedTitle = document.getElementById("recommendedTitle");
const recommendedText = document.getElementById("recommendedText");
const heartGuideText = document.getElementById("heartGuideText");
const categoryTabs = document.getElementById("categoryTabs");
const nowPlayingTitle = document.getElementById("nowPlayingTitle");
const nowPlayingMeta = document.getElementById("nowPlayingMeta");
const trackSectionTitle = document.getElementById("trackSectionTitle");
const trackCountText = document.getElementById("trackCountText");
const trackList = document.getElementById("trackList");
const playPauseBtn = document.getElementById("playPauseBtn");
const playPauseIcon = document.getElementById("playPauseIcon");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const musicPlayer = document.getElementById("musicPlayer");

const urlParams = new URLSearchParams(window.location.search);
const initialHeartRate = Number(urlParams.get("hr")) || 98;

let currentHeartRate = initialHeartRate;
let currentCategory = getHeartRateCategory(currentHeartRate);
let currentTrackId = "";
let currentTrackIndex = -1;

const musicLibrary = {
    recovery: [
        { id: "recovery-1", title: "Beneath the Mask", artist: "Atlas Sound Team", file: "audio/Beneath_the_Mask.mp3" },
        { id: "recovery-2", title: "Kiss Me", artist: "Nai Br.XX/Celeina Ann", file: "audio/Kiss_Me.ogg" },
        { id: "recovery-3", title: "Slow Breeze", artist: "Recovery Set", file: "audio/recovery-3.mp3" },
        { id: "recovery-4", title: "Warm Cooldown", artist: "Recovery Set", file: "audio/recovery-4.mp3" }
    ],
    easy: [
        { id: "easy-1", title: "IROHA's Dancing All Night", artist: "Conisch", file: "audio/IROHA's_Dancing_All_Night.ogg" },
        { id: "easy-2", title: "CHEERS", artist: "Mrs. GREEN APPLE", file: "audio/CHEERS.ogg" },
        { id: "easy-3", title: "Blue Track", artist: "Easy Flow", file: "audio/easy-3.mp3" },
        { id: "easy-4", title: "Fresh Pulse", artist: "Easy Flow", file: "audio/easy-4.mp3" }
    ],
    tempo: [
        { id: "tempo-1", title: "Distortion‼", artist: "Kessoku Band", file: "audio/Distortion‼.ogg" },
        { id: "tempo-2", title: "ADAMAS", artist: "LiSA", file: "audio/ADAMAS.ogg" }, 
        { id: "tempo-3", title: "Inferno", artist: "Hiroyuki Sawano/mpi/Benjamin", file: "audio/Inferno.ogg" },       
        { id: "tempo-4", title: "Samurai 45", artist: "MIYAVI", file: "audio/Samurai_45.ogg" }
    ],
    sprint: [
        { id: "sprint-1", title: "MEGALOVANIA", artist: "Toby Fox", file: "audio/MEGALOVANIA.ogg" },
        { id: "sprint-2", title: "Re:make", artist: "ONE OK ROCK", file: "audio/Re_make.mp3" },      
        { id: "sprint-3", title: "Peak Heat", artist: "Sprint Mode", file: "audio/sprint-3.mp3" },
        { id: "sprint-4", title: "Last Meter", artist: "Sprint Mode", file: "audio/sprint-4.mp3" }
    ]
};

initMusicPage();

function initMusicPage() {
    renderRecommendation();
    renderTabs();
    renderTrackList();
    bindEvents();
}

function bindEvents() {
    if (categoryTabs) {
        categoryTabs.addEventListener("click", function (event) {
            const tab = event.target.closest(".category-tab");
            if (!tab) {
                return;
            }

            currentCategory = tab.dataset.category;
            renderRecommendation();
            renderTabs();
            renderTrackList();
        });
    }

    if (playPauseBtn) {
        playPauseBtn.addEventListener("click", function () {
            if (!currentTrackId) {
                const tracks = musicLibrary[currentCategory] || [];
                if (tracks.length) {
                    playTrack(tracks[0], 0);
                }
                return;
            }

            if (musicPlayer.paused) {
                musicPlayer.play().catch(function () {
                    console.log("Audio file is not ready yet.");
                });
            } else {
                musicPlayer.pause();
            }

            updatePlayPauseButton();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", playPreviousTrack);
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", playNextTrack);
    }

    if (musicPlayer) {
        musicPlayer.addEventListener("play", updatePlayPauseButton);
        musicPlayer.addEventListener("pause", updatePlayPauseButton);
        musicPlayer.addEventListener("ended", playNextTrack);
    }
}

function getHeartRateCategory(heartRate) {
    if (heartRate <= 105) {
        return "recovery";
    }

    if (heartRate <= 125) {
        return "easy";
    }

    if (heartRate <= 150) {
        return "tempo";
    }

    return "sprint";
}

function getCategoryLabel(category) {
    if (category === "recovery") return "Recovery";
    if (category === "easy") return "Easy Flow";
    if (category === "tempo") return "Tempo Push";
    return "Sprint Mode";
}

function getCategoryDescription(category) {
    if (category === "recovery") {
        return "Lower heart rate zone. Softer and steadier tracks fit recovery or cooldown runs.";
    }

    if (category === "easy") {
        return "Comfortable aerobic pace. Light rhythm helps you keep a natural flow.";
    }

    if (category === "tempo") {
        return "Moderate to high effort. Stronger beat helps maintain pace and focus.";
    }

    return "High heart rate zone. More urgent tracks match your final push or sprint effort.";
}

function renderRecommendation() {
    const label = getCategoryLabel(currentCategory);

    if (recommendedTitle) {
        recommendedTitle.textContent = label;
    }

    if (recommendedText) {
        recommendedText.textContent = getCategoryDescription(currentCategory);
    }

    if (heartGuideText) {
        heartGuideText.textContent = "Current heart rate: " + currentHeartRate + " bpm · Recommended: " + label;
    }

    if (trackSectionTitle) {
        trackSectionTitle.textContent = label + " Playlist";
    }

    const tracks = musicLibrary[currentCategory] || [];
    if (trackCountText) {
        trackCountText.textContent = tracks.length + " tracks";
    }
}

function renderTabs() {
    const tabs = document.querySelectorAll(".category-tab");
    tabs.forEach(function (tab) {
        tab.classList.toggle("active", tab.dataset.category === currentCategory);
    });
}

function renderTrackList() {
    const tracks = musicLibrary[currentCategory] || [];

    trackList.innerHTML = tracks.map(function (track, index) {
        const isActive = track.id === currentTrackId;

        return `
            <article class="track-item ${isActive ? "is-active" : ""}">
                <div class="track-index">${String(index + 1).padStart(2, "0")}</div>

                <div class="track-main">
                    <strong>${track.title}</strong>
                    <p>${track.artist}</p>
                </div>

                <button class="track-action" type="button" data-track-id="${track.id}" data-track-index="${index}">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M8 6.5V17.5L17 12L8 6.5Z"></path>
                    </svg>
                </button>
            </article>
        `;
    }).join("");

    const buttons = trackList.querySelectorAll(".track-action");
    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            const trackId = button.dataset.trackId;
            const trackIndex = Number(button.dataset.trackIndex);
            const selectedTrack = tracks.find(function (track) {
                return track.id === trackId;
            });

            if (selectedTrack) {
                playTrack(selectedTrack, trackIndex);
            }
        });
    });
}

function playTrack(track, index) {
    currentTrackId = track.id;
    currentTrackIndex = index;

    musicPlayer.src = track.file;
    musicPlayer.play().catch(function () {
        console.log("Audio file is not ready yet.");
    });

    if (nowPlayingTitle) {
        nowPlayingTitle.textContent = track.title;
    }

    if (nowPlayingMeta) {
        nowPlayingMeta.textContent = track.artist + " · " + getCategoryLabel(currentCategory);
    }

    renderTrackList();
    updatePlayPauseButton();
}

function playPreviousTrack() {
    const tracks = musicLibrary[currentCategory] || [];
    if (!tracks.length) {
        return;
    }

    if (currentTrackIndex === -1) {
        playTrack(tracks[0], 0);
        return;
    }

    const nextIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrack(tracks[nextIndex], nextIndex);
}

function playNextTrack() {
    const tracks = musicLibrary[currentCategory] || [];
    if (!tracks.length) {
        return;
    }

    if (currentTrackIndex === -1) {
        playTrack(tracks[0], 0);
        return;
    }

    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    playTrack(tracks[nextIndex], nextIndex);
}

function updatePlayPauseButton() {
    if (!playPauseIcon) {
        return;
    }

    if (!currentTrackId || musicPlayer.paused) {
        playPauseIcon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 6.5V17.5L17 12L8 6.5Z"/>
            </svg>
        `;
    } else {
        playPauseIcon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 6V18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
                <path d="M15 6V18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
            </svg>
        `;
    }
}