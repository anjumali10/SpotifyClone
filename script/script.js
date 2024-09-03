console.log('initialize console...')


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

async function main() {
    let song = await getSong()
    for (let index = 0; index < song.length; index++) {
        
        let playlist = document.querySelector(".songs").querySelector("ul")
        playlist.innerHTML = playlist.innerHTML + `<li class = "cursor"><img class="invert" src="assets/images/song.svg" alt="song">
                        <div class="info">
                            <div> ${decodeURIComponent(song[index].replace('http://127.0.0.1:3000/songs/', ""))}</div>
                    </li>`
        
    }
    console.log(playlist.innerHTML)
    // let audio = new Audio(song[0])
    // audio.play()
}
main()