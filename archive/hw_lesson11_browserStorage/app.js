class Tracker {
  static trackerList = [];
  static dataFromLocalStorage = [];

  name = "";
  id = "";
  isPause = false;
  startTime;

  seconds = 0;
  time = 0;

  timer = "";
  lsMode;

  #span;
  #tracker;
  #pauseBtn;
  #removeBtn;

  constructor(
    name,
    seconds = 0,
    isPause = false,
    startTime = "",
    lsMode = false
  ) {
    this.name = name;
    this.seconds = seconds;
    this.isPause = isPause;
    this.startTime = new Date(startTime);
    this.lsMode = lsMode;

    this.id = this.idGenerator();
    this.createTimer();

    if (isPause) {
      this.addStyle();
      this.lsMode = false;
      this.startTime = new Date();
    } else {
      this.startTimer();
    }
    this.convertAndSetTime(seconds);
  }

  static addDataToLocalStorage() {
    localStorage.removeItem("tracker list");
    localStorage.setItem("tracker list", JSON.stringify(Tracker.trackerList));
  }

  static getDataFromLocalStorage() {
    const save = JSON.parse(localStorage.getItem("tracker list"));
    if (save) {
      Tracker.dataFromLocalStorage = save.reverse();
      if (Tracker.trackerList) {
        Tracker.trackerList.map((tracker) => {
          tracker.destroyTracker();
        });
      }
      Tracker.dataFromLocalStorage.map((tracker) => {
        this.createNewTracer(
          tracker.name,
          tracker.seconds,
          tracker.isPause,
          tracker.startTime,
          true
        );
      });
    }
  }
  static createNewTracer(name, seconds, isPause, startTime, lsMode) {
    const newTracer = new Tracker(name, seconds, isPause, startTime, lsMode);
    Tracker.trackerList.unshift(newTracer);
  }

  startTimer() {
    if (this.timer) return;

    if (!this.lsMode) this.startTime = new Date();

    this.isPause = false;
    this.lsMode = false;
    this.timer = setInterval(() => {
      this.convertAndSetTime(this.time);
      if (this.time >= 360000) this.destroyTracker();
    }, 1000);
    this.removeStyle();
  }

  convertAndSetTime() {
    const currentTime = new Date();
    this.time =
      +((currentTime.getTime() - this.startTime.getTime(0)) / 1000).toFixed(0) +
      this.seconds;

    let hh = Math.floor(this.time / 3600);
    let mm = Math.floor((this.time - hh * 3600) / 60);
    let ss = this.time - hh * 3600 - mm * 60;

    const message = `${(hh = hh < 10 ? "0" + hh : hh)}:${(mm =
      mm < 10 ? "0" + mm : mm)}:${(ss = ss < 10 ? "0" + ss : ss)}`;
    this.span.innerHTML = message;
  }

  stopTimer() {
    this.isPause = true;
    this.seconds = this.time;
    clearInterval(this.timer);
    this.timer = "";
    this.addStyle();
  }

  createTimer() {
    const trackers = document.querySelector("#trackers");
    this.tracker = this.createEl(trackers, "div", "trackers__tracker", 1);

    const p = this.createEl(this.tracker, "p");
    this.span = this.createEl(this.tracker, "span");

    const buttons = this.createEl(this.tracker, "div", "buttons");

    this.pauseBtn = this.createEl(buttons, "button", "pause-btn");
    this.removeBtn = this.createEl(buttons, "button", "remove-btn");
    this.pauseBtn.dataset["id"] = this.id;
    this.removeBtn.dataset["id"] = this.id;

    p.innerHTML = this.name;
    this.span.innerHTML = "00:00:00";
  }

  createEl(fatherEl, selector, classEl = null, mode = 0) {
    const newEl = document.createElement(selector);
    classEl ? newEl.classList.add(classEl) : null;
    mode === 0 ? fatherEl.append(newEl) : fatherEl.prepend(newEl);
    return newEl;
  }

  destroyTracker() {
    this.tracker.remove();
    this.constructor.trackerList = this.constructor.trackerList.filter(
      (tracker) => tracker.id !== this.id
    );
    clearInterval(this.timer);
  }

  idGenerator() {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4() + S4();
  }

  addStyle() {
    this.tracker.classList.add("pause");
  }

  removeStyle() {
    this.tracker.classList.remove("pause");
  }
}

const form = document.forms["form"];
const allTrackers = document.querySelector(".trackers");
const mainInput = document.querySelector("#main-input");

// local storage
Tracker.getDataFromLocalStorage();

// event listeners
allTrackers.addEventListener("click", (event) => {
  const currentId = event.target.dataset["id"];
  if (event.target.classList.contains("pause-btn")) {
    Tracker.trackerList.map((tracer) => {
      if (tracer.id === currentId) {
        tracer.isPause ? tracer.startTimer() : tracer.stopTimer();
        Tracker.addDataToLocalStorage();
      }
    });
  }

  if (event.target.classList.contains("remove-btn")) {
    Tracker.trackerList.map((tracer) => {
      if (tracer.id === currentId) {
        tracer.destroyTracker();
        Tracker.addDataToLocalStorage();
      }
    });
  }
  Tracker.getDataFromLocalStorage();
});

mainInput.addEventListener("click", (event) => {
  event.preventDefault();
  Tracker.createNewTracer(
    form.elements.name.value
      ? form.elements.name.value
      : new Date().toLocaleString()
  );
  form.elements.name.value = null;
  Tracker.addDataToLocalStorage();
});

window.addEventListener("unload", Tracker.addDataToLocalStorage);

window.onstorage = () => {
  Tracker.getDataFromLocalStorage();
};
