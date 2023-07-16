const UserSchema = require("../../models/user");

module.exports = {
  match,
  matchHeatmap,
};

match("javascript, html, css, express, restful", "java, ejb, express");

function matchHeatmap(seekerSkills, jobSkills, topN) {
  const closeness = match(seekerSkills, jobSkills);
  let sum = 0;
  const minLengthAndTopN = Math.min(topN, closeness.length);
  for (let jobIndex = 0; jobIndex < minLengthAndTopN; jobIndex++) {
    sum += closeness[jobIndex].closeness;
  }
  return Math.ceil(100 * (sum / minLengthAndTopN));
}

function match(seekerSkills, jobSkills) {
  jobSkills = jobSkills.split(",");
  seekerSkills = seekerSkills.split(",");
  const jobMatches = jobSkills.map((jobSkill) => {
    // find the top matching seeker skill
    const similarities = seekerSkills.map((seekerSkill) => {
      return similarity(jobSkill, seekerSkill);
    });
    const maxIndex = indexOfMax(similarities);
    return {
      jobSkill,
      closeness: similarities[maxIndex],
      bestMatch: seekerSkills[maxIndex],
    };
  });
  jobMatches.sort((a, b) => {
    if (a.closeness < b.closeness) {
      return 1;
    } else if (a.closeness > b.closeness) {
      return -1;
    } else {
      return 0;
    }
  });
  return jobMatches;
}

// https://stackoverflow.com/questions/11301438/return-index-of-greatest-value-in-an-array
function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}

// https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}
