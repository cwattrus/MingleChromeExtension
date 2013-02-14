var projectURL;

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('set_story_number_btn').addEventListener('click', openStory);
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("story_number").addEventListener("keypress", checkKey);
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("set_project_url_btn").addEventListener("click", saveProject);
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("edit_project_url_btn").addEventListener("click", function() {showSettings()});
});
  
function openStory(e) {
  var storyPage = projectURL + document.getElementById("story_number").value;
  window.open(storyPage, '_blank');
  window.focus();
}

function checkKey()
{
  if (window.event.keyCode == 13)
  {
      openStory();
  }
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

