
const inputProfile = document.querySelector('#input_profile')
const dropzone = document.querySelector('.dropzone')

inputProfile.addEventListener('change', function(e){
  console.log(e);
  getFileInfo(e)

});
dropzone.addEventListener('dragover', function(e){
  e.preventDefault();
})
dropzone.addEventListener('drop', function(e){
  e.preventDefault()
  getFileInfo(e)
})

var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(.jpg|.png|.gif)$");

function getFileInfo(e){
  // console.log(e);
  // console.log(e.type);
  // console.log(e.target);
  // console.log(e.dataTransfer);

  // regex.test(fileUpload.value.toLowerCase())

  console.log(e.target.files);

  let file = null;
  e.dataTransfer !== undefined ? file = e.dataTransfer.files[0] : file = e.target.files[0];

  console.log(file);

  if (file !== undefined) {
    const reader = new FileReader();
    reader.addEventListener("load", function (event) {
      if (event.target.result) {
        console.log(event.target);
        getImgInfo(event.target.result)
      }
    });
    reader.readAsDataURL(file);

  }

  
  /* const file = e.target.files[0];
  const file2 = e.dataTransfer.files[0];
  console.log(file);
  console.log(file2);
  console.log(reader);

  
  reader.readAsDataURL(file); */
  // reader.readAsDataURL(e.dataTransfer.files[0]);
}

function getImgInfo(result) {
  const image = new Image()

  //Set the Base64 string return from FileReader as source.
  image.src = result;
                       
  //Validate the File Height and Width.
  image.onload = function () {
    var height = this.height;
    var width = this.width;

    console.log(this);
    console.log(width);
    console.log(height);
  };
}
