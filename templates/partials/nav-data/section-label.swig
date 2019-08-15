{#

Expects
{
  item: {
    _is_section_label: boolean,
    _type: 'section-label',
    number: Int,
    link_url: '',
    link_text: '',
    link_animation: LottieJSON,,
  }
}

#}

{% if item._is_section_label %}
  {% set anchor = item.section_label|slugify %}

  {% set item.nav = {
    text: item.section_label,
    url: '#' + anchor,
  } %}
{% endif %}
