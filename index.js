var data = {};
var actions = [];
var redos = [];

const onSection = (id) => {
  document.body.setAttribute("data-section", id);
}

const swapColor = () => {
  var color = document.getElementById("match_color").innerText;
  document.getElementById("match_color").innerText = color.length > 15 ? "Team Color: Red" : "Team Color: Blue"
}

const start = () => {
  data['color'] = document.getElementById("match_color").innerText.split(" ")[1];
  data['match #'] = document.getElementById("match_number").value;
  data['team #'] = document.getElementById("team_number").value;
  data['match'] = document.querySelector('input[name="match"]:checked').value;
}

const setup = () => {
  const counters = document.querySelectorAll(".counter");

  counters.forEach(counter => {
    var name = counter.getAttribute("data-name");
    var parent = counter.parentElement.id;
    var count = `${parent}:${name}`;

    console.log(count);
    counts[count] = 0;

    var value = document.createElement("input");
    value.value = 0;
    value.type = "number";

    var increment = document.createElement("button");
    increment.innerText = "Add to " + name;
    increment.onclick = () => {
      counts[count] += 1;
      value.value = parseInt(value.value) + 1;
    };

    var decrement = document.createElement("button");
    decrement.innerText = "Remove from " + name;
    decrement.onclick = () => {
      counts[count] -= 1;
      value.value -= 1;
    };

    counter.append(decrement, value, increment);
  });

  console.log(counts);
}

setup();
