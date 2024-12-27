document.addEventListener("DOMContentLoaded", () => {
  alert("inside pdf");
  const submitButton = document.getElementById("submit");

  submitButton.addEventListener("click", async () => {
    alert("submit click");
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
  alert("inside generatePDF");
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
    alert("inside try");
    const uploadedImage = await pdfDoc.embedPng(uploadedImageBytes);
    const uploadedImageDims = uploadedImage.scale(0.16);


        firstPg.drawImage(uploadedImage, {
      x: 400, // X-coordinate of where the image will be placed
      y: 350, // Y-coordinate of where the image will be placed
      width: uploadedImageDims.width,
      height: uploadedImageDims.height,
    });

    // Draw the student's name
    firstPg.drawText(name, {
      x: 200,
      y: 500,
      size: 24,
      font: myFontName,
      color: rgb(0, 0, 0),
    });

    // Draw the father's name
    firstPg.drawText(Fathers_Name, {
      x: 200,
      y: 470,
      size: 20,
      font: myFontFather,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Draw the issue date
    firstPg.drawText(Issue_Date, {
      x: 200,
      y: 440,
      size: 18,
      font: myFont,
      color: rgb(0, 0, 1),
    });

    // Draw the award designation
    firstPg.drawText(Awarded_To, {
      x: 200,
      y: 410,
      size: 20,
      font: myFont,
      color: rgb(0.2, 0.6, 0.2),
    });
  } catch (error) {
    console.error("Error embedding image into PDF:", error);
    alert("An error occurred while adding the image to the certificate.");
    return;
  }

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  // Trigger a download of the PDF
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}_Certificate.pdf`;
  a.click();

  URL.revokeObjectURL(url); // Clean up the URL object

  //   firstPg.drawImage(uploadedImage, {
  //     x: firstPg.getWidth() / 2 - uploadedImageDims.width / 2 + 164,
  //     y: firstPg.getHeight() / 2 - uploadedImageDims.height / 2 - 290,
  //     width: uploadedImageDims.width,
  //     height: uploadedImageDims.height,
  //     rotate: degrees(90), // Angle should be in radians, not degrees
  //     rotateOrigin: [315, 265] // Adjust rotation center to the text position
  //   });
  // } catch (error) {
  //   console.error("Error embedding PNG:", error);
  //   alert("Failed to embed the uploaded image. Ensure it's a valid PNG file.");
  //   return;
  // }

  // // Draw text
  // firstPg.drawText(name, {
  //   x: 355,
  //   y: 288,
  //   color: PDFLib.rgb(1, 0, 0),
  //   size: 52,
  //   font: myFontName,
  //   rotate: degrees(90), // Angle should be in radians, not degrees
  //   rotateOrigin: [315, 265] // Adjust rotation center to the text position
  // });

  // firstPg.drawText(Fathers_Name, {
  //   x: 409,
  //   y: 288,
  //   color: PDFLib.rgb(0.247, 0.188, 0.851),
  //   size: 35,
  //   font: myFontFather,
  //   rotate: degrees(90), // Angle should be in radians, not degrees
  //   rotateOrigin: [315, 265] // Adjust rotation center to the text position
  // });

  // firstPg.drawText(Issue_Date, {
  //   x: 512,
  //   y: 537,
  //   size: 20,
  //   font: myFont,
  //   rotate: degrees(90), // Angle should be in radians, not degrees
  //   rotateOrigin: [315, 265] // Adjust rotation center to the text position
  // });

  // const awardedToWidth = myFont.widthOfTextAtSize(Awarded_To, 16);
  // const awardedToX = (firstPg.getWidth() - awardedToWidth) / 2;
  // firstPg.drawText(Awarded_To, {
  //   x: 259,
  //   y: awardedToX + 115,
  //   size: 16,
  //   font: myFont,
  //   color: PDFLib.rgb(0.188, 0.851, 0.192),
  //   rotate: degrees(90), // Angle should be in radians, not degrees
  //   rotateOrigin: [315, 265] // Adjust rotation center to the text position
  // });

  // // Save the modified PDF
  // const uri = await pdfDoc.saveAsBase64({ dataUri: true });
  // saveAs(uri, name + ".pdf", { autoBom: true });
};
