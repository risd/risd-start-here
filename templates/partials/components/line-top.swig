{# 

Expects
{
  points: '',
  // global counter object
  counter: {
    links
  },
  includeRectAbove: boolean?
}

#}

{% if points %}
  {% set counter.lines = counter.lines + 1 %}
  {% set line_points = points %}

  <div class="line-svg__container">
    <svg class="line-svg line-svg--top">
      <defs>
        <clipPath id="cut-below-line-{{ counter.lines }}">
          <polygon points="{{ lineSVGBelowClipPoints({points:line_points}) }}"></polygon>
        </clipPath>
        {% if includeRectAbove %}
        <clipPath id="cut-above-line-{{ counter.lines }}">
          <polygon points="{{ lineSVGAboveClipPoints({points:line_points}) }}"></polygon>
        </clipPath>
        {% endif %}
      </defs>

      {% if includeRectAbove %}
      <rect height="{{ lineSVGHeight }}px" width="{{ lineSVGWidth }}px" class="line-svg__rect line-svg__above" clip-path="url(#cut-above-line-{{ counter.lines }})"></rect>
      {% endif %}

      <rect height="{{ lineSVGHeight }}px" width="{{ lineSVGWidth }}px" class="line-svg__rect line-svg__below" clip-path="url(#cut-below-line-{{ counter.lines }})"></rect>

      <polyline class="line-svg__line" points="{{ line_points }}" />

    </svg>
  </div>
{% endif %}
