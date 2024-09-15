console.log('initialize console...')
let currentSong = new Audio()
let song
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
    let songs = []
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
    return songs
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

// let song = await getSong()
async function main() {
    let folder = 'siraiki'
    song = await getSong(folder)

    playMusic(song[0], true)

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
        let index = song.indexOf(currentSong.src)
        if ((index - 1) >= 0){
            currentSong.pause()
            playMusic(song[index - 1])
        }
    })

    // Attach an event listener to next song button
    next_song.addEventListener("click", ()=>{
        let index = song.indexOf(currentSong.src)
        if ((index + 1) < song.length){
            currentSong.pause()
            playMusic(song[index + 1])
        }
    })

    // Attach event listener to volume button
    document.querySelector(".range").addEventListener("change", (e)=>{
        currentSong.volume = (e.target.value) / 100
    })

    // Attach event listener to cards
   Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener('click', async item => {
            folder = item.currentTarget.dataset.folder
            let songs = await getSong(folder)
            playMusic(decodeURI(songs[0]))
            
        })
    })
}
main()