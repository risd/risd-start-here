{#

Expects: {
  item: { _is_question }
  counter: { questions: }
}

Defines: {
  item: { _is_question, number, _is_even }
}

#}

{% set counter.questions = counter.questions + 1 %}
{# {% set line_break_sequence.below = questionEvenOrOdd(counter.questions) %} #}
{% set item.number = counter.questions %}
{% set item._is_even = isEvenOrOdd(counter.questions, true, false) %}
