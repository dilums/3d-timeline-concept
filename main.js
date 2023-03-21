let scene, camera, renderer, controls;
const range = (n) =>
  Array(n)
    .fill(0)
    .map((i, j) => i + j);
const randInt = (max, min = 0) => Math.floor(min + Math.random() * (max - min));

function init() {
  const { innerHeight, innerWidth } = window;
  scene = new THREE.Scene();
  renderer = new THREE.CSS3DRenderer();
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);
  camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 1, 10000);
  camera.position.set(0, 500, 9000);
  let controls = new THREE.OrbitControls(camera, renderer.domElement);
  create_grid();
  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  const { innerWidth, innerHeight } = window;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}

const months = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER"
];
const m_colors = [
  "#611352",
  "#264463",
  "#361555",
  "#252255",
  "#532564",
  "#515146",
  "#452646",
  "#563311",
  "#321335",
  "#362636",
  "#453355",
  "#124614"
];

function create_grid() {
  getData().forEach((item) => {
    var card = document.createElement("div");
    card.className = "day-card";
    card.style.backgroundColor = m_colors[item.month - 1];

    var day = document.createElement("div");
    day.className = "day";
    day.textContent = item.day;
    card.appendChild(day);

    var topic = document.createElement("div");
    topic.className = "topic";
    topic.textContent = item.topic;
    card.appendChild(topic);

    var image_container = document.createElement("div");
    image_container.className = "image_container";
    image_container.innerHTML = `<img src="${item.image}" alt="">`;
    card.appendChild(image_container);

    var details = document.createElement("div");
    details.className = "details";
    details.innerHTML = item.details;
    card.appendChild(details);

    var css_object = new THREE.CSS3DObject(card);
    css_object.position.x = -1800 + ((item.day - 1) % 7) * 600;
    css_object.position.y = 1000 - Math.floor((item.day - 1) / 7) * 500;
    css_object.position.z = (12 - item.month) * 500;
    scene.add(css_object);
  });

  for (let i = 0; i < months.length; i++) {
    var month_element = document.createElement("div");
    month_element.className = "month";
    month_element.style.backgroundColor = m_colors[i];
    var details = document.createElement("p");
    month_element.innerHTML = months[i];
    month_element.appendChild(details);
    var object = new THREE.CSS3DObject(month_element);
    object.position.x = 0;
    object.position.y = 1400;
    object.position.z = (11 - i) * 500;
    scene.add(object);
  }
}
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

function getData() {
  return range(12).reduce((allMonths, curMonth) => {
    const days = range(30).reduce((allDays, day) => {
      if (Math.random() > 0.6) {
        return [
          ...allDays,
          {
            month: curMonth + 1,
            day: day + 1,
            topic: range(randInt(2, 4))
              .map(() => capitalize(randomWord()))
              .join(" "),
            image: `https://s3-us-west-2.amazonaws.com/s.cdpn.io/3685267/timeline-${randInt(
              20
            )}.jpg`,
            details: paragraph()
          }
        ];
      }
      return allDays;
    }, []);
    return [...allMonths, ...days];
  }, []);
}

init();
render();
