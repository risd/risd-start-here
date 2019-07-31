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
}

#}

{% if item._is_link %}
  {% set link_id = 'link-' + item.number %}

  {% set section_label = item.link_text|slugify %}

  <section
    class="link-container"
    id="{{ link_id }}"
    aria-labelledby="{{ section_label }}">
    {% if item.link_url %}
      <a
        href="{{ item.link_url }}"
        class="link-anchor"
        {{ openInNewWindowIfExternalLink(item.link_url) }}>
    {% endif %}
    
    <h2 class="link-text" id="{{ section_label }}">{{ item.link_text }}</h2>

    {% if item.link_url %}
      </a>
    {% endif %}
  </section>
{% endif %}
