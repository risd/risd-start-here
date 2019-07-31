{# 

Expects
{
  points: {
    id: Int,
    string: ''
  },
  // global counter object
  counter: {
    links
  },
  includeRectAbove: boolean?
}

`points.id` is used to link multiple sets of points
used across `line-top` & `line-bottom` components,
allowing for the front end to adjust their points
together.

`includeReactAbove` adds a `rect` & `clipPath` that
reserved for only those situations where the component
above the one being rendered does not have its own
`rect` & `clipPath`. for instance, the `hero` component
has a video in the background, and does not include
its own line break svg.

#}

{% if points.id && points.string %}
  {% set line_id = points.id %}
  {% set line_points = points.string %}

  <div class="line-svg__container">
    <svg class="line-svg line-svg--top" data-line-id={{ line_id }}>
      <defs>
        <clipPath id="cut-below-line-{{ line_id }}">
          <polygon points="{{ lineSVGBelowClipPoints({points:line_points}) }}"></polygon>
        </clipPath>
        {% if includeRectAbove %}
        <clipPath id="cut-above-line-{{ line_id }}--top">
          <polygon points="{{ lineSVGAboveClipPoints({points:line_points}) }}"></polygon>
        </clipPath>
        {% endif %}
      </defs>

      {% if includeRectAbove %}
      <rect height="{{ lineSVGHeight }}px" width="{{ lineSVGWidth }}px" class="line-svg__rect line-svg__above" clip-path="url(#cut-above-line-{{ line_id }}--top)"></rect>
      {% endif %}

      <rect height="{{ lineSVGHeight }}px" width="{{ lineSVGWidth }}px" class="line-svg__rect line-svg__below" clip-path="url(#cut-below-line-{{ line_id }})"></rect>

      <polyline class="line-svg__line" points="{{ line_points }}" />

    </svg>
  </div>
{% endif %}
