const storeProductDetails = {
  'ALTER EGO REVERSIBLE ECHO BAG': {
    description: [
      '“ALTEREGO”의 주제에 맞춰 서로 다른 분위기를 지닌 리버서블 에코백을 디자인했습니다.',
      '겉면은 현대 사회 속에서 드러나는 차갑고 절제된 자아를 표현하기 위해 부담스럽지 않은 무채색 톤으로 구성하였고, 속면은 숨겨진 내면의 감정을 보여주듯 따뜻한 노란색과 밝은 프린팅을 활용해 발랄한 무드를 담아냈습니다.',
      '하나의 가방 안에서 상반된 두 자아가 공존하도록 디자인하여, “Alter Ego”라는 주제를 시각적으로 풀어내고자 했습니다.',
    ],
    details: [
      { label: 'SIZE', value: 'ONE SIZE' },
      { label: 'COMPOSITION', value: '겉면 Cotton 100% / 속면 Poly 65%, Cotton 35%' },
    ],
  },
  'Removable STICKER': {
    description: [
      '“가시화”라는 주제를 바탕으로 보이지 않는 감정과 내면의 형태를 그래픽으로 표현한 스티커입니다.',
      '날카롭고 유기적인 이미지들을 활용해 감정의 흐름과 에너지를 시각적으로 드러내고자 했습니다.',
    ],
    details: [
      { label: 'SIZE', value: '10 × 10 cm' },
      { label: 'COMPOSITION', value: 'Paper 100%' },
    ],
  },
  'ASCII T-SHIRT': {
    description: [
      '“가시 : 화 (花)”라는 주제를 바탕으로, 가시의 형상을 아스키 패턴으로 재해석한 티셔츠를 디자인했습니다.',
      '컬렉션의 컨셉과 팀원 각자의 진솔한 이야기를 텍스트로 풀어내어 하나의 패턴으로 완성하였고, 이를 실크스크린 기법으로 담아냈습니다.',
      '절제된 무채색 톤 위로 텍스트 레이어를 겹겹이 쌓아 감각적이면서도 차분한 무드를 표현했으며, 단순한 그래픽을 넘어 서로의 서사를 공유하는 하나의 기록물로서 의미를 담았습니다.',
      '각자의 이야기가 모여 완성된, 깊은 의미를 지닌 티셔츠입니다.',
    ],
    optionLabel: '사이즈',
    options: [
      { label: 'M (95)', value: 'M (95)' },
      { label: 'XL (105)', value: 'XL (105)' },
    ],
    details: [
      { label: 'SIZE', value: 'M (95) / XL (105)' },
      { label: 'COMPOSITION', value: 'Cotton 100% - 20수' },
    ],
  },
  'Acrylic KEYRING': {
    description: [
      '“가시화”와 관련된 주제와 이미지를 바탕으로, 구조적인 모양의 아크릴 키링 속에 팀의 무드를 담은 일러스트를 넣었습니다.',
      '가시화의 “화”, 즉 꽃을 암시하는 참 장식과 대표 색상인 버건디 가죽끈을 함께 구성했습니다.',
    ],
    details: [
      { label: 'SIZE', value: '3.5 × 11 cm' },
      { label: 'COMPOSITION', value: 'Acrylic 100%' },
    ],
  },
};

export const getStoreProductDetail = (item) => {
  if (!item?.name) {
    return {};
  }

  return storeProductDetails[item.name] || {};
};
