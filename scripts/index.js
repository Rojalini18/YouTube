let URL = "AIzaSyCA2ZgfmTkC6c0RGE4nlheSBhhmwXQm2-4";

// another video search page
var watchvideo = localStorage.getItem("valueFromWatchvideo");
if (watchvideo != null) {
  SearchVideo("wachfromvideo");
  localStorage.removeItem("valueFromWatchvideo");
}

//Most Popular Videos
var url = `https://www.googleapis.com/youtube/v3/videos/?part=snippet&chart=mostPopular&regionCode=IN&maxResults=32&key=${URL}`;
getData(url, "videos");

//Search videos
function SearchVideo(search) {
  if (search == "searchlist") {
    video_name = document.querySelector("#video_search").value;
    url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${video_name}&type=video&key=${URL}`;
  } else if (search == "wachfromvideo") {
    url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${watchvideo}&type=video&key=${URL}`;
  }
  document.querySelector(".video_container").classList.add("search_container");
  getData(url, "search");
}

//res data
function getData(url, editdisplaycontent) {
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      showVideos(res.items, editdisplaycontent);
    })
    .catch((err) => {
      console.log(err);
    });
}

//Search video data append
let showVideos = (items, editdisplaycontent) => {
  document.querySelector(".video_container").innerHTML = "";

  items.map((item) => {
    var div = document.createElement("div");

    var videoImg = document.createElement("img");
    videoImg.setAttribute("class", "thmblinails");
    videoImg.src = item.snippet.thumbnails.medium.url;

    var title_and_Profile = document.createElement("div");
    title_and_Profile.setAttribute("class", "title_and_Profile");

    var divTitle = document.createElement("div");
    var title = document.createElement("p");
    title.innerText = item.snippet.title;

    var profile = document.createElement("img");

    var channelName = document.createElement("span");
    channelName.innerText = item.snippet.channelTitle;

    var views = document.createElement("span");

    //to get channel profile n view videos

    var channelicon = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&key=${URL}&id=${item.snippet.channelId}`;
    fetch(channelicon)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        channel_Img = res.items[0].snippet.thumbnails.medium.url;
        profile.src = channel_Img;
        viewvideo = res.items[0].statistics.viewCount;
        if (viewvideo >= 1000 && viewvideo < 1000000) {
          views.innerText = Math.floor(viewvideo / 1000) + "K views";
        } else if (viewvideo >= 1000000 && viewvideo < 1000000000) {
          views.innerText = Math.floor(viewvideo / 1000000) + "M views";
        } else if (viewvideo >= 1000000000 && viewvideo < 1e12) {
          views.innerText = Math.floor(viewvideo / 1000000000) + "B views";
        }
      })
      .catch((err) => {
        console.log(err);
      });

    //data append for search result n default videos

    if (editdisplaycontent == "search") {
      var searchDivChannel = document.createElement("div");

      var searchdes = document.createElement("p");

      searchdes.innerText = item.snippet.description;
      searchDivChannel.append(profile, channelName);

      divTitle.append(title, views, searchDivChannel, searchdes);
      title_and_Profile.append(divTitle);
    } else {
      divTitle.append(title, channelName, views);
      title_and_Profile.append(profile, divTitle);
    }

    div.append(videoImg, title_and_Profile);

    document.querySelector(".video_container").append(div);

    //Clicked video to anather page
    div.addEventListener("click", function () {
      getVideo(item, items);
    });
  });
};

//to move another page
function getVideo(item, items) {
  localStorage.setItem("mainVideo", JSON.stringify(item));
  localStorage.setItem("relatedVideo", JSON.stringify(items));
  window.location.href = "../pages/singleVideo.html";
}

//Toggle Status
function sidemenusmall() {
  document.querySelector(".container").classList.toggle("small_menu");
}
