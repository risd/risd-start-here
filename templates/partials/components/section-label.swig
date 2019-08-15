{#

Expects
{
  item: {
    _is_section_label: boolean,
    _type: 'section-label',
    section_label: '',
  }
}

#}

{% if item._is_section_label %}
  {% set section_label = item.section_label|slugify %}

  <section
    class="section-label"
    id="{{ section_label }}">
  </section>
{% endif %}
