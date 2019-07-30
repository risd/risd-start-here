{% if hero.video || hero.title || hero.description %}
  {% set hero._is_hero = true %}
{% else %}
  {% set hero._is_hero = false %}
{% endif %}
