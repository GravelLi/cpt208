const searchInput = document.getElementById("searchInput");
const relocateBtn = document.getElementById("relocateBtn");
const runToggleBtn = document.getElementById("runToggleBtn");
const pauseBtn = document.getElementById("pauseBtn");
const finishBtn = document.getElementById("finishBtn");
const musicBtn = document.getElementById("musicBtn");
const sosBtn = document.getElementById("sosBtn");

const routeTitle = document.getElementById("routeTitle");
const routeStatus = document.getElementById("routeStatus");
const routeNote = document.getElementById("routeNote");
const routeMetaText = document.getElementById("routeMetaText");
const panelRouteText = document.getElementById("panelRouteText");
const modePill = document.getElementById("modePill");
const musicStatusText = document.getElementById("musicStatusText");

const heartRateValue = document.getElementById("heartRateValue");
const distanceValue = document.getElementById("distanceValue");
const paceValue = document.getElementById("paceValue");
const runToggleLabel = document.getElementById("runToggleLabel");
const runToggleSub = document.getElementById("runToggleSub");
const runToggleIcon = document.getElementById("runToggleIcon");

let map = null;
let geolocation = null;
let autoComplete = null;
let placeSearch = null;
let walking = null;

let currentPosition = null;
let currentAddress = "定位中...";
let currentMarker = null;
let destinationMarker = null;
let currentRoute = null;
let isRunning = false;
let runTimer = null;
let simulatedDistance = 0;
let simulatedHeartRate = 98;
let simulatedPaceSeconds = 378;
let musicAuto = true;

initMap();

function initMap() {
    map = new AMap.Map("mapContainer", {
        zoom: 15,
        viewMode: "2D",
        resizeEnable: true,
    });

    AMap.plugin(
        ["AMap.Geolocation", "AMap.AutoComplete", "AMap.PlaceSearch", "AMap.Walking", "AMap.Scale"],
        function () {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,
                timeout: 10000,
                position: "RB",
                offset: [10, 20],
                zoomToAccuracy: true
            });

            autoComplete = new AMap.AutoComplete({
                input: "searchInput"
            });

            placeSearch = new AMap.PlaceSearch({
                map: map,
                pageSize: 1,
                autoFitView: false
            });

            walking = new AMap.Walking({
                map: map,
                hideMarkers: true,
                autoFitView: true
            });

            map.addControl(new AMap.Scale());

            getCurrentLocation();
            bindEvents();
        }
    );
}

function bindEvents() {
    relocateBtn.addEventListener("click", getCurrentLocation);

    AMap.event.addListener(autoComplete, "select", function (event) {
        const tip = event.tip;

        if (tip && tip.location) {
            useDestination({
                name: tip.name,
                location: tip.location
            });
            return;
        }

        if (tip && tip.name) {
            searchPlaceByKeyword(tip.name);
        }
    });

    runToggleBtn.addEventListener("click", function () {
        if (isRunning) {
            pauseRun();
        } else {
            startRun();
        }
    });

    pauseBtn.addEventListener("click", pauseRun);
    finishBtn.addEventListener("click", finishRun);

    musicBtn.addEventListener("click", function () {
        musicAuto = !musicAuto;
        musicStatusText.textContent = musicAuto
            ? "Music adapts to heart rate and pace"
            : "Music sync paused";
    });

    sosBtn.addEventListener("click", function () {
        const locationText = currentAddress || "当前位置";
        alert("SOS demo：将向紧急联系人发送当前位置\\n" + locationText);
    });
}

function getCurrentLocation() {
    routeStatus.textContent = "定位中";
    routeTitle.textContent = "正在获取当前位置";
    routeNote.textContent = "定位成功后可直接自由开跑，或输入目的地生成路线。";

    geolocation.getCurrentPosition(function (status, result) {
        if (status === "complete" && result.position) {
            currentPosition = result.position;
            currentAddress = result.formattedAddress || "当前位置";

            if (currentMarker) {
                currentMarker.setMap(null);
            }

            currentMarker = new AMap.Marker({
                position: currentPosition,
                map: map,
                title: "当前位置"
            });

            map.setCenter(currentPosition);
            routeStatus.textContent = "已定位";
            routeTitle.textContent = "当前位置准备完成";
            routeNote.textContent = currentAddress;
            routeMetaText.textContent = "未规划路线";
            panelRouteText.textContent = "自由开跑";
            modePill.textContent = "自由开跑";
        } else {
            routeStatus.textContent = "定位失败";
            routeTitle.textContent = "无法获取位置";
            routeNote.textContent = "请检查浏览器定位权限后重试。";
            alert("当前位置获取失败，请检查浏览器定位权限。");
        }
    });
}

