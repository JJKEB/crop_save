
function ImgCropper(){

}

const inputProfile = document.querySelector('#input_profile')
const inputProfileRe = document.querySelector('#input_profile_re')
const dropzone = document.querySelector('.dropzone')
const preview = document.querySelector('.preview')
const btnApply = document.querySelector('.btn--apply')
const btnTrimming = document.querySelector('.btn--trimming')

let cropper = null;

inputProfile.addEventListener('change', function(e){
  const file = getObjFile(e)
  if (file !== undefined) {
    previewFn(file, preview)
  }
});
dropzone.addEventListener('dragenter', function(e){
  console.log('dragenter');
  dropzone.animate({background: '#f00'}, 100)
})
dropzone.addEventListener('dragleave', function(e){
    console.log('dragleave');
    dropzone.animate({background: '#ccc'}, 100)
  });
dropzone.addEventListener('dragover', function(e){
    e.preventDefault();
})
dropzone.addEventListener('drop', function(e){
  e.preventDefault()
  const file = getObjFile(e)
  if (file !== undefined) {
    previewFn(file, preview)
  }
})

btnApply.addEventListener('click', function(){
  if (cropper !== null) {
    let imgSrc = cropper.getCroppedCanvas({
      width: 300, // input value
    }).toDataURL();  
    let img = document.createElement('img'); // create new image
        img.src = imgSrc;
        preview.innerHTML = '';  // clean wrapElement before
        preview.appendChild(img);  // append new image  
    const fileObj = dataURLtoFile(imgSrc, 'cropimg.jpg')
    console.log(fileObj);
  }
})

btnTrimming.addEventListener('click', function(){
  const img = preview.querySelector('img')
  if (img !== null) {
    cropper = new Cropper(img, {
      aspectRatio: 1 / 1,
      crop : function(event){
        // console.log(event.detail.x);
        // console.log(event.detail.y);
        // console.log(event.detail.width);
        // console.log(event.detail.height);
        // console.log(event.detail.rotate);
        // console.log(event.detail.scaleX);
        // console.log(event.detail.scaleY);
      }
    }); 
  }
})

function previewFn(file, wrapElement){
  const reader = new FileReader();
  reader.onload = function(e){
    if (e.target.result) {
      let img = document.createElement('img'); // create new image
      img.src = e.target.result;
      wrapElement.innerHTML = '';  // clean wrapElement before
      wrapElement.appendChild(img);  // append new image
      // cropper = new Cropper(img); // init cropper
    }
  };
  reader.readAsDataURL(file);
}

/**
 * - 이벤트로 부터 파일 객체 반환
 * @param {change, drop} event
 * @returns {Object File}
 */
function getObjFile(event){
  return event.dataTransfer !== undefined ? file = event.dataTransfer.files[0] : file = event.target.files[0];
}

/**
 * - base64 를 파일 객체로 변환해서 반환
 * @param {String base64} dataurl 
 * @param {String} fileName 
 * @returns {Object File}
 */
function dataURLtoFile(dataurl, fileName){
  let arr   = dataurl.split(','),
      mime  = arr[0].match(/:(.*?);/)[1],
      bstr  = atob(arr[1]),
      n     = bstr.length,
      u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, {type:mime});
}

/**
 * File 객체에서 'base64 문자열 반환'
 * 값이 없으면 '빈 문자열 반환'
 * @param {Object File} objFile
 * @returns {String base64}
 */
function getBase64(objFile){
  let base64String = ''
  if (objFile !== undefined) {
    const reader = new FileReader();
    reader.addEventListener("load", function (event) {
      if (event.target.result) {
        base64String = event.target.result
        getImgSize(base64String)
        return base64String
      }
    });
    reader.readAsDataURL(objFile);
  } else {
    return base64String
  }
}

function getImgSize(result) {
  const image = new Image()
  const size = {}
  image.src = result;
  console.log(image);
  base64 = result
  image.onload = function () {
    size.width = this.width
    size.height = this.height
    return size
  };
  return size
}
