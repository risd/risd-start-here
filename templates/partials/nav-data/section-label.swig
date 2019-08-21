{#

Expects
{
  item: {
    _is_section_label: boolean,
    _type: 'section-label',
    section_label: ''?,
    section_label_prefix: ''?
  }
}

#}

{% if item._is_section_label %}
  {% set anchor = item.section_label|slugify %}

  {% set html = '<span class="nav__text-wrapper">' %}

  {% if item.section_label_prefix %}
    {% set html = html + '<span class="nav__text--prefix">' + item.section_label_prefix +'</span>' %}
  {% endif %}

  {% if item.section_label %}
    {% set html = html + '<span class="nav__text--normal">' + item.section_label + '</span>' %}
  {% endif %}

  {% set html = html + '</span>' %}

  {% set item.nav = {
    html: html,
    url: '#' + anchor,
  } %}
{% endif %}
