# Image upload trimming and crop

> 이미지 업로드 전 트리밍 하여 크롭하고 등록하기

```text
프로젝트 진행중 인물사진 등록시 추후 공수를 줄이기 위해
파일의 크기 검증 및 트리밍 후 등록의 필요성으로 개발 진행
```

- 기능 구현할 내역

  - [ ] input file 및 drag and drop 으로 이미지 등록
  - [ ] 등록된 이미지 미리보기
  - [ ] 등록된 이미지의 크기 검증
    - [ ] 가로 세로 각 180px 이상
    - [ ] 정사각 혹은 세로로 긴 이미지 이어야됨
    - [ ] 가로로 긴 파일일 경우 경고 메시지 표시
  - [ ] 트리밍 버튼 클릭시 트리밍 영역 호출 - Cropper.js
  - [ ] 트리밍 이후 적용 버튼 클릭시 트리밍 된 부분을 등록 이미지로 교체
        (※ 확인사항 : 트리밍 도중에 가로 세로 px 크기 체크여부)
  - [ ] 트리밍 이전으로 돌릴수 있도록
