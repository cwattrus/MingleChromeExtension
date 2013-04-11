var projectURL;

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('set_story_number_btn').addEventListener('click', openStoryInNewTab);
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('view_story_list_btn').addEventListener('click', openStoryList);
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("story_number").addEventListener("keypress", checkKeys);
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("set_project_url_btn").addEventListener("click", saveProject);
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("edit_project_url_btn").addEventListener("click", function() {showSettings()});
});

// Tracking the key presses
map={} //I know most use an array, but the use of string indexes in arrays is questionable
onkeydown=onkeyup=function(e){
    e=e||event; //to deal with IE
    map[e.keyCode]=e.type=='keydown'?true:false;
    /*insert conditional here*/
}

function checkKeys()
{ 
  if(map[17]) {
    alert("control"); 
  }
  if (map[18]&&map[13])
  {
      openStoryInTab();
  }
  else if(map[13]){
      openStoryInNewTab();
  }
}

function openStoryList() {
  chrome.tabs.create({url:projectURL});
}

function openStoryInTab() {
  var storyPage = projectURL + document.getElementById("story_number").value;
  chrome.tabs.update(null,{url:storyPage});
}

function openStoryInNewTab() {
  var storyPage = projectURL + document.getElementById("story_number").value;
  chrome.tabs.create({url:storyPage});
}

$(document).ready(function() {
  checkProjectURL();
});

function checkProjectURL() {
  getProject();
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

function showSettings() {
  clearProject();
  document.getElementById("story_number").style.display = "none";
  document.getElementById("edit_actions").style.display = "block";
  document.getElementById("actions").style.display = "none";
  document.getElementById("project_location").focus();
}

function hideSettings() {
  $("#loader").fadeOut(200, "");
  document.getElementById("story_number").style.display = "block";
  document.getElementById("actions").style.display = "block";
  document.getElementById("edit_actions").style.display = "none";
  document.getElementById("story_number").focus();
}

function saveProject() {
  projectURL = document.getElementById("project_location").value;
  saveToChromeStorage(projectURL);
  $("#loader").fadeIn(400, "");
    if (!projectURL){
      $("#loader").html("<small style='color:red'>Project URL cannot be blank</small>");
      showSettings();
    }
    else {
      hideSettings();
    }
}

function saveToChromeStorage(itemToStore) {
  chrome.storage.sync.set({projUrl:itemToStore}, function() {
    console.log('Project URL saved: ' + itemToStore);
  });
}

function getProject() {
  chrome.storage.sync.get('projUrl', function(r) {
    projectURL = r['projUrl'];
  });
}

function clearProject() {
  chrome.storage.sync.remove('projUrl', function(r) {
    console.log('Project Cleared');
  });
}

