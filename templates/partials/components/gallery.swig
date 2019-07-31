{#

Expects
{
  item: {
    _is_gallery: boolean,
    number: Int,
    gallery_title: '',
    gallery_question: wysiwyg,
    gallery_content: wysiwyg,
  }
}

#}

{% if item._is_gallery %}
  {% set gallery_id = 'gallery-' + item.number %}

  {% if item.gallery_title %}
    {% set section_label = item.gallery_title|slugify %}
  {% else %}
    {% set section_label = null %}
  {% endif %}

  <section
    class="gallery-container"
    id="{{ gallery_id }}"
    {% if section_label %}
    aria-labelledby="{{ section_label }}"
    {% endif %}
    >
    {% if item.gallery_title %}
      <h2 class="gallery__title" id="{{ section_label }}">{{ item.gallery_title }}</h2>
    {% endif %}

    {% if item.gallery_description %}
      <div class="gallery__description">{{ item.gallery_description|safe }}</div>
    {% endif %}

    {% if item.gallery_content %}
      <div class="gallery__content">{{ item.gallery_content|rollup_galleries|safe }}</div>
    {% endif %}
  </section>
{% endif %}
