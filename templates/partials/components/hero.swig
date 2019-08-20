{#

Expects
{
  hero: {
    _is_hero: boolean,
    image?: webhook image,
    mobile_image?: webhook image,
    video?: embedly response,
    video_mobile?: embedly response,
    title?: '',
    description?: wysiwyg,
    id: '',
  }
}

#}

{% if hero._is_hero %}
<section class="hero" id="{{ hero.id }}">

  <div class="hero__container">

    {% if hero.image %}
      {% set heroImageClass = 'hero__image' %}
      {% include 'templates/partials/components/hero-responsive-image.swig' with {
        mobile_image: hero.mobile_image,
        image: hero.image,
        cls: heroImageClass,
      } %}
      <div class="{{ heroImageClass }}"></div>
    {% endif %}

    {% if hero.video %}
      {% set videoID = hero.video.original_url|replace('https://vimeo.com/', '', 'g') %}
      {% set videoWidth = hero.video.width %}
      {% set videoHeight = hero.video.height %}
      {% set videoWidthRatio = videoWidth / videoHeight * 100 %}
      {% set videoHeightRatio = videoHeight / videoWidth  * 100 %}

      <iframe
        class="hero__video hero__video--landscape"
        src="https://player.vimeo.com/video/{{ videoID }}?background=1"
        frameborder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen
        allow=autoplay
        style="min-width: {{ videoWidthRatio }}vh; height: {{ videoHeightRatio }}vw;"></iframe>
    {% endif %}
    
    {% if hero.video_mobile %}
      {% set videoID = hero.video_mobile.original_url|replace('https://vimeo.com/', '', 'g') %}
      {% set videoWidth = hero.video_mobile.width %}
      {% set videoHeight = hero.video_mobile.height %}
      {% set videoWidthRatio = videoWidth / videoHeight * 100 %}
      {% set videoHeightRatio = videoHeight / videoWidth  * 100 %}

      <iframe
        class="hero__video hero__video--portrait"
        src="https://player.vimeo.com/video/{{ videoID }}?background=1"
        frameborder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen
        allow=autoplay
        style="min-width: {{ videoWidthRatio }}vh; height: {{ videoHeightRatio }}vw;"></iframe>
    {% endif %}

    <div class="hero__logo hero__logo--left">
      {% include 'templates/partials/risd-seal.html' %}  
    </div>

    {% if hero.title || hero.description %}
      <div class="hero__text-container">
    {% endif %}
    
    {% if hero.title %}
      <h1 class="hero__title">{{ hero.title }}</h1>
    {% endif %}
    {% if hero.description %}
      <div class="hero__description">{{ hero.description|safe }}</div>
    {% endif %}
    {% if hero.title || hero.description %}
      </div>
    {% endif %}

    <div class="hero__logo hero__logo--right">
      {% include 'templates/partials/risd-seal.html' %}  
    </div>
  </div>
</section>
{% endif %}
