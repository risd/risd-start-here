{#

Expects: {
  item: { _is_link }
  counter: { links: }
}

Defines: {
  item: { _is_link, number }
}

#}

{% set counter.links = counter.links + 1 %}
{% set item.number = counter.links %}
