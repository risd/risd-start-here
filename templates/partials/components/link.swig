{#

Expects
{
  item: {
    _is_link: boolean,
    number: Int,
    link_url: '',
    link_text: '',
    link_animation: LottieJSON,,
  }
  linePoints: {
    top: '',
    bottom: '',
  }
}

#}

{% if item._is_link %}
  {% set link_id = 'link-' + item.number %}

  {% set section_label = item.link_text|slugify %}

  <section
    class="link"
    id="{{ link_id }}"
    aria-labelledby="{{ section_label }}">
    
    {% if item.link_url %}
      <a
        href="{{ item.link_url }}"
        class="link__anchor"
        {{ openInNewWindowIfExternalLink(item.link_url) }}>
    {% endif %}

    {% if linePoints.top %}
      {% include 'templates/partials/components/line-top.swig' with { points: linePoints.top } %}
    {% endif %}
    
    <h3 class="link__text" id="{{ section_label }}">{{ item.link_text }}</h3>

    {% if linePoints.bottom %}
      {% include 'templates/partials/components/line-bottom.swig' with { points: linePoints.bottom } %}
    {% endif %}

    {% if item.link_url %}
      </a>
    {% endif %}
  </section>
{% endif %}
