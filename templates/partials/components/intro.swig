{#

Expects
{
  item: {
    _is_intro
    title?: '',
    description?: wysiwyg,
  }
  linePoints: {
    top: '',
    bottom: '',
  }
}

#}

{% if item._is_intro %}
<section class="intro">

  {% if linePoints.top %}
    {% include 'templates/partials/components/line-top.swig' with { points: linePoints.top } %}
  {% endif %}

  <div class="intro__text-container">
  {% if item.title %}
    <h2 class="intro__title">{{ item.title }}</h2>
  {% endif %}
  {% if item.description %}
    <div class="intro__description">{{ item.description|safe }}</div>
  {% endif %}
  </div>

  {% if linePoints.bottom %}
    {% include 'templates/partials/components/line-bottom.swig' with { points: linePoints.bottom } %}
  {% endif %}

</section>
{% endif %}
