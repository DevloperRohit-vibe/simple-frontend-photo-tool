const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const previewContainer = document.querySelector(".preview-container");

const faceCanvas = document.getElementById("faceCanvas");
const ctx = faceCanvas.getContext("2d");

const detectButton = document.getElementById("detectButton");

const fileName = document.getElementById("fileName");
const status = document.getElementById("status");
const result = document.getElementById("result");
const ip = document.getElementById("ip");
const port = document.getElementById("port");

// detectButton.disabled = true

// // --------------------------------------------------
// // Backend URL
// // --------------------------------------------------

// const API_URL = "https://dp-uyyp.onrender.com/detect-face";

// // --------------------------------------------------
// // Selected Image
// // --------------------------------------------------

// let selectedFile = null;

// // --------------------------------------------------
// // Image Selection
// // --------------------------------------------------

// imageInput.addEventListener("change", () => {
//   const file = imageInput.files[0];

//   if (!file) {
//     return;
//   }

//   selectedFile = file;

//   fileName.textContent = file.name;

//   const imageURL = URL.createObjectURL(file);

//   previewImage.src = imageURL;

//   previewContainer.style.display = "block";

//   result.textContent = "";

//   status.textContent = "Image ready. Click Detect Faces.";

//   clearCanvas();
// });

// // --------------------------------------------------
// // Image Loaded
// // --------------------------------------------------

// previewImage.addEventListener("load", () => {
//   faceCanvas.width = previewImage.naturalWidth;
//   faceCanvas.height = previewImage.naturalHeight;

//   clearCanvas();
// });

// // --------------------------------------------------
// // Detect Faces
// // --------------------------------------------------

// detectButton.addEventListener("click", async () => {
//   if (!selectedFile) {
//     status.textContent = "Please select an image first.";

//     return;
//   }

//   // ----------------------------------------------
//   // Prepare FormData
//   // ----------------------------------------------

//   const formData = new FormData();

//   formData.append("image", selectedFile);

//   // ----------------------------------------------
//   // UI
//   // ----------------------------------------------

//   detectButton.disabled = true;

//   status.textContent = "Detecting faces...";

//   result.textContent = "";

//   clearCanvas();

//   try {
//     // ------------------------------------------
//     // Send image to Flask
//     // ------------------------------------------

//     const response = await fetch(API_URL, {
//       method: "POST",
//       body: formData,
//     });

//     // ------------------------------------------
//     // Convert response to JSON
//     // ------------------------------------------

//     const data = await response.json();

//     // ------------------------------------------
//     // Handle API error
//     // ------------------------------------------

//     if (!response.ok || !data.success) {
//       throw new Error(data.error || "Face detection failed.");
//     }

//     // ------------------------------------------
//     // Display result
//     // ------------------------------------------

//     result.textContent = `Faces detected: ${data.faces_detected}`;

//     status.textContent = "Detection completed.";

//     // ------------------------------------------
//     // Draw bounding boxes
//     // ------------------------------------------

//     drawFaces(data.faces);
//   } catch (error) {
//     console.error(error);

//     status.textContent = "Could not connect to the backend.";

//     result.textContent = error.message;
//   } finally {
//     detectButton.disabled = false;
//   }
// });

// // --------------------------------------------------
// // Draw Face Bounding Boxes
// // --------------------------------------------------

// function drawFaces(faces) {
//   if (!faces || faces.length === 0) {
//     return;
//   }

//   const scaleX = faceCanvas.width / previewImage.naturalWidth;

//   const scaleY = faceCanvas.height / previewImage.naturalHeight;

//   ctx.lineWidth = 4;

//   faces.forEach((face) => {
//     const x = face.x * scaleX;
//     const y = face.y * scaleY;

//     const width = face.width * scaleX;
//     const height = face.height * scaleY;

//     ctx.strokeStyle = "#00ff00";

//     ctx.strokeRect(x, y, width, height);
//   });
// }

// // --------------------------------------------------
// // Clear Canvas
// // --------------------------------------------------

// function clearCanvas() {
//   ctx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
// }

let selectedFile = null;
imageInput.addEventListener("change", () => {
  selectedFile = imageInput.files[0];
    fileName.textContent = selectedFile.name;

  const imageURL = URL.createObjectURL(selectedFile);

  previewImage.src = imageURL;

  previewContainer.style.display = "block";
});


detectButton.addEventListener("click", () => {
  if (!selectedFile) {
    console.log("Please Upload The File First");
  } else {
    const reader = new FileReader();
    reader.onload = (e) => {
      findface(e.target.result);
    };
    reader.readAsDataURL(selectedFile);
  }
});

async function findface(base64string) {
  console.log(ip.value,port.value);
  
  try {
    const response = await fetch(`http://${ip.value}:${port.value}/`, {
      method: "POST",
      body: base64string,
    });
    const output = await response.json();
    const source = `${output.prefix},${output.image}`;
    
    previewImage.src = source;
    fileName.textContent = `Angle: ${output.angle}°`;
    console.log("done set");

  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("Network Error: The URL is incorrect or the server is completely shut down.");
    } else {
      // Handles other unexpected code errors (like response.json() parsing failure)
      console.error("An unexpected error occurred:", error.message);
    }
    
  }
}
