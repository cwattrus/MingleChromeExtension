var projectURL;
var cardsURL;

document.getElementById('set_story_number_btn').addEventListener('click', openStoryInNewTab);
document.getElementById('view_story_list_btn').addEventListener('click', openStoryList);
document.getElementById("story_number").addEventListener("keypress", checkKeys);
document.getElementById("set_project_url_btn").addEventListener("click", saveProject);
document.getElementById("edit_project_url_btn").addEventListener("click", function() {showSettings()});


// Tracking the key presses
map={}
onkeydown=onkeyup=function(e){
    e=e||event; //to deal with IE
    map[e.keyCode]=e.type=='keydown'?true:false;
}

function checkKeys()
{
  if(map[17]) {
    //alert("control");
  }
  if (map[18]&&map[13])
  {
      console.log("Alt and enter");
      openStoryInTab();
  }
  else if(map[13]){
      openStoryInNewTab();
  }
}

function openStoryList() {
  chrome.tabs.create({url:cardsURL});
}

function openStoryInTab() {
  var storyPage = cardsURL + document.getElementById("story_number").value;
  chrome.tabs.update(null,{url:storyPage});
}

function openStoryInNewTab() {
  var storyPage = cardsURL + document.getElementById("story_number").value;
  chrome.tabs.create({url:storyPage});
}

$(document).ready(function() {
  checkProjectURL();
});

function checkProjectURL() {
  getProject();
  getCards();
  validateURLs();
  $("#loader").fadeIn(400, "");
  setTimeout(function() {
    if (!projectURL){
      $("#loader").fadeOut(200, "");
      showSettings();
    }
    else {
      hideSettings();
    }
  }, 1000)
}

function validateURLs() {
  if(projectURL) {
    var cardsTextIndex = projectURL.indexOf("/cards/");
    if(cardsTextIndex != -1) {
      projectURL = projectURL.substring(0, cardsTextIndex);
      saveProjectToChromeStorage(projectURL, projectURL + "/cards/");
    }
  }
}

function showSettings() {
  getProject();
  if(projectURL) document.getElementById("project_location").value = projectURL;
  document.getElementById("story_time").style.display = "none";
  document.getElementById("edit_actions").style.display = "block";
  document.getElementById("actions").style.display = "none";
  document.getElementById("project_location").focus();
}

function hideSettings() {
  $("#loader").fadeOut(200, "");
  document.getElementById("story_time").style.display = "block";
  document.getElementById("actions").style.display = "block";
  document.getElementById("edit_actions").style.display = "none";
  document.getElementById("story_number").focus();
}

function saveProject() {
  projectURL = document.getElementById("project_location").value;
  validateURLs();
  cardsURL = projectURL + "/cards/";
  saveProjectToChromeStorage(projectURL, cardsURL);
  $("#loader").fadeIn(400, "");
    if (!projectURL){
      $("#loader").html("<small style='color:red'>Project URL cannot be blank</small>");
      showSettings();
    }
    else {
      hideSettings();
    }
}

function saveProjectToChromeStorage(projectURLToStore, cardsURLToStore) {
  chrome.storage.sync.set({project:projectURLToStore}, function() {
    console.log("Project saved: " + projectURLToStore);
  });

  if(cardsURLToStore) {
    chrome.storage.sync.set({cards:cardsURLToStore}, function() {
      console.log("cards saved: " + cardsURLToStore);
    });
  }
}

function getProject() {
  chrome.storage.sync.get('project', function(r) {
    projectURL = r['project'];
  });
}

function getCards() {
  chrome.storage.sync.get('cards', function(r) {
    cardsURL = r['cards'];
  });
}

function clearProject() {
  chrome.storage.sync.remove('project', function(r) {
    console.log('Project Cleared');
  });
}

function clearCards() {
  chrome.storage.sync.remove('cards', function(r) {
    console.log('Cards Cleared');
  });
}

