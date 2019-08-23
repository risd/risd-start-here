{#

Expects: {
  item: { _is_gallery }
  counter: { galleries: }
}

Defines: {
  item: { _is_gallery, number }
}

#}

{% set counter.galleries = counter.galleries + 1 %}
{% set item.number = counter.galleries %}
