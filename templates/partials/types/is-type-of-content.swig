{#

Expects: {
  item: {}?
  counter: {}?
}

 #}

{% if item.question || item.answer %}
  {% set item._is_question = true %}
  {% set item._type = 'question' %}
  {% include 'templates/partials/specs/question.swig' with {
    item: item,
    counter: counter
  } %}
  {# {% set line_break_sequence.below = 'questeion' %} #}
{% elseif item.related_gallery && (!item.answer) %}
  {% set item._is_gallery = true %}
  {% set item._type = 'gallery' %}
  {% include 'templates/partials/specs/gallery.swig' with {
    item: item,
    counter: counter
  } %}
  {# {% set line_break_sequence.below = 'gallery' %} #}
{% elseif item.link_text %}
  {% set item._is_link = true %}
  {% set item._type = 'link' %}
  {% include 'templates/partials/specs/link.swig' with {
    item: item,
    counter: counter
  } %}
  {# {% set line_break_sequence.below = 'link' %} #}
{% elseif item.section_label || item.section_label_prefix %}
  {% set item._is_section_label = true %}
  {% set item._type = 'section-label' %}
  {% set item.section_label_slug = item.section_label|slugify %}
{% endif %}
