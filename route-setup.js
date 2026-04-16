const searchInput = document.getElementById("searchInput");
const relocateBtn = document.getElementById("relocateBtn");
const startRunBtn = document.getElementById("startRunBtn");

const routeTitle = document.getElementById("routeTitle");
const routeStatus = document.getElementById("routeStatus");
const startText = document.getElementById("startText");
const destinationText = document.getElementById("destinationText");
const distanceText = document.getElementById("distanceText");
const timeText = document.getElementById("timeText");

let map = null;
let geolocation = null;
let autoComplete = null;
let placeSearch = null;
let walking = null;

let currentPosition = null;
let currentAddress = "定位中...";
let destinationData = null;
let currentRoute = null;
let currentMarker = null;
let destinationMarker = null;

initMap();

function initMap() {
    map = new AMap.Map("mapContainer", {
        zoom: 15,
        viewMode: "2D",
        resizeEnable: true
    });

    AMap.plugin(
        ["AMap.Geolocation", "AMap.AutoComplete", "AMap.PlaceSearch", "AMap.Walking"],
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

            getCurrentLocation();
            bindEvents();
        }
    );
}

function bindEvents() {
    relocateBtn.addEventListener("click", function () {
        getCurrentLocation();
    });

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

    startRunBtn.addEventListener("click", function () {
        if (!currentRoute) {
            return;
        }

        localStorage.setItem("runRoute", JSON.stringify(currentRoute));
        window.location.href = "session.html";
    });
}

function getCurrentLocation() {
    routeStatus.textContent = "定位中";
    startText.textContent = "定位中...";

    geolocation.getCurrentPosition(function (status, result) {
        if (status === "complete" && result.position) {
            currentPosition = result.position;
            currentAddress = result.formattedAddress || "当前位置";
            startText.textContent = currentAddress;

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
        } else {
            startText.textContent = "定位失败";
            routeStatus.textContent = "定位失败";
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

    destinationData = destination;

    destinationText.textContent = destination.name;
    routeTitle.textContent = destination.name;
    routeStatus.textContent = "规划中";

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
            alert("路线生成失败，请重新选择目的地。");
            return;
        }

        const route = result.routes[0];
        const distanceKm = (route.distance / 1000).toFixed(2);
        const timeMin = Math.ceil(route.time / 60);

        distanceText.textContent = `${distanceKm} km`;
        timeText.textContent = `${timeMin} min`;
        routeStatus.textContent = "已生成";

        currentRoute = {
            startName: currentAddress,
            destinationName: destination.name,
            distanceKm: distanceKm,
            timeMin: timeMin,
            origin: [currentPosition.lng, currentPosition.lat],
            destination: [destination.location.lng, destination.location.lat]
        };

        startRunBtn.disabled = false;
    });
}