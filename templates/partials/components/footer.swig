{#

Expects
{
  item: {
    _is_footer: boolean,
    footer_contact: wysiwyg,
    footer_link_groups: [
      [{ text, url, class }],
      [{ text, url, class }],
    ],
  }
  linePoints: {
    top: '',
  }
}

#}

{% if item._is_footer %}
  <footer
    class="footer"
    id="footer">

  {% if linePoints.top %}
    {% include 'templates/partials/components/line-top.swig' with { points: linePoints.top } %}
  {% endif %}


  <div class="footer__container">

    <div class="footer__logo">
      {% include 'templates/partials/components/footer/seal.html' %}
      {% include 'templates/partials/components/footer/simplified-seal.html' %}
    </div>

    {% if item.footer_contact %}
      <div class="footer__item">{{ item.footer_contact|safe }}</div>
    {% endif %}
    
    {% for group in item.footer_link_groups %}
    {% for link in group %}
      {% if loop.first %}
        <div class="footer__item">
      {% endif %}
          <h4 class="footer__title {{ link.class }}">
            <a href="{{ link.url }}"
              {{ openInNewWindowIfExternalLink(link.url) }}>
              {{ link.text }}
            </a>
          </h4>
      {% if loop.last %}
        </div>
      {% endif %}
    {% endfor %}
  {% endfor %}
  </div>
  <div class="footer__copyright">
    © Rhode Island School of Design
  </div>
</footer>
{% endif %}
