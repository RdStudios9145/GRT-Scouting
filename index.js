var data = {};
var actions = [];
var redos = [];

const mode = {
  "auton": 0,
  "teleop": 1,
};

const action = {
  "intake": 0,
  "shoot": 1,
  "proceed": 2,
  "defense_priority": 3,
  "failure": 4,
}

const onSection = (id) => {
  document.body.setAttribute("data-section", id);
}

const swapColor = () => {
  var color = document.getElementById("match_color").innerText;

  // Cursed. String for the color red is 15 chars long, so if it is longer, its blue. Switch colors
  document.getElementById("match_color").innerText = color.length > 15 ? "Team Color: Red" : "Team Color: Blue"
}

const start = () => {
  data['color'] = document.getElementById("match_color").innerText.split(" ")[2];
  data['match #'] = document.getElementById("match_number").value;
  data['team #'] = document.getElementById("team_number").value;
  data['match'] = document.querySelector('input[name="match"]:checked').value;

  data['auton intake'] = Array(8).fill(0);
  data['auton made amp'] = 0;
  data['auton missed amp'] = 0;
  data['auton made speaker'] = 0;
  data['auton missed speaker'] = 0;
  data['auton failure'] = 0;

  data['teleop made amp'] = 0;
  data['teleop missed amp'] = 0;
  data['teleop made speaker'] = 0;
  data['teleop missed speaker'] = 0;
  data['teleop made trap'] = 0;
  data['teleop missed trap'] = 0;
  data['teleop shuttle'] = 0;
  data['teleop failures'] = [];
  data['teleop defense priority'] = false;

  data['endgame climb attempt'] = [];
  data['endgame harmony'] = false;

  data['additional notes'] = "";

  onSection(0);
};

const getAutonDepositData = () => {
  const deposit = document.querySelector('input[name="adeposit"]:checked').value;
  const make = document.querySelector('input[name="amake"]:checked').value;

  return { "deposit": deposit, "make": make };
}

const getTeleopDepositData = () => {
  const deposit = document.querySelector('input[name="tdeposit"]:checked').value;
  const make = document.querySelector('input[name="tmake"]:checked').value;

  return { "deposit": deposit, "make": make };
}

const Action = (Mode, Action, data) => {
  console.log(Mode, Action, data);

  if (Mode == mode.auton)  actionAuton(Action, data);
  if (Mode == mode.teleop) actionTeleop(Action, data);

  actions.push([Mode, Action, data]);
  redos = [];
};

const actionAuton = (Action, data) => {
  switch (Action) {
    // Hi Rishay!
  }
}

const actionTeleop = (Action, data) => {
  switch (Action) {
    // Hi Rishay!
  }
}

const undo = () => {
  if (actions.length == 0) return;
  
  var action = actions.pop();
  redos.push(action);

  // ...

  if (redos.length != 0) document.getElementById("redo").style.display = "inline";
}

const redo = () => {
  if (redos.length == 0) return document.getElementById("redo").style.display = "none";

  var action = redos.pop();
  actions.push(action);

  // ...

  if (redos.length === 0) document.getElementById("redo").style.display = "none";
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

  // console.log(counts);

  const one_eight_buttons = document.getElementById("one_eight_buttons");

  for (var i = 0; i < 8; i++) {
    let t = i;

    var button = document.createElement("button");
    button.innerText = i + 1;
    button.onclick = () => Action(mode.auton, action.intake, { "id": t });

    var br = document.createElement("br");

    one_eight_buttons.append(button, br);
  }
}

setup();

const filter = (e) => {
  let t = e.target;
  let badValues = /[^\d]/gi;
  if (e.key.replace(badValues, "") === "") e.preventDefault();
}

document.querySelectorAll("input[type=number]").forEach(el => {
  el.addEventListener('keypress', filter);
});

document.querySelectorAll("input[name=tdeposit]").forEach(e => {
  e.addEventListener("click", () => {
    if (e.id === "shuttle_td") {
      document.querySelectorAll("input[name=tmake],.tmake").forEach(e1 => e1.style.display = "none");
    } else 
      document.querySelectorAll("input[name=tmake],.tmake").forEach(e1 => e1.style.display = "inline");
  })
})
