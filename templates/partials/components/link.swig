{#

Expects
{
  item: {
    _is_link: boolean,
    number: Int,
    link_url: '',
    link_text: '',
    link_animation: LottieJSON,
    _section_id: ''?,
  }
  linePoints: {
    top: '',
    bottom: '',
  }
}

#}

{% if item._is_link %}

  {% if item._section_id %}
    {% set link_id = item._section_id %}
  {% else %}
    {% set link_id = 'link-' + item.number %}
  {% endif %}
  
  {% set section_label = item.link_text|slugify %}

  <section
    class="link"
    id="{{ link_id }}"
    aria-labelledby="{{ section_label }}">

    {% if linePoints.top %}
      {% include 'templates/partials/components/line-top.swig' with { points: linePoints.top } %}
    {% endif %}
    
    {% if item.link_url %}
      <a
        href="{{ item.link_url }}"
        class="link__anchor"
        {{ openInNewWindowIfExternalLink(item.link_url) }}>
    {% endif %}
      <div class="link__container">
        <h3 class="link__text" id="{{ section_label }}">{{ item.link_text }}</h3>    
      </div>
    {% if item.link_url %}
      </a>
    {% endif %}

    {% if linePoints.bottom %}
      {% include 'templates/partials/components/line-bottom.swig' with { points: linePoints.bottom } %}
    {% endif %}
  </section>
{% endif %}
