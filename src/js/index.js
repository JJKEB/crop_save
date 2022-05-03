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


if (window.Element && !Element.prototype.closest) {
  Element.prototype.closest = 
  function(s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i,
          el = this;
      do {
          i = matches.length;
          while (--i >= 0 && matches.item(i) !== el) {};
      } while ((i < 0) && (el = el.parentElement)); 
      return el;
  };
}


/**
 * Requid : Cropper.js
 * @param {string: selector} cropButton
 * 1. crop 버튼과 미리보기 이미지를 포괄로 감싸는 요소에 "cropper__wrap 클래스 지정"
 * 2. 미리보기 "이미지는 base64" 로 변환 되어있어야 합니다.
 * 3. 미리보기 "이미지를 감싸는 직계 부모 요소에 preview 클래스 지정"
 */
function ImgCropper(cropButton, ratio){
  this.body = document.querySelector('body');
  this.btnCrop = document.querySelector(cropButton);
  this.wrap = this.btnCrop.closest('.cropper__wrap'); // 미리보기 이미지와 크롭하기 버튼을 감싼 요소
  this.previewImg = null; // 미리보기 이미지
  this.existSrc = null; // 등록된 이미지 (base64)
  this.cropedSrc = null; // 크롭된 이미지 (base64)
  this.popupWrap = null;  // cropper 담을 레이어 팝업 요소
  this.ratio = ratio; // 크롭할 비율
  this.cropper = null;  // new Cropper
  this.file = null; // 크롭된 이미지 (File object)

  this.init();
}
ImgCropper.prototype.init = function(){
  const __this = this;

  this.btnCrop.addEventListener('click', function(){
    /* 새로운 이미지가 등록될수 있어서 이벤트 발생시 마다 조회 */
    __this.previewImg = __this.wrap.querySelector('.preview img');
    if (__this.previewImg === null) {
      console.log('이미지가 등록되지 않았습니다.');
      return false;
    }
    if (!__this.previewImg.src.includes('data:image')) {
      console.log('편집 가능한 이미지가 아닙니다.');
      return false;
    }    
    /* 이전 이미지 데이터가 없거나 새로운 이미지가 등록됬을시 혹은 크롭한 적이 없을때만 이미지 데이터 교체 */
    if ((__this.existSrc === null || __this.existSrc !== __this.previewImg.src) && __this.previewImg.src !== __this.cropedSrc ) __this.existSrc = __this.previewImg.src

    /* 크롭 팝업이 이미 있다면 초기화 */
    const cropperPopups = document.querySelectorAll(".crop_popup");
    if (cropperPopups.length > 0) {
      cropperPopups.forEach(function(el){el.remove()});
      __this.popupWrap = null
    }

    /* 크롭 팝업 호출 */
    __this.cropPopup('open')
  });
}
ImgCropper.prototype.cropPopup = function(how){
  const __this = this;

  if (how === 'open') {
    __this.popupWrap = Object.assign(document.createElement("div"), {className:"crop_popup"});
    const popupWrap_inner = Object.assign(document.createElement("div"), {className:"crop_popup__inner"});
    const cropperImg_wrap = Object.assign(document.createElement("div"), {className:"crop_popup__img"});
    const btnClose = Object.assign(document.createElement("button"), {className:"btn_crop_close", type: 'button', textContent:"닫기"});
    const btnApply = Object.assign(document.createElement("button"), {className:"btn_crop_apply", type: 'button', textContent:"적용하기"});
    const cropperImg = new Image();
    cropperImg.src = __this.existSrc;

    cropperImg_wrap.appendChild(cropperImg);
    popupWrap_inner.appendChild(cropperImg_wrap);
    popupWrap_inner.appendChild(btnClose);
    popupWrap_inner.appendChild(btnApply);
    __this.popupWrap.appendChild(popupWrap_inner);
    __this.body.appendChild(__this.popupWrap);
    
    __this.cropper = new Cropper(cropperImg, {
      aspectRatio: __this.ratio,
      viewMode: 1,
      ready: function () {
        croppable = true;
        __this.popupWrap.classList.add('active')
      },
      crop : function(event){
        // console.log(event.detail.x);
        // console.log(event.detail.y);
        // console.log(event.detail.width);
        // console.log(event.detail.height);
        // console.log(event.detail.rotate);
        // console.log(event.detail.scaleX);
        // console.log(event.detail.scaleY);
      },      
    });

    btnClose.addEventListener('click', function(){
      __this.cropPopup('close')
    });
    btnApply.addEventListener('click', function(){
      if (__this.cropper !== null) {
        __this.cropedSrc = __this.cropper.getCroppedCanvas({
          width: 380, // input value
        }).toDataURL();
        __this.previewImg.src = __this.cropedSrc;
        __this.file = __this.dataURLtoFile(__this.cropedSrc, 'cropimg.jpg')
        console.log(__this.file);
      }
      __this.cropPopup('close')
    });
  }
  if (how === 'close') {
    __this.popupWrap.classList.remove('active')
    __this.popupWrap.remove()
    __this.popupWrap = null
  }
}
ImgCropper.prototype.dataURLtoFile = function(dataurl, fileName){
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

const profileCrop1 = new ImgCropper('.btn--crop1', 1);
const profileCrop2 = new ImgCropper('.btn--crop2', 6/3.85);
