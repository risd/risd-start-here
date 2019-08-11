{#

Expects
{
  hero: {
    _is_hero: boolean,
    video?: url,
    title?: '',
    description?: wysiwyg,
    id: '',
  }
}

#}

{% if hero._is_hero %}
<section class="hero" id="{{ hero.id }}">

  <div class="hero__logo hero__logo--left">
    {% include 'templates/partials/risd-seal.html' %}  
  </div>

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

  <div class="hero__logo hero__logo--right">
    {% include 'templates/partials/risd-seal.html' %}  
  </div>
</section>
{% endif %}
