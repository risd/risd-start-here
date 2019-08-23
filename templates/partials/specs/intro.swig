{% set intro = {
    title: cms.listofquestions.intro_title,
    description: cms.listofquestions.intro_description,
  }
%}

{# adds intro._is_intro #}
{% include 'templates/partials/types/is-intro.swig' with { intro: intro } %}
