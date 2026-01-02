# 구글러가 설명하는 놀라운 Veo 비디오를 위한 "메타 프롬프트" 방법

*Google DeepMind UX 엔지니어 Anna Bortsova는 Gemini에게 비디오를 위한 상세한 프롬프트 작성을 요청합니다 — 그리고 그 결과는 눈을 뗄 수 없을 정도입니다.*

*작성: Joel Meares, The Keyword 기고자*

<iframe src="https://www.youtube.com/embed/v16SjcdFlO0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

*종이로 렌더링된 장면 속 연못에 서 있는 분홍색 플라밍고.*

구글러들이 모든 종류의 새로운 AI 데모를 공유하는 내부 채팅 그룹이 있습니다. 어떤 날에는 당신이 보여준 책을 기반으로 음악을 추천하는 도구를 찾을 수 있고; 또 어떤 날에는 나이 든 자신과 젊은 자신이 함께 어울리는 사진을 생성하는 앱을 발견할 수 있습니다.

많은 날들에, 당신은 Google DeepMind UX 엔지니어 Anna Bortsova의 작품들을 발견하게 될 것입니다.

엔지니어링과 시각 예술 배경을 가진 Anna는 우리의 AI 도구들로 실험하는 것을 좋아합니다. 그녀는 정교한 자수로 만들어진 각 글자가 있는 AI 생성 알파벳과 인기 디지털 게임들의 초현실주의적 해석을 공유해왔습니다.

<div class="image-gallery">
  <figure>
    <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Gemini_Generated_Image_amppnn.max-1600x1600.format-webp.webp" alt="회전목마 조랑말들이 가지에 매달려 있는 나무를 둘러싼 롤러코스터를 보여주는 AI 이미지.">
    <figcaption>사랑스러운 초현실주의 이미지.</figcaption>
  </figure>
  <figure>
    <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Gemini_Generated_Image_axczr1.max-1600x1600.format-webp.webp" alt="교회와 다른 건물들의 조각을 포함하는 블록 퍼즐 게임의 3D 렌더링을 보여주는 AI 이미지.">
    <figcaption>사랑스러운 초현실주의 이미지.</figcaption>
  </figure>
  <figure>
    <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Gemini_Generated_Image_ghcngj.max-1600x1600.format-webp.webp" alt="구시대 복장을 한 사람들 위에 떠 있는 우주선을 보여주는 AI 이미지.">
    <figcaption>사랑스러운 초현실주의 이미지.</figcaption>
  </figure>
</div>

그녀의 배경이 유용하게 작용합니다. "저는 살바도르 달리가 플랑드르 예술에서 영감을 받았다는 것을 알고 있었기 때문에, Gemini에게 플랑드르 화가들의 스타일로 게임들의 초현실주의 이미지를 생성해달라고 요청했습니다," Anna가 말합니다. 결과물 이미지들은 채팅 그룹에서 바이럴이 되어, 이모지 하트와 수많은 긍정적인 댓글들을 끌어모았습니다.

더 최근에, Anna는 Veo를 사용하여 스톱모션, 종이 공예 장면들이 특징인 짧은 ASMR 스타일 비디오 시리즈를 제작했습니다. 그녀는 바베큐되는 꼬치 — 구겨진 종이 "고기" 덩어리들이 구겨진 종이 "숯" 더미 위에서 회전하는 — 와 분홍색 플라밍고가 진정시키는 퍼덕임과 휙 소리와 함께 종이 날개를 퍼덕이는 비디오를 만들었습니다.

"Veo 3는 고품질 비디오와 정말 강력한 사운드를 제공합니다," Anna가 말합니다. "이 비디오들에서 종이가 바스락거리는 소리는 정말 만족스러운 무언가가 있어요."

<iframe src="https://www.youtube.com/embed/FghHya906cU" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

*종이로 렌더링된 뜨거운 숯불 위의 고기 꼬치.*

다른 사람들도 동의하는 것 같습니다. Anna의 창작물들이 채팅에서 진지한 이모지 사랑을 받고 있을 뿐만 아니라, Google 전체의 마케팅 팀들이 그녀의 작품들을 우리의 소셜 채널에서 선보이기 위해 연락해왔습니다. 그녀는 또한 자신의 소셜 미디어에 작품들을 게시하는데, Google 외부의 사람들이 그녀의 프롬프팅 조언을 요청해왔습니다.

