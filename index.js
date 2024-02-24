var counts = {};

const onSection = (id) => {
  document.body.setAttribute("data-section", id);
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
