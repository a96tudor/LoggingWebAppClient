
function getHH_MM_SS(totalSec) {

  let sec = pad(totalSec%60);
  let mins = pad(parseInt(totalSec/60)%60);
  let hrs = pad(parseInt(totalSec/3600));

  return (hrs + ":" + mins + ":" + sec);

  function pad(val)
  {
    var valString = val + "";
    if(valString.length < 2)
    {
        return "0" + valString;
    }
    else
    {
        return valString;
    }
  }
}

function loadLeaderboard() {
  let url = "https://www.neural-guide.me/stats/leaderboard";

  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = 'json';

  xhr.onreadystatechange = function() {
    if (!xhr.response) return;

    if (xhr.status == 200) {
      if (xhr.response["success"]) {
        let leaderboard = xhr.response["leader_board"];
        var innerHTML = "";
        var total = 0;
        for (var i=0; i < leaderboard.length; i++) {
          innerHTML += "<tr> \n <td>" + (i+1)  +
                       "<td>" + leaderboard[i]["name"] +
                       "<td>" + getHH_MM_SS(leaderboard[i]["seconds"]);
          total += leaderboard[i]["seconds"];
        }
        document.getElementById("leaderboard-body").innerHTML = innerHTML;
        document.getElementById("total").innerHTML = getHH_MM_SS(total);
      } else {
        alert("Error loading the leaderboard. Please contact an admin.");
      }
    }
    else {
      alert("Error loading the leaderboard. Please contact an admin.");
    }

  }

  xhr.send();
}

function loadHistorySameUser() {
  let url = "https://www.neural-guide.me/user/stats/history";

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.responseType='json';
  xhr.setRequestHeader("Content-type", "application/json");

  xhr.onreadystatechange = function() {
    if (!response) return;
    if (xhr.status == 200 && xhr.response["success"]) {
      let history = xhr.response["history"];
      var innerHTML = "";
      for (var i=0; i<history.length; i++) {
        let item = history[i];
        innerHTML += "<tr> \n <td> " + (i+1) +
              "<td>" + item["course_name"] +
              "<td>" + item["started_at"] +
              "<td>" + getHH_MM_SS(item["seconds"]) +
              "<td> We'll have rating feature here later "
      }
    } else {
      alert("Error loading user information. Please contact an administrator!")
    }
  }
  let dataToSend = {
    "asking": read_cookie("id"),
    "user": read_cookie("id")
  };

  xhr.send(JSON.stringify(dataToSend));
}
