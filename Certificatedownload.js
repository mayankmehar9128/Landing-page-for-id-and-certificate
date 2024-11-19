document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("submit");

  submitButton.addEventListener("click", async () => {
    const inputName = document.querySelector("#name");
    const inputIssueDate = document.querySelector("#Issue_Date");
    const inputFathersName = document.querySelector("#father_name");
    const inputAwardedTo = document.querySelector("#awarded_to");
    const inputImage = document.getElementById("image");

    if (!inputName || !inputIssueDate || !inputFathersName || !inputAwardedTo || !inputImage) {
      alert("Some input fields are missing. Please check your form.");
      return;
    }

    const name = inputName.value.trim();
    const issuedate = inputIssueDate.value.trim();
    const fathername = inputFathersName.value.trim();
    const awardedto = inputAwardedTo.value.trim();
    const imageFile = inputImage.files[0];

    if (name && issuedate && fathername && awardedto && imageFile) {
      try {
        const imageBytes = await imageFile.arrayBuffer();
        generatePDF(name, fathername, issuedate, awardedto, imageBytes);
      } catch (error) {
        console.error("Error processing form data:", error);
        alert("An error occurred while generating the certificate.");
      }
    } else {
      alert("Please fill out all fields and upload an image to generate the certificate.");
    }
  });
});

const generatePDF = async (
  name,
  Fathers_Name,
  Issue_Date,
  Awarded_To,
  uploadedImageBytes
) => {
  const { PDFDocument, rgb } = PDFLib; // Import rgb here

  // Fetch certificate PDF
  const exBytes = await fetch("./CMC_NEW_Certificate_Latest.pdf").then(
    (res) => res.arrayBuffer()
  );

  // Fetch fonts
  const exFont = await fetch("./Sanchez-Regular.ttf").then((res) =>
    res.arrayBuffer()
  );
  const exFontName = await fetch("./Yellowtail-Regular.ttf").then((res) =>
    res.arrayBuffer()
  );
  const exFontFather = await fetch(
    "./YanoneKaffeesatz-VariableFont_wght.ttf"
  ).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(exBytes);
  pdfDoc.registerFontkit(fontkit);

  // Embed fonts
  const myFont = await pdfDoc.embedFont(exFont);
  const myFontName = await pdfDoc.embedFont(exFontName);
  const myFontFather = await pdfDoc.embedFont(exFontFather);

  const pages = pdfDoc.getPages();
  const firstPg = pages[0];

  const { degrees } = PDFLib;

  // Embed uploaded image
  try {
    const uploadedImage = await pdfDoc.embedPng(uploadedImageBytes);
    const uploadedImageDims = uploadedImage.scale(0.16);

    firstPg.drawImage(uploadedImage, {
      x: firstPg.getWidth() / 2 - uploadedImageDims.width / 2 + 164,
      y: firstPg.getHeight() / 2 - uploadedImageDims.height / 2 - 290,
      width: uploadedImageDims.width,
      height: uploadedImageDims.height,
      rotate: degrees(90), // Angle should be in radians, not degrees
      rotateOrigin: [315, 265] // Adjust rotation center to the text position
    });
  } catch (error) {
    console.error("Error embedding PNG:", error);
    alert("Failed to embed the uploaded image. Ensure it's a valid PNG file.");
    return;
  }

  // Draw text
  firstPg.drawText(name, {
    x: 356,
    y: 288,
    color: PDFLib.rgb(1, 0, 0),
    size: 52,
    font: myFontName,
    rotate: degrees(90), // Angle should be in radians, not degrees
    rotateOrigin: [315, 265] // Adjust rotation center to the text position
  });

  firstPg.drawText(Fathers_Name, {
    x: 409,
    y: 288,
    color: PDFLib.rgb(0.247, 0.188, 0.851),
    size: 35,
    font: myFontFather,
    rotate: degrees(90), // Angle should be in radians, not degrees
    rotateOrigin: [315, 265] // Adjust rotation center to the text position
  });

  firstPg.drawText(Issue_Date, {
    x: 512,
    y: 537,
    size: 20,
    font: myFont,
    rotate: degrees(90), // Angle should be in radians, not degrees
    rotateOrigin: [315, 265] // Adjust rotation center to the text position
  });

  const awardedToWidth = myFont.widthOfTextAtSize(Awarded_To, 16);
  const awardedToX = (firstPg.getWidth() - awardedToWidth) / 2;
  firstPg.drawText(Awarded_To, {
    x: 259,
    y: awardedToX + 115,
    size: 16,
    font: myFont,
    color: PDFLib.rgb(0.188, 0.851, 0.192),
    rotate: degrees(90), // Angle should be in radians, not degrees
    rotateOrigin: [315, 265] // Adjust rotation center to the text position
  });

  // Save the modified PDF
  const uri = await pdfDoc.saveAsBase64({ dataUri: true });
  saveAs(uri, name + ".pdf", { autoBom: true });
};







// const generatePDF = async (name, Fathers_Name, Issue_Date, Awarded_To, uploadedImageBytes) => {    //uploadedImageBytes//
//     const { PDFDocument } = PDFLib;

//     // Fetching the certificate into website
//     const exBytes = await fetch("./cmcnewlatestversioncert.pdf").then((res) => {
//         return res.arrayBuffer();
//     });

