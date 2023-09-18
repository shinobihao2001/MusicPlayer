const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const header = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const player = $(".player");
const progressBar = $(".progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playList = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "One One",
      singer: "T-ara",
      image: "./music/albumCover.jpg",
      url: "./music/01 - 티아라 - One _ One.flac",
    },
    {
      name: "티아라 - 처음처럼",
      singer: "T-ara",
      image: "./music/albumCover.jpg",
      url: "./music/02 - 티아라 - 처음처럼 - 타이틀곡.flac",
    },
    {
      name: "Bo Peep Bo Peep",
      singer: "T-ara",
      image: "./music/albumCover.jpg",
      url: "./music/03 - 티아라 - Bo Peep Bo Peep - 타이틀곡.flac",
    },
    {
      name: "Tic Tic Toc",
      singer: "T-ara",
      image: "./music/albumCover.jpg",
      url: "./music/04 - 티아라 - Tic Tic Toc.flac",
    },
    {
      name: "Bye Bye",
      singer: "T-ara",
      image: "./music/albumCover.jpg",
      url: "./music/05 - 티아라 - Bye Bye.flac",
    },
    {
      name: "Apple Is A",
      singer: "T-ara",
      image: "./music/albumCover.jpg",
      url: "./music/06 - 티아라 - Apple Is A.flac",
    },
    {
      name: "Falling U",
      singer: "T-ara",
      image: "./music/albumCover.jpg",
      url: "./music/07 - 티아라 - Falling U.flac",
    },
    {
      name: "T.T.L(Time To Love)",
      singer: "T-ara",
      image: "./music/albumCover.jpg",
      url: "./music/10 - 티아라 - T.T.L(Time To Love).flac",
    },
  ],
  definePropreties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  render: function () {
    let playList = $(".playlist");
    let newSongs = this.songs.map(function (song, index) {
      return `    
      <div class="song" data-index="${index}"">
      <div
        class="thumb"
        style="
          background-image: url(${song.image});
        "
      ></div>
      <div class="body">
        <h3 class="title">${song.name}</h3>
        <p class="author">${song.singer}</p>
      </div>
      <div class="option">
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </div>`;
    });
    let htmls = newSongs.join("");
    playList.innerHTML = htmls;
  },
  handleEvent: function () {
    const _this = this;
    // cdWidth ra truoc de no set lun bang 200;
    const cdWidth = cd.offsetWidth;
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10 seconds
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // xử lý khi kéo lên kéo xuống
    document.onscroll = function () {
      let height = window.scrollY || document.documentElement.scrollTop;
      let newWidth = cdWidth - height;
      cd.style.width = newWidth + "px";
      cd.style.opacity = newWidth / cdWidth;
    };

    // Xử lý khi bấm play/páue
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else audio.play();
    };

    // Xử lý audio khi play/páue
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    // xử lý progressbar chạy
    audio.ontimeupdate = function () {
      let position = Math.floor((audio.currentTime / audio.duration) * 100);
      //console.log(position); // Khi posistion = NAN thanh vaule nhảy ra giữa
      if (!position) {
        position = 0;
      }
      progressBar.value = position;
    };
    // xử lý update proogessbar
    progressBar.oninput = function () {
      let setPosition = progressBar.value;
      let newCurrentime = Math.floor((setPosition / 100) * audio.duration);
      audio.currentTime = newCurrentime;
    };

    // xử lý bấm nút next;
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandom();
      } else _this.nextSong();
    };
    // xử lý bấm nút prev:
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandom();
      } else _this.prevSong();
    };

    // xử lý khi hết bài:
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        _this.isPlaying = true;
        if (_this.isRandom) {
          _this.playRandom();
        } else _this.nextSong();
      }
    };

    // xử lý khi bấm random:
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // xu ly khi bam repeat:
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // xu ly khi bam vao the bai hat
    playList.onclick = function (e) {
      //console.log(e.target);
      let songNode = e.target.closest(".song:not(.active)");
      //console.log(songNode);
      if (songNode || e.target.closest(".option")) {
        // xu ly khi la bai hat
        if (songNode) {
          let newIndex = songNode.getAttribute("data-index");
          //console.log(songNode.getAttribute("class"));
          //console.log(songNode.getAttribute("data-index"));
          _this.currentIndex = newIndex;
          _this.loadCurrentSong();
          if (_this.isPlaying) {
            audio.play();
          } else audio.pause();
        }
        // xu ly khi la ôttopn
      }
    };
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
    if (this.isPlaying) {
      audio.play();
    } else audio.pause();
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex > this.songs.length - 1) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
    if (this.isPlaying) {
      audio.play();
    } else audio.pause();
  },
  playRandom: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    console.log(newIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
    if (this.isPlaying) {
      audio.play();
    } else audio.pause();
  },
  loadCurrentSong: function () {
    let song = this.currentSong;
    header.textContent = song.name;
    cdThumb.style.backgroundImage = `url${song.image}`;
    audio.src = song.url;
    this.turnOnActiveSong(this.currentIndex);
    this.scroolToView();
  },
  turnOnActiveSong: function (newIndex) {
    let oldActive = $(".song.active");
    if (oldActive) {
      oldActive.classList.remove("active");
    }
    const songs = $$(".song");
    songs[newIndex].classList.add("active");
  },
  scroolToView: function () {
    setTimeout(function () {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },
  start: function () {
    this.definePropreties();
    this.render();
    this.loadCurrentSong();
    this.handleEvent();
  },
};

app.start();
