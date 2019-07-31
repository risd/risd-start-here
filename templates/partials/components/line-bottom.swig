{# 

Expects
{
  points: '',
  // global counter object
  counter: {
    links
  },
}

#}

{% if points %}
  {% set counter.lines = counter.lines + 1 %}
  {% set line_points = points %}

  <div class="line-svg__container">
    <svg class="line-svg line-svg--bottom">
      <defs>
        <clipPath id="cut-above-line-{{ counter.lines }}">
          <polygon points="{{ lineSVGAboveClipPoints({points:line_points}) }}"></polygon>
        </clipPath>
      </defs>

      <rect height="{{ lineSVGHeight }}px" width="{{ lineSVGWidth }}px" class="line-svg__rect line-svg__above" clip-path="url(#cut-above-line-{{ counter.lines }})"></rect>

      <polyline class="line-svg__line" points="{{ line_points }}" />

    </svg>
  </div>
{% endif %}
