{# 

Expects
{
  points: '',
  // global counter object
  counter: {
    links
  },
}

`points.id` is used to link multiple sets of points
used across `line-top` & `line-bottom` components,
allowing for the front end to adjust their points
together.

#}

{% if points %}
  {% set line_id = points.id %}
  {% set line_points = points.string %}

  <div class="line-svg__container line-svg--bottom">
    <svg class="line-svg" data-line-id={{ line_id }}>
      <defs>
        <clipPath id="cut-above-line-{{ line_id }}">
          <polygon points="{{ lineSVGAboveClipPoints({points:line_points}) }}"></polygon>
        </clipPath>
      </defs>

      <rect height="{{ lineSVGHeight }}px" width="{{ lineSVGWidth }}px" class="line-svg__rect line-svg__above" clip-path="url(#cut-above-line-{{ line_id }})"></rect>

      <polyline class="line-svg__line" points="{{ line_points }}" />

    </svg>
  </div>
{% endif %}
