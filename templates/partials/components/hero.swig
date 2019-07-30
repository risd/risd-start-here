{#

Expects
{
  hero: {
    video?: url,
    title?: '',
    description?: wysiwyg,
  }
}

#}

{# adds hero._is_hero #}
{% include 'templates/partials/components/is-hero.swig' with { hero: hero } %}

{% if hero._is_hero %}
<section class="hero">

  {% if hero.title || hero.description %}
    <div class="hero__text-container">
  {% endif %}
  {% if hero.title %}
    <h1 class="hero__title">{{ hero.title }}</h1>
  {% endif %}
  {% if hero.description %}
    <div class="hero__description">{{ hero.description|safe }}</div>
  {% endif %}
  {% if hero.title || hero.description %}
    </div>
  {% endif %}

</section>
{% endif %}
