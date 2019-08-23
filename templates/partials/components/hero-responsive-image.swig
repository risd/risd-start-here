{#

Expects
{
  mobile_image: webhook image,
  image: webhook image,
  cls: '', // class image will be applied to
}

#}

{% set styles = [{
  mediaQuery: '@media screen and (max-width: 360px)',
  imageSize: 360,
}, {
  mediaQuery: '@media screen and (min-width: 361px)',
  imageSize: 768,
}, {
  mediaQuery: '@media screen and (min-width: 769px)',
  imageSize: 834,
}, {
  mediaQuery: '@media screen and (min-width: 835px)',
  imageSize: 1024,
}, {
  mediaQuery: '@media screen and (min-width: 1025px)',
  imageSize: 1200,
}, {
  mediaQuery: "@media screen and (min-width: 1201px)",
  imageSize: 1400,
}] %}

{% for style in styles %}
  {% if loop.first %}
  <style>  
  {% endif %}

  {% if style.imageSize < 512 && mobile_image %}
    {% set imageUrl = mobile_image|imageSize(style.imageSize) %}
  {% elseif image %}
    {% set imageUrl = image|imageSize(style.imageSize) %}
  {% else %}
    {% set imageUrl = mobile_image|imageSize(style.imageSize) %}
  {% endif %}

  {{ style.mediaQuery }} {
    .{{ cls }} {
      background-image: url("{{ imageUrl }}");
    }
  }
  
  {% if loop.last %}
  </style>
  {% endif %}
{% endfor %}