//     // Fetching the font into website using promise function
//     const exFont = await fetch("./Sanchez-Regular.ttf").then((res) => {
//         return res.arrayBuffer();
//     });

//     const exFontName = await fetch("./Yellowtail-Regular.ttf").then((res) => {
//         return res.arrayBuffer();
//     });

//     const exFontFather = await fetch("./YanoneKaffeesatz-VariableFont_wght.ttf").then((res) => {
//         return res.arrayBuffer();
//     });

//     const pdfDoc = await PDFDocument.load(exBytes);

//     pdfDoc.registerFontkit(fontkit);
//     const myFont = await pdfDoc.embedFont(exFont);
//     const myFontName = await pdfDoc.embedFont(exFontName);
//     const myFontFather = await pdfDoc.embedFont(exFontFather);

//     const pages = pdfDoc.getPages();
//     const firstPg = pages[0];

//     // Embed uploaded image into the PDF document
//     const uploadedImage = await pdfDoc.embedPng(uploadedImageBytes);
//     const uploadedImageDims = uploadedImage.scale(0.18);


//     const { degrees } = PDFLib;
//     const { rgb } = PDFLib;

//     // Draw text and uploaded image on the certificate
//     firstPg.drawText(name, {
//         x: 356,
//         y: 295,
//         color: rgb(1, 0, 0), // Red color
//         size: 40,
//         weight: 100,
//         font: myFontName,
//         rotate: degrees(90), // Angle should be in radians, not degrees
//         rotateOrigin: [315, 265] // Adjust rotation center to the text position
        
//     });


//     firstPg.drawText(Fathers_Name, {
//         x: 409,
//         y: 288,
//         // color: rgb(255,255,255),
//         color:rgb(0.247, 0.188, 0.851),
//         size: 35,
//         weight: 500,
//         font: myFontFather,
//         rotate: degrees(90), // Angle should be in radians, not degrees
//         rotateOrigin: [315, 265] // Adjust rotation center to the text position
        
//     });


    
//     firstPg.drawText(Issue_Date, {
//         x: 512,
//         y: 537,
//         size: 20,
//         weight: 100,
//         font: myFont,
//         rotate: degrees(90), // Angle should be in radians, not degrees
//         rotateOrigin: [315, 265] // Adjust rotation center to the text position
//     });



//     // Dynamically calculate the x-position for center alignment
//     const awardedToWidth = myFont.widthOfTextAtSize(Awarded_To, 16);
//     const awardedToX = (firstPg.getWidth() - awardedToWidth) / 2;
    
//     firstPg.drawText(Awarded_To, {
//         x: 259,
//         y: awardedToX + 115,
//         size: 16,
//         weight: 100,
//         font: myFont,
//         color:rgb(0.5, 0.100, 0.5), // purple color
//         rotate: degrees(90),
//         rotateOrigin: [315, 265]
//     });


//     // firstPg.drawText(Awarded_To, {
//     //     x: 259,
//     //     y: 350,
//     //     size: 16,
//     //     weight: 100,
//     //     font: myFont,
//     //     rotate: degrees(90), // Angle should be in radians, not degrees
//     //     rotateOrigin: [315, 265] // Adjust rotation center to the text position
//     // });

    

//     firstPg.drawImage(uploadedImage, {
//         x: firstPg.getWidth() / 2 - uploadedImageDims.width / 2 + 164,
//         y: firstPg.getHeight() / 2 - uploadedImageDims.height / 2 - 290,
//         width: uploadedImageDims.width,
//         height: uploadedImageDims.height,
//         rotate: degrees(90), // Angle should be in radians, not degrees
//         rotateOrigin: [315, 265] // Adjust rotation center to the text position
//     });

//     const getname = document.querySelector("#name").value;

//     // Save the modified PDF
//     const uri = await pdfDoc.saveAsBase64({ dataUri: true });
//     saveAs(uri, getname+".pdf", { autoBom: true });

// };


// const submitButton = document.getElementById("submit");
// const inputName = document.querySelector("#name");
// const inputIssueDate = document.querySelector("#Issue_Date");
// const inputFathersName = document.querySelector("#Fathers_Name");
// const inputAwardedTo = document.querySelector("#Awarded_To");
// const inputImage = document.getElementById("image");

// submitButton.addEventListener("click", async () => {
//     const name = inputName.value;
//     const issuedate = inputIssueDate.value;
//     const fathername = inputFathersName.value;
//     const awardedto = inputAwardedTo.value;
//     const imageFile = inputImage.files[0];
//     const imageBytes = await imageFile.arrayBuffer();

//     if (name.trim() !== "" && fathername.trim() !== "" && issuedate.trim() !== "" && awardedto.trim() !== "" && imageFile) {
//         const imageBytes = await imageFile.arrayBuffer();
//         generatePDF(name, fathername, issuedate, awardedto, imageBytes);
//         alert(name + ", your customized certificate is being generated. Please wait for the download to start.");
//     } else {
//         alert("Please enter your name, date and upload an image to generate the certificate.");
//     }

//     // alert(name + "your certificate is downloaded check it thank for visit");
//     // generatePDF(name, issuedate);
// });


// generatePDF("Mayank Mehar");
