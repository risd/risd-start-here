{#

Expects
{
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

  {% set imageUrl = image|imageSize(style.imageSize) %}
  {{ style.mediaQuery }} {
    .{{ cls }} {
      background-image: url("{{ imageUrl }}");
    }
  }
  
  {% if loop.last %}
  </style>
  {% endif %}
{% endfor %}


