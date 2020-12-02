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

    {% for row in item.related_gallery.gallery %}
      {% if loop.first %}
        <div class="gallery__content">
          <ul class="gallery__slider" data-slider="{{ item.number }}">
      {% endif %}
          <li class="slide">
            <figure data-type="image" class="wy-figure-full" data-slider="{{ item.number }}">
              <a href="{{ row.link_url }}" target="_blank" rel="noopener" data-lazy-load-type="img" data-lazy-load-src="{{ row.image|imageSize(600) }}"></a>
              <figcaption><a href="{{ row.link_url }}" target="_blank" rel="noopener">{{ row.link_text }}</a></figcaption>
            </figure>
          </li>
      {% if loop.last %}
          </ul>
        </div>
      {% endif %}
    {% endfor %}

    </div>

    {% if linePoints.bottom %}
      {% include 'templates/partials/components/line-bottom.swig' with { points: linePoints.bottom } %}
    {% endif %}
  </section>
{% endif %}
