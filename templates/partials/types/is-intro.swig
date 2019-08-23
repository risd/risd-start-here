{% if intro.title || intro.description %}
  {% set intro._is_intro = true %}
  {% set intro._type = 'intro' %}
{% else %}
  {% set intro._is_intro = false %}
{% endif %}