"문제는," Anna가 말합니다, "사실 프롬프트를 작성하는 것은 Gemini라는 거예요."

Anna는 "메타 프롬프팅"이라고 알려진 접근 방식을 사용합니다. 특정 장면을 위한 프롬프트를 작성하는 대신, 그녀는 Gemini에게 여러 다른 장면들을 위한 상세한 프롬프트를 작성해달라고 요청합니다 — 때로는 한 번에 5-10개씩 — Flow나 Gemini 앱에서 사용하기 위해서요. 결과물 프롬프트들은 믿을 수 없이 길고 구체적일 수 있습니다 — 때로는 여러 페이지에 달하며 — 숨막히는 결과물을 만들어냅니다. 하지만 그녀가 Gemini에게 프롬프트를 만드는 방법을 지시하는 데 사용하는 프롬프트들이 핵심입니다.

![왼쪽에는 Anna의 메타 프롬프트가 노란색 텍스트로, '스타일은 스톱모션 비디오여야 함'과 '가장 창의적이고, 인상적이고, 즐거운 프롬프트를 생각해보세요' 같은 지시사항과 함께. 오른쪽에는 Gemini가 생성한 결과 프롬프트 예시가 흰색 텍스트로.](https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Screenshot_2025-10-02_3.40.56_PM.width-1000.format-webp.webp)

*Anna의 메타 프롬프트는 Gemini가 생성형 AI 모델을 지시하기 위한 풍부하게 상세한 프롬프트를 생성하도록 영감을 줍니다.*

"여기에는 규칙이 없습니다 — 우리는 실험하고 있으니까요 — 하지만 Gemini가 정말 풍부한 프롬프트를 만들도록 이끄는 몇 가지를 발견했습니다," 그녀가 말합니다. "매우 구체적인 작업을 정의해야 합니다: 'LLM이 이해할 수 있는 상세한 프롬프트를 작성해줘.' 그리고 형식과 스타일에 대해 명확해야 합니다: 예를 들어, 종이 공예 장면의 8초짜리 스톱모션 애니메이션. 그런 다음 일반적인 종이가 아니라, 호일 종이나 반짝이는 종이 같은 제약 조건을 주세요. 그리고 나서 그것이 일을 하도록 놔두세요."

모델이 Gemini의 프롬프트에 어떻게 반응하느냐에 따라, 그것들을 수정하고 싶을 수 있다고 그녀는 말합니다. 당신이 생성하고 싶은 소리와 질감에 대한 세부사항을 추가하거나 변경하세요 — 그것은 협업입니다. 당신은 또한 감정적이 되고 싶을 수도 있습니다. "불러일으키고 싶은 감정을 제안하는 것이 도움이 된다는 것을 발견했습니다," 그녀가 덧붙입니다. "예를 들어, Gemini에게 '보기에 만족스러운 장면들'에 대해 생각하기를 원한다고 말하세요."

그러한 지시사항과 식물 예술을 만드는 작업으로, Gemini는 "애니메이션은 느리고 매혹적이어야 하며, 각 잎이 부드럽고 리드미컬한 순서로 섬세하게 펼쳐져야 합니다"라는 펼쳐지는 종이 고사리를 위한 프롬프트를 전달했습니다. Veo는 과제를 이해했습니다.

<iframe src="https://www.youtube.com/embed/0yg4Z_NM1Lw" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

*종이로 만든 말린 고사리가 펼쳐지는 모습.*

Anna의 고사리와 깃털은 그녀의 핵심 업무의 일부가 아닙니다: 일상적으로, 그녀는 Google DeepMind의 연구원들이 AI 실험을 확장할 수 있도록 인프라와 도구를 구축하는 것을 돕습니다. 하지만 그것은 여유 시간 10분을 찾을 때 그녀에게 기쁨을 주는 것이고, 그녀는 기꺼이 사랑을 나눕니다. (그녀는 심지어 자신의 배움을 전달하기 위해 데크를 만들었습니다.)

구글러들에게… 그리고 듣고 있는 다른 모든 사람들에게 그녀의 가장 큰 팁은? "당신이 좋아하는 주제를 선택하고 그냥 실험을 시작하세요," 그녀가 말합니다. "저도 그렇게 했고, 아직도 배우고 있습니다 — 그리고 재미있게 하고 있어요."
