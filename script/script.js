console.log('initialize console...')
let currentSong = new Audio()

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

async function getSong() {
    let songs = []
    let response = await fetch('http://127.0.0.1:3000/songs/')
    let htmltext = await response.text()
    let div = document.createElement("div")
    div.innerHTML = htmltext
    let as = div.getElementsByTagName("a")
    for (let a = 0; a < as.length; a++) {
        if (as[a].href.endsWith(".mp3")){
            songs.push(as[a].href)
        }
        
    }
    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = 'http://127.0.0.1:3000/songs/' + track
    if (!pause) {
        currentSong.play()
        play.src = "assets/images/pause.svg"
    }
    document.querySelector('.songname').innerHTML = decodeURI(track)
    document.querySelector('.songtime').innerHTML = '00:00/00:00'
}

// let song = await getSong()
async function main() {
    let song = await getSong()

    playMusic(decodeURI(song[0].replace('http://127.0.0.1:3000/songs/', '')), true)

    // Display songs in the library
    let playlist = document.querySelector(".songs").getElementsByTagName("ul")[0]
    playlist.innerHTML = ''
    for (let index = 0; index < song.length; index++) {
        playlist.innerHTML = playlist.innerHTML + `<li class = "cursor"><img class="invert" src="assets/images/song.svg" alt="song">
                        <div class="info">
                            <div> ${decodeURIComponent(song[index].replace('http://127.0.0.1:3000/songs/', ""))}</div>
                    </li>`
        
    }
    
    // Attach an event listner to each song
    Array.from(document.querySelector('.songs').getElementsByTagName('li')).forEach(e => {
        e.addEventListener('click', element => {
            playMusic(e.querySelector('.info').firstElementChild.innerHTML.trim())
        })
    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"; 
    })

    play.addEventListener("click", ()=>{
        if (currentSong.paused){
            currentSong.play()
            play.src = "assets/images/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "assets/images/play.svg"
        }
    })

    document.querySelector(".seekbar").addEventListener("click", e =>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })


}
main()