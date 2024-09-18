console.log('initialize console...')
let currentSong = new Audio()
let songs
let currFolder


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSong(folder) {
    currFolder = folder
    songs = []
    let response = await fetch(`http://127.0.0.1:3000/songs/${currFolder}`)
    let htmltext = await response.text()
    let div = document.createElement("div")
    div.innerHTML = htmltext
    let as = div.getElementsByTagName("a")
    for (let a = 0; a < as.length; a++) {
        if (as[a].href.endsWith(".mp3")) {
            songs.push(as[a].href)
        }

    }
    // Display songs in the library
    let playlist = document.querySelector(".songs").getElementsByTagName("ul")[0]
    playlist.innerHTML = ''
    for (let index = 0; index < songs.length; index++) {
        playlist.innerHTML = playlist.innerHTML + `<li class = "cursor"><img class="invert" src="assets/images/song.svg" alt="song">
                        <div class="info">
                            <div> ${decodeURIComponent(songs[index].replace(`http://127.0.0.1:3000/songs/${currFolder}/`, ""))}</div>
                    </li>`

    }
    // Attach an event listener to each song
    Array.from(document.querySelector('.songs').getElementsByTagName('li')).forEach(e => {
        e.addEventListener('click', element => {
            playMusic(`/songs/${currFolder}/${encodeURI(e.querySelector('.info').firstElementChild.innerHTML.trim())}`)
        })
    })
}

const playMusic = (track, pause = false) => {
    currentSong.src = track
    if (!pause) {
        currentSong.play()
        play.src = "assets/images/pause.svg"
    }
    document.querySelector('.songname').innerHTML = decodeURI(track.split('/').slice(-1)[0])
    document.querySelector('.songtime').innerHTML = '00:00/00:00'
}

async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardcontainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder = "${folder}" class="card cursor">
                        <div class="playbutton">
                            <svg data-encore-id="icon" role="img" width="25" aria-hidden="true" viewBox="0 0 24 24"
                                class="Svg-sc-ytk21e-0 bneLcE">
                                <path
                                    d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                                </path>
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpeg" alt="img">
                        <h6>${response.description}</h6>
                    </div>`
        }
    }
    // Attach event listener to cards
   Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener('click', async item => {
        folder = item.currentTarget.dataset.folder
        await getSong(folder)
        playMusic(decodeURI(songs[0]))
        
    })
})
}

// let song = await getSong()
async function main() {
    let folder = 'siraiki'
    await getSong(folder)

    playMusic(songs[0], true)

    await displayAlbums()

    // Attach an event listenerr to change song time
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Attach an event listenerr to play button
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "assets/images/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "assets/images/play.svg"
        }
    })

    // Attach an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // Attach an event listener to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0 + "%"
    })

    // Attach an event listener to close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = -110 + "%"
    })

    // Attach an event listener to previous song button
    previous_song.addEventListener("click", ()=>{
        let index = songs.indexOf(currentSong.src)
        if ((index - 1) >= 0){
            currentSong.pause()
            playMusic(songs[index - 1])
        }
    })

    // Attach an event listener to next song button
    next_song.addEventListener("click", ()=>{
        let index = songs.indexOf(currentSong.src)
        if ((index + 1) < songs.length){
            currentSong.pause()
            playMusic(songs[index + 1])
        }
    })

    // Attach event listener to volume button
    document.querySelector(".range").addEventListener("change", (e)=>{
        currentSong.volume = (e.target.value) / 100
    })

}
main()