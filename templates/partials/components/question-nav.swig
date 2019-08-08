{#

Expects
{
  item: {
    _is_question: boolean,
    _is_even: boolean,
    number: Int,
    question: '',
    answer: wysiwyg,
    question_animation: LottieJSON,
  }
}

#}

{% if item._is_question %}
  {% set section_id = 'question-' + item.number %}

  {% if item.question %}
    {% set section_label = item.question|slugify %}
    {% set item.nav = {
      text: item.number + '. ' + item.question,
      url: '#' + section_label,
    } %}
  {% else %}
    {% set section_label = null %}
    {% set item.nav = {
      text: section_id,
      url: '#' + section_id,
    } %}
  {% endif %}
{% endif %}
