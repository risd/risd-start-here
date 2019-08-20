{#

Expects
{
  items: [{
    text: '',
    url: '',
    class: ''?,
  }],
  title: {
    text: '',
    url: '',
  },
  seal_link: ''?
}

#}

{% set navItemClass = 'nav__item' %}

{% for item in items %}
  {% if loop.first %}
  <header class="nav__container">
    <nav class="nav">

      <div class="nav__list">
        <h3 class="nav__current">
          {% set titleAttributes = 'data-nav-type="title"' %}
          {% if title.url %}
            {% set titleAttributes = titleAttributes + ' data-nav-url="' + title.url + '" ' %}
          {% endif %}
          <span class="nav__text" {{ titleAttributes|safe }}>
          {% if title %}
            {{ title.text }}
          {% endif %}
          </span>
          <span class="nav__open">
            {% include 'templates/partials/components/nav/arrow-down.svg' %}
          </span>
        </h3>
        <ul class="nav__items">
          <li class="nav__close">
            {% include 'templates/partials/components/nav/arrow-up.svg' %}
          </li>
    {% endif %}

          {% set itemAttributes = 'data-nav-url="' + item.url + '" ' +
            'data-nav-type="' + item.type + '"' %}
          <li class="{{ navItemClass }}" {{ itemAttributes|safe }}> 
            <a
              href="{{ item.url }}"
              {{ openInNewWindowIfExternalLink(item.url) }}>
              {{ item.text }}
            </a>
          </li>

    {% if loop.last %}

          {% if title.text && title.url %}
          <li class="{{ navItemClass }}" {{ titleAttributes|safe }}>
            <a
              href="{{ title.url }}"
              {{ openInNewWindowIfExternalLink(title.url) }}>
              {{ title.text }}
            </a>
          </li>
          {% endif %}
          
        </ul>
      </div>
      <div class="nav__seal">
        {% if seal_link %}
          <a href="{{ seal_link }}"
            {{ openInNewWindowIfExternalLink(seal_link) }}>
        {% endif %}
          {% include 'templates/partials/components/nav/simplified-seal.html' %}
        {% if seal_link %}
          </a>
        {% endif %}
      </div>
    </nav>
  </header>
  {% endif %}
{% endfor %}
