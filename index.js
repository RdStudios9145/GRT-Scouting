var data = {};
var actions = [];
var redos = [];
var tempData = {};

// const sheetlink = "https://docs.google.com/forms/d/e/1FAIpQLSe-135qXP1VUT801Hy4HEibmNgtLD3WhloW5MM8LI8Vox9MNw/viewform";
// const sheetlink = "https://docs.google.com/forms/d/e/1FAIpQLScVrEjCZSPjP-tW_d178vbdkJ93yNbX5tjQ-I_gocGVT_w3_g/viewform";
const sheetlink = "https://docs.google.com/forms/d/e/1FAIpQLSdsAq8GZbaPp9NdBKWS_bUe41F1YDQLSJIo-1HtCiHphTLnkQ/viewform";
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
  data['actions'] = "";

  tempData['bessy'] = 0;

  if (data['color'] === "Blue") document.body.setAttribute("data-blue", "true");

  onSection(0);
};

const autonDepositLoc = () => {
  const deposit = document.querySelector('input[name="adeposit"]:checked').value;
  return deposit;
}

const teleopDepositLoc = () => {
  const deposit = document.querySelector('input[name="tdeposit"]:checked').value;
  return deposit;
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


  return { "success": success };
}

const evaluateAutonAction = (Action) => {
  switch (Action[1]) {
    case action.intake:
      tempData['bessy'] += 1;

      if (Action[2].id == "pre") break;

      if (data['auton intake'][Action[2].id] === 0)
        data['auton intake'][Action[2].id] += tempData['bessy'];

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

    case action.done:
      data['teleop defense priority'] = Action[2].defense;
      data['endgame harmony'] = Action[2].harmony;
      data['actions'] = JSON.stringify(actions);
      break;

    case action.proceed:
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

  if (Mode != mode.teleop || Action != action.done)
    actions.push([Mode, Action, data]);

  redos = [];
  hide("#redo");
  For("input[type='radio']", e => e.checked = false);
};

const actionAuton = (Action, data) => {
  switch (Action) {
    case action.intake:
      onSection(3);

      if (data.id === "pre") hide("#preload");
      For(`#auton${data.id}`, e => e.style.opacity = "0");

      break;

    case action.shoot:
      onSection(0);
      break;

    case action.proceed:
      if (Object.keys(data).includes("ground_intake")) {
        onSection(4);
      } else
        onSection(1);

      show("#climbing");
      show("#game_over");
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
      if (!Object.keys(data).includes("success")) {
        hide("#climb_attempt");
        show(".climb");

        break;
      }

      hide(".climb");

      let success = data.success;
      if (success === "success") {
        show(".harmony");
        hide("#climbing");
      } else {
        show("#climb_attempt");
      }
      break;

    case action.done:
      actions.push([mode.teleop, Action, data]);
      evaluateActions();
      onSection(5);
      hide("#game_over");
      hide("#climbing");
      break;
  }
}

const undo = () => {
  if (actions.length == 0) return;
  
  var action = actions.pop();
  redos.push(action);

  if (action[0] == mode.auton) undoAuton(action);
  if (action[0] == mode.teleop) undoTeleop(action);

  if (redos.length != 0) hide("#redo");
}

const undoAuton = (Action) => {
  switch (Action[1]) {
    case action.intake:
      onSection(0);

      if (Action[2].id === "pre") show("#preload");
      For(`#auton${Action[2].id}`, e => e.style.opacity = "100%");
      break;

    case action.shoot:
      onSection(3);

      For(`input[name=adeposit][value=${Action[2].deposit}]`, e => { e.checked = true; });
      break;

    case action.proceed:
      if (Action[2].ground_intake === true)
        onSection(3);
      else
        onSection(0);

      hide("#climbing");
      hide("#game_over");
      break;

    case action.failure:
      break;
  }
}

const undoTeleop = Action => {
  switch (Action[1]) {
    case action.intake:
      onSection(1);
      break;
    
    case action.shoot:
      onSection(4);

      For(`input[name=tdeposit][value=${Action[2].deposit}]`, e => e.checked = true);
      break;

    case action.failure:
      if (Object.keys(Action[2]).includes("data"))
        onSection(6);
      else
        onSection(1);
      break;

    case action.climb:
      if (!Object.keys(Action[2]).includes("success")) {
        show("#climb_attempt");
        hide(".climb");

        break;
      }

      show(".climb");

      let success = Action[2].success;
      console.log(success);
      if (success === "success") {
        hide(".harmony");
        show("#climbing");
      }
      hide("#climb_attempt");
      
      break;

    case action.done:
      onSection(1);
      show("#game_over");
      break;
  }
}

const redo = () => {
  if (redos.length == 0) return hide("#redo");

  var action = redos.pop();
  actions.push(action);

  // Action(...) will wipe the redos array, so save and restore it
  var temp = redos;

  Action(action[0], action[1], action[2]);
  redos = temp;

  if (redos.length === 0) hide("#redo");
  else show("#redo");
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

  const one_eight_buttons = document.getElementById("one_eight_buttons").children;

  for (let i = 0; i < 8; i++) {
    let button = document.createElement("button");
    button.innerText = i + 1;
    button.onclick = () => Action(mode.auton, action.intake, { "id": i });
    button.id = `auton${i}`;

    let br = document.createElement("br");

    let t = (i < 3 ? 0 : 1);
    one_eight_buttons[t].append(button, br);
  }

  For("div > input[type=radio]", e => e.parentNode.onclick = () => e.click());
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
  let formData = stringifyData();

  document.getElementById("submit").href = `${sheetlink}?${entry}=${formData}`;
  For("#submit > button", e => { e.innerText = "Submit Again"; e.style.background = "red" });

  localStorage.setItem(`${data['team #']} ${data['match #']} ${Math.floor(Math.random() * 1000000)}`, formData);
  window.location.reload();
}
