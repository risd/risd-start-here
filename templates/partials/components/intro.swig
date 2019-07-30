{#

Expects
{
  intro: {
    title?: '',
    description?: wysiwyg,
  }
}

#}

{# adds intro._is_intro #}
{% include 'templates/partials/components/is-intro.swig' with { intro: intro } %}

{% if intro._is_intro %}
<section class="intro">

  <div class="intro__text-container">
  {% if intro.title %}
    <h2 class="intro__title">{{ intro.title }}</h2>
  {% endif %}
  {% if intro.description %}
    <div class="intro__description">{{ intro.description|safe }}</div>
  {% endif %}
  </div>

</section>
{% endif %}
