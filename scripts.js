'use strict';

const app = {
    markers: [],
    postId: '',
    // startingZCoord: 500000,
    startingZCoord: 20000000,
}

const viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider: Cesium.createWorldImagery({
        style: Cesium.IonWorldImageryStyle.AERIAL
    }),
    baseLayerPicker: false
});

const main = () => {
    drawIcons();
    updateInfobox();
    flyToStart();
    listenForClicks();
}

const drawIcons = () => {
    for (let i = 0; i < posts.length; i++) {
        let latitude = parseFloat(posts[i].latitude);
        let longitude = parseFloat(posts[i].longitude);

        app.markers.push(
            viewer.entities.add({
                name: posts[i].id,
                position: Cesium.Cartesian3.fromDegrees(latitude, longitude, 0),
                point: {
                    pixelSize : 10,
                    color: Cesium.Color.RED,
                    outlineColor : Cesium.Color.WHITE,
                    outlineWidth : 1
                }
            })
        );
    }
}

// Lägg in nullcheckar 
// Skapa stängningsknapp
// Skapa stöd för mer än en bild
const updateInfobox = (id) => {
    const newPost = posts.find(p => p.id === id);

    if (newPost) {
        const container = document.querySelector('#infoContainer');
        container.innerHTML = 
            `<h2>${newPost.name}</h2>
            <p>${newPost.area}</p>
            <img src=${newPost.imageUrl} />
            <p id='credits'>${newPost.imageCredits}</p>
            <p>${newPost.description}</p>`;
        container.classList.remove('display-none');
        app.postId = id;
    }
}

const flyToStart = () => {
    const postLatitude = parseFloat(posts[0].latitude);
    const postLongitude = parseFloat(posts[0].longitude);

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(postLatitude, postLongitude, app.startingZCoord),
        orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-90.0),
        }
    });
}

const listenForClicks = () => {
    const infoBox = document.querySelector('.cesium-infoBox');

    setInterval(function() {
        if (infoBox.classList.contains('cesium-infoBox-visible')) { 
            var newId = document.querySelector('.cesium-infoBox-title').innerHTML;

            if (newId !== app.postId) {
                updateInfobox(newId);
            }
        }
    }, 250);
}

if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
    main();
} else {
    document.addEventListener('DOMContentLoaded', main);
}