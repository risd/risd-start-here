{#

Expects
{
  numer: Integer,
  gallery: [{
    image: WebhookImage,
    link_test: string,
    link_url: string,
  }]
}

#}

{% for row in gallery %}
  {% if loop.first %}
    <ul class="gallery__slider" data-slider="{{ number }}">
  {% endif %}
      <li class="slide">
        <figure data-type="image" class="wy-figure-full" data-slider="{{ number }}">
          <a href="{{ row.link_url }}" target="_blank" rel="noopener" data-lazy-load-type="img" data-lazy-load-src="{{ row.image|imageSize(600) }}"></a>
          <figcaption><a href="{{ row.link_url }}" target="_blank" rel="noopener">{{ row.link_text }}</a></figcaption>
        </figure>
      </li>
  {% if loop.last %}
    </ul>
  {% endif %}
{% endfor %}
