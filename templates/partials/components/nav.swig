{#

Expects
{
  items: [{
    text: '',
    url: '',
  }],
}

#}

{% for item in items %}
  {% if loop.first %}
  <header class="nav__container">
    <nav class="nav">

      <div class="nav__list">
        <h3 class="nav__current">
          <span class="nav__text">Rhode Island School of Design</span>
          <span class="nav__open">
            {% include 'templates/partials/components/nav/arrow-down.svg' %}
          </span>
        </h3>
        <ul class="nav__items">
          <li class="nav__close">
            {% include 'templates/partials/components/nav/arrow-up.svg' %}
          </li>
    {% endif %}

          <li class="nav__item"> 
            <a
              href="{{ item.url }}"
              {{ openInNewWindowIfExternalLink(item.url) }}>
              {{ item.text }}
            </a>
          </li>

    {% if loop.last %}
        </ul>
      </div>
      <div class="nav__seal">
        {% include 'templates/partials/components/nav/simplified-seal.html' %}
      </div>
    </nav>
  </header>
  {% endif %}
{% endfor %}
