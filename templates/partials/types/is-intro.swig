{% if intro.title || intro.description %}
  {% set intro._is_intro = true %}
{% else %}
  {% set intro._is_intro = false %}
{% endif %}