function searchPlaceByKeyword(keyword) {
    placeSearch.search(keyword, function (status, result) {
        if (status !== "complete" || !result.poiList || !result.poiList.pois.length) {
            alert("没有找到该目的地，请换个关键词试试。");
            return;
        }

        const poi = result.poiList.pois[0];

        useDestination({
            name: poi.name,
            location: poi.location
        });
    });
}

function useDestination(destination) {
    if (!currentPosition) {
        alert("请先完成当前位置定位。");
        return;
    }

    routeTitle.textContent = destination.name;
    routeStatus.textContent = "规划中";
    routeNote.textContent = "正在生成从当前位置出发的最佳路线。";
    modePill.textContent = "路线跑";

    if (destinationMarker) {
        destinationMarker.setMap(null);
    }

    destinationMarker = new AMap.Marker({
        position: destination.location,
        map: map,
        title: destination.name
    });

    walking.clear();

    walking.search(currentPosition, destination.location, function (status, result) {
        if (status !== "complete" || !result.routes || !result.routes.length) {
            routeStatus.textContent = "失败";
            routeNote.textContent = "路线生成失败，请重新选择目的地。";
            alert("路线生成失败，请重新选择目的地。");
            return;
        }

        const route = result.routes[0];
        const distanceKm = (route.distance / 1000).toFixed(2);
        const timeMin = Math.ceil(route.time / 60);

        currentRoute = {
            startName: currentAddress,
            destinationName: destination.name,
            distanceKm: distanceKm,
            timeMin: timeMin,
            origin: [currentPosition.lng, currentPosition.lat],
            destination: [destination.location.lng, destination.location.lat]
        };

        routeStatus.textContent = "已生成";
        routeNote.textContent = "预计 " + distanceKm + " km · " + timeMin + " min";
        routeMetaText.textContent = distanceKm + " km · " + timeMin + " min";
        panelRouteText.textContent = "路线跑";
    });
}

function startRun() {
    isRunning = true;
    runToggleBtn.classList.add("running");
    runToggleLabel.textContent = "Running";
    runToggleSub.textContent = currentRoute ? "路线导航进行中" : "自由开跑进行中";
    runToggleIcon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6V18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
            <path d="M15 6V18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        </svg>
    `;
    routeStatus.textContent = "进行中";

    if (runTimer) clearInterval(runTimer);

    runTimer = setInterval(function () {
        simulatedDistance += currentRoute ? 0.04 : 0.03;
        simulatedHeartRate = Math.min(168, simulatedHeartRate + Math.floor(Math.random() * 4 - 1));
        simulatedPaceSeconds = Math.max(320, Math.min(450, simulatedPaceSeconds + Math.floor(Math.random() * 9 - 4)));

        distanceValue.textContent = simulatedDistance.toFixed(2);
        heartRateValue.textContent = String(simulatedHeartRate);
        paceValue.textContent = formatPace(simulatedPaceSeconds);

        if (musicAuto) {
            if (simulatedHeartRate > 150) {
                musicStatusText.textContent = "Music softened for high heart rate";
            } else if (simulatedPaceSeconds < 350) {
                musicStatusText.textContent = "Music boosted with your pace";
            } else {
                musicStatusText.textContent = "Music adapts to heart rate and pace";
            }
        }
    }, 3000);
}

function pauseRun() {
    if (!isRunning) return;

    isRunning = false;
    runToggleBtn.classList.remove("running");
    runToggleLabel.textContent = "Resume Run";
    runToggleSub.textContent = currentRoute ? "路线跑已暂停" : "自由开跑已暂停";
    runToggleIcon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 6.5V17.5L17 12L8 6.5Z"/>
        </svg>
    `;
    routeStatus.textContent = "已暂停";

    if (runTimer) {
        clearInterval(runTimer);
        runTimer = null;
    }
}

function finishRun() {
    pauseRun();
    simulatedDistance = 0;
    simulatedHeartRate = 98;
    simulatedPaceSeconds = 378;

    distanceValue.textContent = "0.00";
    heartRateValue.textContent = "98";
    paceValue.textContent = "--";
    runToggleLabel.textContent = "Tap to Run";
    runToggleSub.textContent = "自由开跑 / 路线跑";
    routeStatus.textContent = currentRoute ? "路线已生成" : "已定位";
    musicStatusText.textContent = musicAuto ? "Music sync ready" : "Music sync paused";
}

function formatPace(totalSeconds) {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return min + "'" + String(sec).padStart(2, "0") + '"';
}