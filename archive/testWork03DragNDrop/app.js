const MAX_FILE_SIZE = 10; // max size file (mb)
const dndArea = document.querySelector("#drag-n-drop-area");
const previewContainer = document.querySelector("#preview-container");
const error = document.querySelector(".error");
const typeFiles = [
  "application/vnd.ms-excel",
  "image/png",
  "image/jpeg",
  "text/plain",
];
let files = [];
let selectedItem;
let showErrTimeout;

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dndArea.addEventListener(eventName, (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (eventName === "dragenter") {
      event.target.classList.add("area-drag-enter");
    }
    if (eventName === "dragleave" || eventName === "drop") {
      event.target.classList.remove("area-drag-enter");
    }
  });
});

dndArea.addEventListener("drop", (event) => {
  const dt = event.dataTransfer;
  files = filesFilter([...dt.files]);

  files.forEach(previewFiles);
});

function previewFiles(file) {
  const thumbnailLength = document.querySelectorAll(".thumbnail").length;
  if (thumbnailLength >= 10) return;

  const fileContainer = document.createElement("div");
  const img = document.createElement("img");

  fileContainer.appendChild(img);

  img.src = fileExtension(file.name, "txt")
    ? "style/img/txt.png"
    : fileExtension(file.name, "csv")
    ? "style/img/csv.png"
    : URL.createObjectURL(file);

  fileContainer.classList.add("thumbnail");
  previewContainer.appendChild(fileContainer);
  addDragNDropEvents(fileContainer);
  addRemoveButton(fileContainer);
}

function fileExtension(fileName, extension) {
  const regex = new RegExp(`(.*)\.${extension}`);
  return regex.test(fileName);
}

function addDragNDropEvents(newElement) {
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    newElement.addEventListener(eventName, (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
  });

  newElement.addEventListener("mousedown", (event) => {
    selectedItem = event.target;
  });

  newElement.addEventListener("drop", (event) => {
    const temp = event.target.cloneNode();

    event.target.before(temp);
    selectedItem.before(event.target);
    temp.before(selectedItem);
    temp.remove();
  });
}

function addRemoveButton(newElement) {
  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-btn");
  newElement.appendChild(removeBtn);
  removeBtn.addEventListener("click", (event) => {
    event.target.parentNode.remove();
  });
}

fileEl.addEventListener("change", ({ target: { files } }) => {
  filesFilter([...files]).forEach(previewFiles);
});

function filesFilter(files) {
  const lengthBeforeFilter = files.length;
  files = files.filter(
    (file) =>
      typeFiles.includes(file.type) && file.size <= MAX_FILE_SIZE * 1000000
  );
  if (files.length !== lengthBeforeFilter) {
    clearTimeout(showErrTimeout);
    error.firstElementChild.style.display = "block";
    showErrTimeout = setTimeout(() => {
      error.firstElementChild.style.display = "none";
    }, 2500);
  }
  return files;
}
