{#

Expects
{
  item: {
    _is_footer: boolean,
    footer_contact: wysiwyg,
    footer_link_groups: [
      [{ text?, html?, url, class }],
      [{ text?, html?, url, class }],
    ],
    seal_link: ''?
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
      {% if item.seal_link %}
        <a href="{{ item.seal_link }}"
            {{ openInNewWindowIfExternalLink(item.seal_link) }}>
      {% endif %}
      {% include 'templates/partials/components/footer/seal.html' %}
      {% include 'templates/partials/components/footer/simplified-seal.html' %}
      {% if item.seal_link %}
        </a>
      {% endif %}
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
              {% if link.html %}
                {{ link.html|safe }}
              {% else %}
                {{ link.text }}
              {% endif %}
              {% if link.class === 'nav__link--button' %}
                <span class="nav__text--external">
                  {% include 'templates/partials/components/nav/arrow-right.svg' %}
                </span>
              {% endif %}
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
