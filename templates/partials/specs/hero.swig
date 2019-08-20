{% set hero = {
    image: cms.listofquestions.hero_image,
    mobile_image: cms.listofquestions.hero_image_mobile,
    video: cms.listofquestions.hero_video,
    video_mobile: cms.listofquestions.hero_video_mobile,
    title: cms.listofquestions.hero_title,
    description: cms.listofquestions.hero_description,
    id: 'home',
  }
%}
  
{# adds hero._is_hero #}
{% include 'templates/partials/types/is-hero.swig' with { hero: hero } %}
