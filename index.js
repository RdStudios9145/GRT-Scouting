var data = {};
var actions = [];
var redos = [];

const sheetlink = "https://docs.google.com/forms/d/e/1FAIpQLSe-135qXP1VUT801Hy4HEibmNgtLD3WhloW5MM8LI8Vox9MNw/viewform";
const entry = "entry.642803694";

const mode = {
  "auton": 0,
  "teleop": 1,
};

const action = {
  "intake": 0,
  "shoot": 1,
  "proceed": 2,
  "failure": 3,
  "done": 4,
  "climb": 5,
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
  data['auton make amp'] = 0;
  data['auton miss amp'] = 0;
  data['auton make speaker'] = 0;
  data['auton miss speaker'] = 0;
  data['auton failure'] = 0;

  data['teleop ground intake'] = 0;
  data['teleop source intake'] = 0;
  data['teleop make amp'] = 0;
  data['teleop miss amp'] = 0;
  data['teleop make speaker'] = 0;
  data['teleop miss speaker'] = 0;
  data['teleop make trap'] = 0;
  data['teleop miss trap'] = 0;
  data['teleop shuttle'] = 0;
  data['teleop failures'] = [];
  data['teleop defense priority'] = false;

  data['endgame climb'] = false;
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
  var make = "make";

  if (deposit !== "shuttle")
    make = document.querySelector('input[name="tmake"]:checked').value;

  return { "deposit": deposit, "make": make };
}

const getTeleopFailureData = () => {
  const data = document.getElementById("fail_data").value;

  return { "data": data };
}

const getFinalData = () => {
  const defense = document.getElementById("defense").checked;
  const harmony = document.getElementById("harmony").checked;

  return { "defense": defense, "harmony": harmony };
}

const getClimbData = () => {
  const success = document.querySelector('input[name="climb"]:checked').value;

  if (success === "success") document.querySelectorAll(".harmony").forEach(e => e.style.display = "inline");

  return { "success": success };
}

const evaluateAutonAction = (Action) => {
  switch (Action[1]) {
    case action.intake:
      if (Action[2].id == "pre") break;
      data['auton intake'][Action[2].id] += 1;
      break;
    
    case action.shoot:
      data[`auton ${Action[2].make} ${Action[2].deposit}`] += 1;
      break;

    case action.failure:
      data['auton failure'] = true;
      break;

    case action.proceed:
    case action.done:
    case action.climb:
      break;
  }
}

const evaluateTeleopAction = (Action) => {
  switch (Action[1]) {
    case action.intake:
      data[`teleop ${['ground', 'source'][Action[2].id]} intake`] += 1;
      break;

    case action.shoot:
      data[`teleop ${Action[2].deposit == "shuttle" ? "" : Action[2].make + " "}${Action[2].deposit}`] += 1;
      break;

    case action.failure:
      if (!Object.keys(Action[2]).includes("data")) break;

      data['teleop failures'].push(Action[2].data);
      break;

    case action.climb:
      if (Object.keys(Action[2]).includes("success")) data['endgame climb'] = Action[2].success ? true : data['endgame climb'];
      break;

    case action.proceed:
    case action.done:
      break;
  }
}

const evaluateActions = () => {
  for (var action of actions) {
    if (action[0] == mode.auton) evaluateAutonAction(action);
    if (action[0] == mode.teleop) evaluateTeleopAction(action);
  }
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
    case action.intake:
      onSection(3);

      if (data.id === "pre") document.getElementById("preload").style.display = "none";

      break;

    case action.shoot:
      onSection(0);
      break;

    case action.proceed:
      onSection(1);
      break;

    case action.failure:
      break;
  }
}

const actionTeleop = (Action, data) => {
  switch (Action) {
    case action.intake:
      onSection(4);
      break;

    case action.shoot:
      onSection(1);
      break;

    case action.failure:
      if (Object.keys(data).includes("data"))
        onSection(1);
      else
        onSection(6);
      break;

    case action.climb:
      if (Object.keys(data).includes("success"))
        onSection(1);
      else
        onSection(2);
      break;

    case action.done:
      evaluateActions();
      onSection(5);
      break;
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

const stringifyData = () => {
  var string = "";

  for (var key of Object.keys(data)) {
    string += `;${data[key]}`;

    console.log(key, data[key]);
  }

  return string.substring(1);
}

const submit = () => {
  data['additional notes'] = document.getElementById("final_comments").value;

  document.getElementById("submit").href = `${sheetlink}?${entry}=${stringifyData()}`;
}
