{% set hero = {
    image: cms.listofquestions.hero_image,
    video: cms.listofquestions.hero_video,
    title: cms.listofquestions.hero_title,
    description: cms.listofquestions.hero_description,
    id: 'home',
  }
%}
  
{# adds hero._is_hero #}
{% include 'templates/partials/types/is-hero.swig' with { hero: hero } %}
