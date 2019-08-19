{#

Expects
{
  item: {
    _is_footer: boolean,
  }
  linePoints: {
    top: '',
  }
}

#}

{% if item._is_footer %}
  <section
    class="footer"
    id="#footer">

    {% if linePoints.top %}
      {% include 'templates/partials/components/line-top.swig' with { points: linePoints.top } %}
    {% endif %}

    <div class="footer__content">
      <h3 class="footer__text">footer</h3>
    </div>
  </section>
{% endif %}
