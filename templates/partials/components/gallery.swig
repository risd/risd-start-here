{#

Expects
{
  item: {
    _is_gallery: boolean,
    _type: 'gallery',
    number: Int,
    related_gallery: {
      name: '',
      description: ''?,
      gallery: [{
        image: WebhookImage,
        link_text: '',
        link_url: '',
      }],
    },
    _section_id: ''?,
  }
  linePoints: {
    top: '',
    bottom: '',
  }
}

#}

{% if item._is_gallery %}
  {% if item._section_id %}
    {% set gallery_id = item._section_id %}
  {% else %}
    {% set gallery_id = 'gallery-' + item.number %}
  {% endif %}

  {% if item.related_gallery.name %}
    {% set section_label = item.related_gallery.name|slugify %}
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

    {% if linePoints.top %}
      {% include 'templates/partials/components/line-top.swig' with { points: linePoints.top } %}
    {% endif %}

    <div class="gallery">
      
    {% if item.related_gallery.name %}
      <h3 class="gallery__title" id="{{ section_label }}">{{ item.related_gallery.name }}</h3>
    {% endif %}

    {% if item.related_gallery.description %}
      <div class="gallery__description">{{ item.related_gallery.description|safe }}</div>
    {% endif %}


    {% if item.related_gallery.gallery|size > 0 %}
      <div class="gallery__content">
    {% endif %}
      {% include 'templates/partials/components/slider.swig' with {
        number: item.number,
        gallery: item.related_gallery.gallery,
      } %}
    {% if item.related_gallery.gallery|size > 0 %}
      </div>
    {% endif %}

    </div>

    {% if linePoints.bottom %}
      {% include 'templates/partials/components/line-bottom.swig' with { points: linePoints.bottom } %}
    {% endif %}
  </section>
{% endif %}
