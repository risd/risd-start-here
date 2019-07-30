{# 

Expects
{
  line: {
    above:
      'hero'|
      'intro'|
      'question-odd'|
      'question-even'|
      'gallery'|
      'link'
      null,
    below: 
      'intro'|
      'question-odd'|
      'question-even'|
      'gallery'|
      'link'
      null,
  }
}

hero

line--transparent-transparent-intro
  above - transparent
  line - transparent
  below - intro

intro

line--intro-transparent-qaodd
  above - intro
  line - tranparent
  below - qaodd
  below:hover - qaodd

qaodd

line qaodd qaeven qaeven

qaeven

line qaeven transparent link

link

line link transparent qaodd

qaodd

line qaodd tranparent gallery

gallery

line gallery transparent qaeven

qaeven

line qaeven qaodd qaodd

qaodd

line qaodd tranpsarent link

#}

{% if line.above !== null && line.below !== null %}
  {% set line.count = line.count + 1 %}
  {% set line_svg_classes = {
    above: 'line-svg__above--' + line.above,
    line: 'line-svg__line--' + line.below,
    below: 'line-svg__below--' + line.below,
  } %}
  {% set line_points = lineSVGPoints() %}
  <div class="line-svg__container">
    <svg class="line-svg {{ line_style_class }}">
      <defs>
        <clipPath id="cut-above-line-{{ line.count }}">
          <polygon points="{{ lineSVGAboveClipPoints({points:line_points}) }}"></polygon>
        </clipPath>
        <clipPath id="cut-below-line-{{ line.count }}">
          <polygon points="{{ lineSVGBelowClipPoints({points:line_points}) }}"></polygon>
        </clipPath>
      </defs>

      <rect height="{{ lineSVGHeight }}px" width="{{ lineSVGWidth }}px" class="line-svg__above {{ line_svg_classes.above }}" clip-path="url(#cut-above-line-{{ line.count }})"></rect>
      <rect height="{{ lineSVGHeight }}px" width="{{ lineSVGWidth }}px" class="line-svg__below {{ line_svg_classes.below }}" clip-path="url(#cut-below-line-{{ line.count }})"></rect>

      <polyline class="line-svg__line {{ line_svg_classes.line }}" points="{{ line_points }}" />

    </svg>
  </div>
{% endif %}
