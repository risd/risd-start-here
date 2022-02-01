{#

Expects
{
  item: {
    _is_question: boolean,
    _is_even: boolean,
    _type: 'question',
    number: Int,
    question: '',
    answer: wysiwyg,
    question_animation: LottieJSON,
    _section_id: ''?,
    related_gallery?: {
      gallery? : [{
        image,
        link_text,
        link_url
      }]
    },
  }
  linePoints: {
    top: '',
    bottom: '',
  }
}

#}

{% if item._is_question %}
  {% if item._section_id %}
    {% set section_id = item._section_id %}
  {% else %}
    {% set section_id = 'question-' + item.number %}
  {% endif %}

  {% if item.question %}
    {% set section_label = item.question|slugify %}
  {% else %}
    {% set section_label = null %}
  {% endif %}

  {% set questionContainerClass = isEvenOrOdd( item.number, 'question-container--even', 'question-container--odd' ) %}
  
  <section
    class="question-container {{ questionContainerClass }}"
    id="{{ section_id }}"
    {% if section_label %}
    aria-labelledby="{{ section_label }}"
    {% endif %}
    >

    {% if linePoints.top %}
      {% include 'templates/partials/components/line-top.swig' with { points: linePoints.top } %}
    {% endif %}

    <h3 class="number">{{ item.number }}</h3>
      
    {% if item.question %}
      <div class="question">
        <h2 class="question__text" id="{{ section_label }}">{{ item.question }}</h2>
      </div>
    {% endif %}
    
    {% if item.answer %}
      <div class="answer">
        {{ item.answer|format_wysiwyg|safe }}

        {% include 'templates/partials/components/slider.swig' with {
          number: item.number,
          gallery: item.related_gallery.gallery,
        } %}

        {% if item.question_footer_link_text %}
          {% if item.question_footer_link_url %}
            <a
              href="{{ item.question_footer_link_url }}"
              class="question-footer-link-anchor"
              {{ openInNewWindowIfExternalLink(item.question_footer_link_url) }}>
          {% endif %}

          <h2 class="question-footer__link-text">{{ item.question_footer_link_text }}</h2>

          {% if item.question_footer_link_url %}
            </a>
          {% endif %}
        {% endif %}
      </div>
    {% endif %}
      
    {% if linePoints.bottom %}
      {% include 'templates/partials/components/line-bottom.swig' with { points: linePoints.bottom } %}
    {% endif %}
  </section>
{% endif %}
