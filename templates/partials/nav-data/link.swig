{#

Expects
{
  item: {
    _is_link: boolean,
    _type: 'link',
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

  {% set item.nav = {
    text: item.link_text,
    url: '#' + section_label,
  } %}
{% endif %}
